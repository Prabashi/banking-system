import { InterestRule } from "../models/InterestRule";
import { Transaction } from "../models/Transaction";
import { getDateFromString, roundToDecimalPlaces } from "./utils";

export const calculateInterest = (
  eventDates: Date[],
  balance: number,
  transactions: Transaction[],
  interestRules: InterestRule[]
): number => {
  let interest = 0;
  const oneDayTS = 24 * 60 * 60 * 1000;

  eventDates?.forEach((date: Date, index: number) => {
    const newDate: Date = new Date(
      date.getTime() - oneDayTS === 0 ? 1 : date.getTime() - oneDayTS
    );

    const balanceForDay = getBalanceForDay(newDate, balance, transactions);
    const ruleForDay = getMatchedRuleForDay(date, interestRules);

    if (!ruleForDay) return;

    const noOfDaysOfRule =
      date.getDate() -
      (index > 0 ? eventDates[index - 1].getDate() : 1) +
      (index === eventDates.length - 1 ? 1 : 0);

    const interestForDay =
      (balanceForDay * ruleForDay?.rate * noOfDaysOfRule) / 100;
    interest = interest + interestForDay;
  });

  return roundToDecimalPlaces(interest / 365, 2);
};

export const getBalanceForDay = (
  date: Date,
  balance: number,
  transactions: Transaction[] | undefined
): number => {
  let dayBalance = balance;
  transactions?.forEach((transaction: Transaction) => {
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

export const getMatchedRuleForDay = (
  date: Date,
  interestRules: InterestRule[] | undefined
): InterestRule | undefined => {
  let matchedRule = undefined;
  interestRules?.forEach((interestRule: InterestRule) => {
    const ruleDate: Date = getDateFromString(interestRule.date);

    if (ruleDate < date) {
      matchedRule = interestRule;
    }
  });

  return matchedRule;
};

export const getDistinctDates = (
  transactions: Transaction[],
  interestRules: InterestRule[],
  monthEnd: Date,
  monthStart: Date
): Date[] => {
  const changeDateArray: any[] = [];

  const interestRulesChangesMonth = interestRules
    .filter(
      (interestRule: InterestRule) =>
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
  if (type.toLowerCase() === "d") {
    balance = balance + amount;
  } else {
    balance = balance - amount;
  }

  return balance;
};
