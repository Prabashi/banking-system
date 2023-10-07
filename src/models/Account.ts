import {
  INVALID_FIRST_TRANSACTION_ERR,
  TRANSACTION_WITHDRAWAL_ERR,
} from "../constants/errorMessages";
import { getDateFromString } from "../utils/utils";
import { ITransaction, Transaction } from "./Transaction";

export interface IAccount {
  name: string;
  transactions: ITransaction[];
}

export class Account {
  private _name: string;
  private _transactions: Transaction[];

  constructor(name: string, transaction: Transaction) {
    // Check for the first transaction on the account and ensure it's a deposit
    if (transaction.type !== "D") {
      throw new Error(INVALID_FIRST_TRANSACTION_ERR);
    }

    this._name = name;
    this._transactions = [transaction];
  }

  public get name(): string {
    return this._name;
  }

  public get transactions(): Transaction[] {
    return this._transactions;
  }

  public addTransaction(transaction: Transaction): void {
    // Calculate the new balance
    const balance = this.transactions.reduce((acc, t) => {
      if (t.type === "D") {
        return acc + t.amount;
      } else {
        return acc - t.amount;
      }
    }, 0);

    // Ensure the balance doesn't go below 0
    if (transaction.type === "W" && balance - transaction.amount < 0) {
      throw new Error(TRANSACTION_WITHDRAWAL_ERR);
    }

    this.transactions.push(transaction);
  }

  public getTransactionsForMonth(inputDate: Date): Transaction[] {
    return this._transactions.filter((transaction) => {
      const transactionDate = getDateFromString(transaction.date);
      return (
        transactionDate.getFullYear() === inputDate.getFullYear() &&
        transactionDate.getMonth() === inputDate.getMonth()
      );
    });
  }
}
