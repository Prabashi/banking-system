import {
  isValidMonth,
  getReport,
  isValidDate,
  isValidRate,
  numberToStringWithPadding,
  countDecimalPlaces,
} from "../utils";

describe("isValidMonth", () => {
  it("should return true for valid months in YYYYMM format", () => {
    expect(isValidMonth("202301")).toBe(true);
    expect(isValidMonth("202312")).toBe(true);
  });

  it("should return false for invalid formats", () => {
    expect(isValidMonth("2023")).toBe(false); // Too short
    expect(isValidMonth("202313")).toBe(false); // Invalid month (13)
    expect(isValidMonth("abc123")).toBe(false); // Non-numeric characters
  });
});

describe("getReport", () => {
  it("should create a report string with headings and data", () => {
    const heading = "Account: AC001";
    const tableHeadings = ["Date", "Txn Id", "Type", "Amount"];
    const tableData = [
      ["20230505", "20230505-01", "D", "100.00"],
      ["20230505", "20230505-02", "D", "100.00"],
    ];

    expect(getReport(heading, tableHeadings, tableData)).toBeDefined();
  });
});

describe("isValidDate", () => {
  it("should return true for valid dates in YYYYMMDD format", () => {
    expect(isValidDate("20230601")).toBe(true);
    expect(isValidDate("20230630")).toBe(true);
  });

  it("should return false for invalid formats", () => {
    expect(isValidDate("2023")).toBe(false); // Too short
    expect(isValidDate("20231301")).toBe(false); // Invalid month (13)
    expect(isValidDate("20230600")).toBe(false); // Invalid day (00)
    expect(isValidDate("abc12345")).toBe(false); // Non-numeric characters
  });
});

describe("isValidRate", () => {
  it("should return true for valid rates (greater than 0 and less than 100)", () => {
    expect(isValidRate(1.5)).toBe(true);
    expect(isValidRate(99.9)).toBe(true);
  });

  it("should return false for rates outside the valid range", () => {
    expect(isValidRate(-1)).toBe(false); // Negative rate
    expect(isValidRate(0)).toBe(false); // Rate of 0
    expect(isValidRate(100)).toBe(false); // Rate of 100
    expect(isValidRate(101)).toBe(false); // Rate greater than 100
  });
});

describe("numberToStringWithPadding", () => {
  it("should pad a number with zeros to the specified length", () => {
    expect(numberToStringWithPadding(5, 3)).toBe("005");
    expect(numberToStringWithPadding(42, 5)).toBe("00042");
    expect(numberToStringWithPadding(123, 2)).toBe("123"); // No padding needed
  });
});

describe("countDecimalPlaces", () => {
  it("should return the number of decimal places in a number", () => {
    expect(countDecimalPlaces(5.25)).toBe(2);
    expect(countDecimalPlaces(42)).toBe(0); // Integer has no decimal places
    expect(countDecimalPlaces(3.14159265359)).toBe(11);
    expect(countDecimalPlaces(3)).toBe(0);
  });
});
