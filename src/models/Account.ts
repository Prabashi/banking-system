import {
  INVALID_FIRST_TRANSACTION_ERR,
  TRANSACTION_WITHDRAWAL_ERR,
} from "../constants/errorMessages";
import { getDateFromString } from "../utils/utils";
import { TRANSACTION_TYPES } from "../constants/appConstants";
import { IAccount } from "./interfaces/Account.interface";
import { ITransaction } from "./interfaces/Transaction.interface";

export class Account implements IAccount {
  private _name: string;
  private _transactions: ITransaction[];

  constructor(name: string, transaction: ITransaction) {
    // Check for the first transaction on the account and ensure it's a deposit
    if (transaction.type !== TRANSACTION_TYPES.DEPOSIT) {
      throw new Error(INVALID_FIRST_TRANSACTION_ERR);
    }

    this._name = name;
    this._transactions = [transaction];
  }

  public get name(): string {
    return this._name;
  }

  public get transactions(): ITransaction[] {
    return this._transactions;
  }

  public addTransaction(transaction: ITransaction): void {
    // Calculate the new balance
    const balance = this.transactions.reduce((acc, t) => {
      if (t.type === TRANSACTION_TYPES.DEPOSIT) {
        return acc + t.amount;
      } else {
        return acc - t.amount;
      }
    }, 0);

    // Ensure the balance doesn't go below 0
    if (
      transaction.type === TRANSACTION_TYPES.WITHDRAWAL &&
      balance - transaction.amount < 0
    ) {
      throw new Error(TRANSACTION_WITHDRAWAL_ERR);
    }

    this.transactions.push(transaction);
  }

  public getTransactionsForMonth(inputDate: Date): ITransaction[] {
    return this._transactions.filter((transaction) => {
      const transactionDate = getDateFromString(transaction.date);
      return (
        transactionDate.getFullYear() === inputDate.getFullYear() &&
        transactionDate.getMonth() === inputDate.getMonth()
      );
    });
  }
}
