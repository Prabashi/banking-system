import {
  INVALID_DATE_FORMAT_ERR,
  INVALID_INTEREST_RATE_ERR,
} from "../constants/errorMessages";
import { isValidDate, isValidRate } from "../utils/utils";

export interface IInterestRule {
  date: string;
  ruleId: string;
  rate: number;
}

export class InterestRule {
  private _date: string;
  private _ruleId: string;
  private _rate: number;

  constructor(date: string, ruleId: string, rate: number) {
    if (!isValidDate(date)) {
      throw new Error(INVALID_DATE_FORMAT_ERR);
    }

    if (!isValidRate(rate)) {
      throw new Error(INVALID_INTEREST_RATE_ERR);
    }

    this._date = date;
    this._ruleId = ruleId;
    this._rate = rate;
  }

  public get date(): string {
    return this._date;
  }

  public get ruleId(): string {
    return this._ruleId;
  }

  public get rate(): number {
    return this._rate;
  }
}
