import { InterestRule } from "../models/InterestRule";
import { Transaction } from "../models/Transaction";
import { Account } from "../models/Account";
import {
  getDateFromString,
  getLastDayOfMonth,
  getReport,
  getStringFromDate,
  isValidMonth,
} from "../utils/utils";
import {
  ACCOUNT_OVERVIEW_HEADERS,
  INTEREST_RULES_HEADERS,
  STATEMENT_HEADERS,
} from "../constants/promptConstants";
import {
  INVALID_MONTH_FORMAT_ERR,
  NO_ACCOUNT_ERR,
  MORE_THAN_ONE_RULE_ERR,
} from "../constants/errorMessages";
import { MONTH_START_DATE, INTEREST_TYPE } from "../constants/appConstants";
import {
  calculateInterest,
  getDistinctDates,
  handleBalance,
} from "../utils/interestUtils";

export class BankController {
  private static _instance: BankController;
  private _accounts: Account[] = [];
  private _interestRules: InterestRule[] = [];

  private constructor() {
    this._accounts = [];
  }

  static getInstance(): BankController {
    if (!BankController._instance) {
      BankController._instance = new BankController();
    }
    return BankController._instance;
  }

  private addAccount(account: Account): void {
    this._accounts.push(account);
  }

  public getAccount(accountName: string): Account | undefined {
    return this._accounts.find((account) => account.name === accountName);
  }

  public addAccountTransaction(
    accountName: string,
    date: string,
    type: string,
    amount: string
  ) {
    const account = this.getAccount(accountName);

    let transaction = new Transaction(
      date,
      type,
      amount,
      account
        ? account.transactions.filter((txn) => txn.date === date).length + 1
        : 1
    );

    if (!account) {
      const account = new Account(accountName, transaction);
      this.addAccount(account);
    } else {
      account.addTransaction(transaction);
    }
  }

  public defineInterestRule(date: string, ruleId: string, rate: string) {
    const interestRule = new InterestRule(date, ruleId, parseFloat(rate));
    // If a rule with the same date exists, replace it
    const existingRuleIndex = this._interestRules.findIndex(
      (r) => r.date === interestRule.date
    );
    if (existingRuleIndex !== -1) {
      this._interestRules.splice(existingRuleIndex, 1);
    }
    this._interestRules.push(interestRule);
  }

  public getTransactionOverview(accountName: string): string {
    const transactionInfo: string[][] = [];

    const account = this.getAccount(accountName);

    if (!account) {
      throw new Error(NO_ACCOUNT_ERR);
    }

    account.transactions?.forEach((item) => {
      transactionInfo.push([
        item.date,
        item.uniqueId,
        item.type,
        item.amount.toFixed(2),
      ]);
    });

    return getReport(
      `Account: ${accountName}`,
      ACCOUNT_OVERVIEW_HEADERS,
      transactionInfo
    );
  }

  public getInterestRuleOverview(): string {
    const interestInfo: string[][] = [];

    // Sort the rules by date first
    this._interestRules?.sort(this.sortRulesByDate).forEach((item) => {
      interestInfo.push([item.date, item.ruleId, item.rate.toString()]);
    });

    return getReport("Interest rules:", INTEREST_RULES_HEADERS, interestInfo);
  }

  private sortRulesByDate = (
    firstRule: InterestRule,
    secondRule: InterestRule
  ) => {
    const dateFirstRule = firstRule.date;
    const dateSecondRule = secondRule.date;

    if (dateFirstRule < dateSecondRule) {
      return -1;
    }
    if (dateFirstRule > dateSecondRule) {
      return 1;
    }

    throw new Error(MORE_THAN_ONE_RULE_ERR);
  };

  public getAccountStatement(accountName: string, dateString: string): string {
    if (!isValidMonth(dateString)) {
      throw new Error(INVALID_MONTH_FORMAT_ERR);
    }

    const userIputDateMonthEnd: Date = getLastDayOfMonth(dateString);
    const userInputMonthBegining: Date = getDateFromString(
      dateString + MONTH_START_DATE
    );
    const allTransactions = this.getAccount(accountName)?.transactions;
    let balance = 0;

    allTransactions?.forEach((transaction: Transaction) => {
      const allTransactionDate: Date = getDateFromString(transaction.date);
      if (userInputMonthBegining > allTransactionDate) {
        balance = handleBalance(transaction.type, balance, transaction.amount);
      }
    });

    const transactionsForMonth =
      this.getAccount(accountName)?.getTransactionsForMonth(
        userIputDateMonthEnd
      ) || [];
    const iteratingArr = getDistinctDates(
      transactionsForMonth,
      this._interestRules,
      userIputDateMonthEnd,
      userInputMonthBegining
    );
    const interestTotal = calculateInterest(
      iteratingArr,
      balance,
      transactionsForMonth,
      this._interestRules
    );

    const statement: string[][] = [];

    transactionsForMonth?.forEach((transaction: Transaction) => {
      balance = handleBalance(transaction.type, balance, transaction.amount);
      statement.push([
        transaction.date,
        transaction.uniqueId,
        transaction.type,
        transaction.amount.toString(),
        balance.toString(),
      ]);
    });

    balance = balance + interestTotal;

    statement.push([
      getStringFromDate(userIputDateMonthEnd),
      "           ",
      INTEREST_TYPE,
      interestTotal.toString(),
      balance.toString(),
    ]);

    return getReport(`Account: ${accountName}`, STATEMENT_HEADERS, statement);
  }
}
