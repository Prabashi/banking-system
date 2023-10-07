import {
  INVALID_AMOUNT_ERR,
  INVALID_DATE_FORMAT_ERR,
  INVALID_TRANSACTION_TYPE_ERR,
} from "../constants/errorMessages";
import { TRANSACTION_TYPES } from "../constants/appConstants";
import {
  numberToStringWithPadding,
  isValidDate,
  isValidAmount,
} from "../utils/utils";
export interface ITransaction {
  date: string;
  type: string;
  amount: number;
  uniqueId: string;
}

export class Transaction {
  private _date: string;
  private _type: string;
  private _amount: number;
  private _uniqueId: string;

  constructor(
    date: string,
    type: string,
    amount: string,
    transactionNum: number
  ) {
    if (!isValidDate(date)) {
      throw new Error(INVALID_DATE_FORMAT_ERR);
    }

    if (!this.isValidTransactionType(type.toUpperCase())) {
      throw new Error(INVALID_TRANSACTION_TYPE_ERR);
    }

    if (!isValidAmount(amount)) {
      throw new Error(INVALID_AMOUNT_ERR);
    }

    this._date = date;
    this._type = type.toUpperCase();
    this._amount = parseFloat(amount);
    this._uniqueId = `${date}-${numberToStringWithPadding(transactionNum, 2)}`;
  }

  private isValidTransactionType(type: string): boolean {
    return (
      type === TRANSACTION_TYPES.DEPOSIT ||
      type === TRANSACTION_TYPES.WITHDRAWAL
    );
  }

  public get type(): string {
    return this._type;
  }

  public get amount(): number {
    return this._amount;
  }

  public get date(): string {
    return this._date;
  }

  public get uniqueId(): string {
    return this._uniqueId;
  }
}
