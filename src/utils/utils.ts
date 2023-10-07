import { AMOUNT_PARSE_ERR } from "../constants/errorMessages";
interface IYearMonthDayObject {
  yearStr: string;
  monthStr: string;
  dayStr: string;
}

// Check if the input is in YYYYMM format
export const isValidMonth = (input: string): boolean => {
  const dateRegex = /^\d{4}\d{2}$/;
  if (!dateRegex.test(input)) {
    return false;
  }

  const month = parseInt(input.substring(4), 10);
  // Validate month value
  if (month < 1 || month > 12) {
    return false;
  }

  return true;
};

// Generate reports for the given report heading, table headings and table data
export const getReport = (
  heading: string,
  tableHeadings: string[],
  tableData: string[][]
): string => {
  const report: string[] = [];

  report.push(heading);
  report.push(tableHeadings.join(" | "));

  tableData.forEach((row) => {
    report.push(row.join(" | "));
  });

  return report.join("\n");
};

// Check if the input is in YYYYMMDD format
export const isValidDate = (input: string): boolean => {
  const dateRegex = /^\d{4}\d{2}\d{2}$/;

  if (!dateRegex.test(input)) {
    return false;
  }

  const month = parseInt(input.substring(4, 6), 10);
  const day = parseInt(input.substring(6), 10);

  // Validate month and day values
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  return true;
};

// Validate interest rate
export const isValidRate = (rate: number): boolean => {
  return rate > 0 && rate < 100;
};

// Convert a number to a string with a padding of "0" at start, for given length
export const numberToStringWithPadding = (
  num: number,
  length: number
): string => {
  return num.toString().padStart(length, "0");
};

// Count decimal places for a given number
export const countDecimalPlaces = (num: number): number => {
  if (Math.floor(num) === num) {
    return 0; // No decimal places if it's an integer
  } else {
    return num.toString().split(".")[1].length || 0;
  }
};

// Get last date of a month as a Date object
export const getLastDayOfMonth = (dateString: string): Date => {
  const dateStringObject = getMonthYearFromStr(dateString);
  return new Date(
    parseInt(dateStringObject.yearStr),
    parseInt(dateStringObject.monthStr),
    0
  );
};

// Retrieve month, year and day from a string
export const getMonthYearFromStr = (
  dateString: string
): IYearMonthDayObject => {
  const yearStr = dateString.slice(0, 4);
  const monthStr = dateString.slice(4, 6);
  let dayStr = "";

  if (dateString.length > 7) {
    dayStr = dateString.slice(6, 8);
  }

  return {
    yearStr,
    monthStr,
    dayStr,
  };
};

// Create a date object from given string
export const getDateFromString = (dateString: string): Date => {
  const dateStringObject = getMonthYearFromStr(dateString);
  return new Date(
    `${dateStringObject.yearStr}-${dateStringObject.monthStr}-${dateStringObject.dayStr}`
  );
};

// Get the date string in YYYYMMDD format
export const getStringFromDate = (date: Date): string => {
  return `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
};

// Round off a number to a given number of decimal places
export const roundToDecimalPlaces = (
  num: number,
  decimalPlaces: number
): number => {
  const multiplier = Math.pow(10, decimalPlaces);
  return Math.round(num * multiplier) / multiplier;
};

// Convert amount into a number and validates for type and amount
export const isValidAmount = (amount: string): boolean => {
  const amountAsNum = parseFloat(amount);

  if (isNaN(amountAsNum)) {
    throw new Error(AMOUNT_PARSE_ERR);
  }

  return amountAsNum > 0 && countDecimalPlaces(amountAsNum) <= 2;
};
