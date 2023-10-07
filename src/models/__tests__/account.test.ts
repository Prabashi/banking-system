import { Account } from "../Account";
import { Transaction } from "../Transaction";

describe("Account class", () => {
  it("should create an account with a valid initial deposit", () => {
    const initialTransaction = new Transaction("20230601", "D", "150.0", 1);
    const account = new Account("AC001", initialTransaction);
    expect(account).toBeDefined();
    expect(account.name).toBe("AC001");
  });

  it("should throw an error for an invalid initial transaction type", () => {
    const invalidInitialTransaction = new Transaction(
      "20230601",
      "W",
      "50.0",
      1
    );
    expect(() => new Account("AC001", invalidInitialTransaction)).toThrowError(
      "The first transaction on an account should be a deposit."
    );
  });

  it("should add a valid transaction to the account", () => {
    const initialTransaction = new Transaction("20230601", "D", "150.0", 1);
    const account = new Account("AC001", initialTransaction);
    const newTransaction = new Transaction("20230602", "W", "20.0", 1);
    account.addTransaction(newTransaction);
    expect(account.transactions.length).toBe(2);
  });

  it("should throw an error for an invalid withdrawal transaction", () => {
    const initialTransaction = new Transaction("20230601", "D", "150.0", 1);
    const account = new Account("AC001", initialTransaction);
    const invalidTransaction = new Transaction("20230602", "W", "200.0", 1);
    expect(() => account.addTransaction(invalidTransaction)).toThrowError(
      "Transaction would make balance go below 0."
    );
  });

  it("should throw an error for an invalid withdrawal transaction for an account with both Deposit and Withdrawal transactions", () => {
    const initialTransaction = new Transaction("20230601", "D", "150.0", 1);
    const account = new Account("AC001", initialTransaction);

    const withdrawalTransaction = new Transaction("20230601", "W", "100.0", 1);
    account.addTransaction(withdrawalTransaction);

    const invalidTransaction = new Transaction("20230602", "W", "100.0", 1);
    expect(() => account.addTransaction(invalidTransaction)).toThrowError(
      "Transaction would make balance go below 0."
    );
  });
});
