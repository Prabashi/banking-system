import { BankController } from "../BankController";
import { InterestRule } from "../../models/InterestRule";

describe("addAccountTransaction", () => {
  let bankController = BankController.getInstance();

  afterAll(() => {
    bankController["_accounts"] = [];
  });

  it("should add a new account and transaction if the account does not exist", () => {
    bankController.addAccountTransaction("AC001", "20230601", "D", "150.00");

    const account = bankController.getAccount("AC001");
    expect(account).toBeDefined();
    expect(account?.transactions.length).toBe(1);
  });

  it("should add a transaction to an existing account", () => {
    // Add a new transaction to the existing account
    bankController.addAccountTransaction("AC001", "20230626", "W", "20.00");

    const account = bankController.getAccount("AC001");
    expect(account?.transactions.length).toBe(2);
  });
});

describe("defineInterestRule", () => {
  let bankController = BankController.getInstance();

  afterAll(() => {
    bankController["_interestRules"] = [];
  });

  it("should add a new interest rule", () => {
    bankController.defineInterestRule("20230101", "RULE01", "1.95");

    const interestRules = bankController["_interestRules"];
    expect(interestRules.length).toBe(1);
    expect(interestRules[0]).toBeInstanceOf(InterestRule);
  });

  it("should replace an existing interest rule with the same date", () => {
    // Add an initial interest rule
    bankController.defineInterestRule("20230101", "RULE01", "1.95");

    // Add a new interest rule with the same date
    bankController.defineInterestRule("20230101", "RULE02", "2.00");

    const interestRules = bankController["_interestRules"];
    expect(interestRules.length).toBe(1);
    expect(interestRules[0].ruleId).toBe("RULE02");
  });
});

describe("getTransactionOverview", () => {
  let bankController = BankController.getInstance();

  afterAll(() => {
    bankController["_accounts"] = [];
  });

  it("should throw an error for invalid account", () => {
    expect(() => bankController.getTransactionOverview("A00")).toThrowError(
      "Account not found."
    );
  });
  it("should return transaction overview for a valid account", () => {
    bankController.addAccountTransaction("AC001", "20230601", "D", "150.00");

    const transactionOverview = bankController.getTransactionOverview("AC001");
    expect(transactionOverview).toBeDefined();
    expect(transactionOverview).toContain("Account: AC001");
    expect(transactionOverview).toContain("20230601");
  });
});

describe("getInterestRuleOverview", () => {
  let bankController = BankController.getInstance();

  afterAll(() => {
    bankController["_interestRules"] = [];
  });

  it("should return interest rule overview for defined interest rules", () => {
    bankController.defineInterestRule("20230101", "RULE01", "1.95");
    bankController.defineInterestRule("20230615", "RULE03", "2.20");

    const interestRuleOverview = bankController.getInterestRuleOverview();
    expect(interestRuleOverview).toBeDefined();
    expect(interestRuleOverview).toContain("Interest rules:");
    expect(interestRuleOverview).toContain("20230101");
    expect(interestRuleOverview).toContain("20230615");
  });

  it("should return interest rule overview for defined interest rules, sorted by date", () => {
    bankController.defineInterestRule("20230520", "RULE02", "1.90");

    const interestRuleOverview = bankController.getInterestRuleOverview();
    expect(interestRuleOverview).toBeDefined();
    expect(interestRuleOverview).toContain("Interest rules:");
    expect(interestRuleOverview).toContain("20230101");
    expect(interestRuleOverview).toContain("20230520");
    expect(interestRuleOverview).toContain("20230615");
  });

  it("should throw an error if there are more than one rule for the same date", () => {
    const firstRule = new InterestRule("20230520", "RULE02", 1.9);
    const secondRule = new InterestRule("20230520", "RULE03", 2.9);

    bankController["_interestRules"] = [firstRule, secondRule];

    expect(() => bankController.getInterestRuleOverview()).toThrowError(
      "More than one rule exists for the same date."
    );
  });
});

describe("getAccountStatement", () => {
  let bankController = BankController.getInstance();

  beforeEach(() => {
    // Clear accounts and interest rules before each test
    bankController = BankController.getInstance();
    bankController["_accounts"] = [];
    bankController["_interestRules"] = [];
  });

  it("should throw an error if account not found", () => {
    expect(() =>
      bankController.getAccountStatement("AC001", "202306")
    ).toThrowError("Account not found.");
  });

  it("should throw an error for invalid month", () => {
    bankController.addAccountTransaction("AC001", "20230505", "D", "100.00");

    expect(() =>
      bankController.getAccountStatement("AC001", "20230")
    ).toThrowError("Invalid date format");
  });

  it("should print statement", () => {
    bankController.defineInterestRule("20230101", "RULE01", "1.95");
    bankController.defineInterestRule("20230520", "RULE02", "1.90");
    bankController.defineInterestRule("20230615", "RULE03", "2.20");
    bankController.addAccountTransaction("AC001", "20230505", "D", "100.00");
    bankController.addAccountTransaction("AC001", "20230601", "D", "150.00");
    bankController.addAccountTransaction("AC001", "20230626", "W", "20.00");
    bankController.addAccountTransaction("AC001", "20230626", "W", "100.00");
    console.log(bankController.getAccountStatement("AC001", "202306"));
    expect(bankController.getAccountStatement("AC001", "202306")).toContain(
      "0.39"
    );
  });

  it("should print statement", () => {
    bankController.defineInterestRule("20230101", "RULE01", "1.95");
    bankController.defineInterestRule("20230520", "RULE02", "1.90");
    bankController.defineInterestRule("20230615", "RULE03", "2.20");
    bankController.addAccountTransaction("AC001", "20230505", "D", "100.00");
    bankController.addAccountTransaction("AC001", "20230601", "D", "150.00");
    bankController.addAccountTransaction("AC001", "20230626", "W", "20.00");
    bankController.addAccountTransaction("AC001", "20230626", "W", "100.00");
    console.log(bankController.getAccountStatement("AC001", "202307"));
    expect(bankController.getAccountStatement("AC001", "202307")).toContain(
      "0.24"
    );
  });
});
