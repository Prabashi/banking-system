import { Transaction } from "../Transaction";

describe("Transaction class", () => {
  it("should create a valid deposit transaction", () => {
    const transaction = new Transaction("20230601", "D", "150.0", 1);
    expect(transaction).toBeDefined();
    expect(transaction.date).toBe("20230601");
    expect(transaction.type).toBe("D");
    expect(transaction.amount).toBe(150.0);
    expect(transaction.uniqueId).toContain("20230601");
  });

  it("should throw an error for an invalid date format", () => {
    expect(() => new Transaction("2023060", "D", "150.0", 1)).toThrowError(
      "Invalid date format"
    );
  });

  it("should throw an error for an invalid transaction type", () => {
    expect(() => new Transaction("20230601", "X", "150.0", 1)).toThrowError(
      "Invalid transaction type."
    );
  });

  it("should throw an error for an invalid amount", () => {
    expect(() => new Transaction("20230601", "D", "-50.0", 1)).toThrowError(
      "Invalid amount."
    );
  });

  it("should throw an error for an invalid number for amount", () => {
    expect(() => new Transaction("20230601", "D", "amount", 1)).toThrowError(
      "Invalid amount."
    );
  });
});
