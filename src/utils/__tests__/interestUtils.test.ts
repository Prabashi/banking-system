import { InterestRule } from "../../models/InterestRule";
import { Transaction } from "../../models/Transaction";
import {
  calculateInterest,
  getBalanceForDay,
  getMatchedRuleForDay,
  getDistinctDates,
  handleBalance,
} from "../interestUtils";

describe("calculateInterest", () => {
  it("should calculate interest correctly", () => {
    const eventDates = [
      new Date("2023-06-01"),
      new Date("2023-06-15"),
      new Date("2023-06-26"),
      new Date("2023-06-30"),
    ];
    const balance = 0;
    const transactions = [
      new Transaction("20230505", "D", "100.00", 1),
      new Transaction("20230601", "D", "150.00", 1),
      new Transaction("20230626", "W", "20.00", 1),
      new Transaction("20230626", "W", "100.00", 2),
    ];
    const interestRules = [
      new InterestRule("20230101", "RULE01", 1.95),
      new InterestRule("20230520", "RULE02", 1.9),
      new InterestRule("20230615", "RULE03", 2.2),
    ];

    const interest = calculateInterest(
      eventDates,
      balance,
      transactions,
      interestRules
    );

    expect(interest).toBe(0.39);
  });
});

describe("getBalanceForDay", () => {
  it("should calculate balance correctly", () => {
    const date = new Date("2023-07-31");
    const balance = 0;
    const transactions = [
      new Transaction("20230505", "D", "100.00", 1),
      new Transaction("20230601", "D", "150.00", 1),
      new Transaction("20230626", "W", "20.00", 1),
      new Transaction("20230626", "W", "100.00", 2),
    ];

    const dayBalance = getBalanceForDay(date, balance, transactions);
    expect(dayBalance).toBe(130);
  });
});

describe("getMatchedRuleForDay", () => {
  it("should return the matching rule for the day", () => {
    const date = new Date("2023-07-01");
    const interestRules = [
      new InterestRule("20230101", "RULE01", 1.95),
      new InterestRule("20230520", "RULE02", 1.9),
      new InterestRule("20230615", "RULE03", 2.2),
    ];

    const matchedRule = getMatchedRuleForDay(date, interestRules);
    expect(matchedRule).toEqual(new InterestRule("20230615", "RULE03", 2.2));
  });
});

describe("getDistinctDates", () => {
  it("should return a list of distinct dates different events occurred", () => {
    const transactions = [
      new Transaction("20230601", "D", "150.00", 1),
      new Transaction("20230626", "W", "20.00", 1),
      new Transaction("20230626", "W", "100.00", 2),
    ];
    const interestRules = [
      new InterestRule("20230101", "RULE01", 1.95),
      new InterestRule("20230520", "RULE02", 1.9),
      new InterestRule("20230615", "RULE03", 2.2),
    ];

    const distinctDates = getDistinctDates(
      transactions,
      interestRules,
      new Date("2023-06-30"),
      new Date("2023-06-01")
    );

    const eventDates = [
      new Date("2023-06-01"),
      new Date("2023-06-15"),
      new Date("2023-06-26"),
      new Date("2023-06-30"),
    ];

    expect(distinctDates).toEqual(eventDates);
  });
});

describe("handleBalance", () => {
  it("should calculate balance correctly for a given type", () => {
    const balance = 100;
    const amount = 150;
    const newBalance = handleBalance("D", balance, amount);
    expect(newBalance).toBe(250);
  });
});
