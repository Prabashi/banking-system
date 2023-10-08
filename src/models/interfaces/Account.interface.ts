import { ITransaction } from "./Transaction.interface";

export interface IAccount {
  get name(): string;
  get transactions(): ITransaction[];
  addTransaction(transaction: ITransaction): void;
  getTransactionsForMonth(inputDate: Date): ITransaction[];
}
