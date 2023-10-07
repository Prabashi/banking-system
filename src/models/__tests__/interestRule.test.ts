import { InterestRule } from "../InterestRule";

describe("InterestRule class", () => {
  it("should create a valid interest rule", () => {
    const interestRule = new InterestRule("20230601", "RULE01", 2.2);
    expect(interestRule).toBeDefined();
    expect(interestRule.date).toBe("20230601");
    expect(interestRule.ruleId).toBe("RULE01");
    expect(interestRule.rate).toBe(2.2);
  });

  it("should throw an error for an invalid date format", () => {
    expect(() => new InterestRule("2023060", "RULE01", 2.2)).toThrowError(
      "Invalid date format"
    );
  });

  it("should throw an error for rate lower than 0", () => {
    expect(() => new InterestRule("20230601", "RULE01", -2.2)).toThrowError(
      "Invalid rate."
    );
  });

  it("should throw an error for rate higher than 100", () => {
    expect(() => new InterestRule("20230601", "RULE01", 110)).toThrowError(
      "Invalid rate."
    );
  });
});
