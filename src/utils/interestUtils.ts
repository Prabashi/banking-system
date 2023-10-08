import { InterestRule } from "../models/InterestRule";
import { Transaction } from "../models/Transaction";
import { getDateFromString, roundToDecimalPlaces } from "./utils";
import { TRANSACTION_TYPES } from "../constants/appConstants";
import { ITransaction } from "../models/interfaces/Transaction.interface";
import { IInterestRule } from "../models/interfaces/InterestRule.interface";

// Calculate total interest for a month
export const calculateInterest = (
  eventDates: Date[],
  balance: number,
  transactions: ITransaction[],
  interestRules: IInterestRule[]
): number => {
  let interest = 0;
  const oneDayTS = 24 * 60 * 60 * 1000;

  eventDates?.forEach((date: Date, index: number) => {
    // Get the previous date to calculate the balance for the period
    const prevDate: Date = new Date(
      date.getTime() - oneDayTS === 0 ? 1 : date.getTime() - oneDayTS
    );

    const balanceForDay = getBalanceForDay(prevDate, balance, transactions);
    const ruleForDay = getMatchedRuleForDay(date, interestRules);

    // If there's no rule applicable, return to the next period
    if (!ruleForDay) return;

    // Get the number of days the rule is applied
    const noOfDaysOfRule =
      date.getDate() -
      (index > 0 ? eventDates[index - 1].getDate() : 1) +
      (index === eventDates.length - 1 ? 1 : 0);

    const interestForPeriod =
      (balanceForDay * ruleForDay?.rate * noOfDaysOfRule) / 100;
    interest = interest + interestForPeriod;
  });

  return roundToDecimalPlaces(interest / 365, 2);
};

// Get balance for a given day
export const getBalanceForDay = (
  date: Date,
  balance: number,
  transactions: ITransaction[] | undefined
): number => {
  let dayBalance = balance;
  transactions?.forEach((transaction: ITransaction) => {
    const transactionDate: Date = getDateFromString(transaction.date);
    if (date >= transactionDate) {
      dayBalance = handleBalance(
        transaction.type,
        dayBalance,
        transaction.amount
      );
    }
  });

  return dayBalance;
};

// Get the matching interest rule for a given day
export const getMatchedRuleForDay = (
  date: Date,
  interestRules: IInterestRule[] | undefined
): InterestRule | undefined => {
  let matchedRule = undefined;
  interestRules?.forEach((interestRule: IInterestRule) => {
    const ruleDate: Date = getDateFromString(interestRule.date);

    if (ruleDate < date) {
      matchedRule = interestRule;
    }
  });

  return matchedRule;
};

// Get a list of dates where either a transaction is created or an interest rule is added
export const getDistinctDates = (
  transactions: ITransaction[],
  interestRules: IInterestRule[],
  monthEnd: Date,
  monthStart: Date
): Date[] => {
  const changeDateArray: any[] = [];

  const interestRulesChangesMonth = interestRules
    .filter(
      (interestRule: IInterestRule) =>
        getDateFromString(interestRule.date) < monthEnd &&
        getDateFromString(interestRule.date) >= monthStart
    )
    .map((obj) => getDateFromString(obj.date));

  const trabsactionDateChanges = transactions.map((t: any) =>
    getDateFromString(t.date)
  );

  changeDateArray.push(...interestRulesChangesMonth);
  changeDateArray.push(...trabsactionDateChanges);
  changeDateArray.push(monthEnd);

  // Sort and get distict date array
  let sortedDistinctDateArray = changeDateArray
    .sort((date1, date2) => date1 - date2)
    .filter(
      (date, i, self) =>
        self.findIndex((d) => d.getTime() === date.getTime()) === i
    );

  return sortedDistinctDateArray;
};

export const handleBalance = (
  type: string,
  balance: number,
  amount: number
): number => {
  if (type.toUpperCase() === TRANSACTION_TYPES.DEPOSIT) {
    balance = balance + amount;
  } else {
    balance = balance - amount;
  }

  return balance;
};
