import { AppController } from "../AppController";
import {
  WELCOME_MESSAGE,
  INITIAL_MENU,
  INTEREST_RULES_INSTRUCTION,
  TRANSACTION_DETAILS_INSTRUCTION,
  STATEMENT_PRINT_INSTRUCTION,
  GOOD_BYE_MESSAGE,
} from "../../constants/promptConstants";
import { quitPrompt } from "../../utils/promptUtils";

jest.mock("readline", () => ({
  createInterface: jest.fn().mockReturnValue({
    question: jest
      .fn()
      // full happy path
      .mockImplementationOnce((_questionText, cb) => cb("I"))
      .mockImplementationOnce((_questionText, cb) => cb("20230615 RULE03 2.20"))
      .mockImplementationOnce((_questionText, cb) => cb("T"))
      .mockImplementationOnce((_questionText, cb) =>
        cb("20230626 AC001 D 100.00")
      )
      .mockImplementationOnce((_questionText, cb) => cb("P"))
      .mockImplementationOnce((_questionText, cb) => cb("AC001 202306"))
      .mockImplementationOnce((_questionText, cb) => cb("Q"))

      // incorrect input
      .mockImplementationOnce((_questionText, cb) => cb("J"))
      .mockImplementationOnce((_questionText, cb) => cb("Q"))

      // input field missing for transactions
      .mockImplementationOnce((_questionText, cb) => cb("T"))
      .mockImplementationOnce((_questionText, cb) => cb("20230626 AC001 D"))
      .mockImplementationOnce((_questionText, cb) => cb(""))
      .mockImplementationOnce((_questionText, cb) => cb("Q"))

      // input field format error for transactions
      .mockImplementationOnce((_questionText, cb) => cb("T"))
      .mockImplementationOnce((_questionText, cb) => cb("dddff AC001 D 100.00"))
      .mockImplementationOnce((_questionText, cb) => cb(""))
      .mockImplementationOnce((_questionText, cb) => cb("Q"))

      // input field missing for interest rules
      .mockImplementationOnce((_questionText, cb) => cb("I"))
      .mockImplementationOnce((_questionText, cb) => cb("20230615"))
      .mockImplementationOnce((_questionText, cb) => cb(""))
      .mockImplementationOnce((_questionText, cb) => cb("Q"))

      // input field format error for interest rules
      .mockImplementationOnce((_questionText, cb) => cb("I"))
      .mockImplementationOnce((_questionText, cb) => cb("20230615 RULE03 sss"))
      .mockImplementationOnce((_questionText, cb) => cb(""))
      .mockImplementationOnce((_questionText, cb) => cb("Q"))

      // input field missing for print statement
      .mockImplementationOnce((_questionText, cb) => cb("P"))
      .mockImplementationOnce((_questionText, cb) => cb("AC001"))
      .mockImplementationOnce((_questionText, cb) => cb(""))
      .mockImplementationOnce((_questionText, cb) => cb("Q"))

      // input field format error for print statements
      .mockImplementationOnce((_questionText, cb) => cb("P"))
      .mockImplementationOnce((_questionText, cb) => cb("AC001 ssss"))
      .mockImplementationOnce((_questionText, cb) => cb(""))
      .mockImplementationOnce((_questionText, cb) => cb("Q"))

      // empty string for transactions
      .mockImplementationOnce((_questionText, cb) => cb("T"))
      .mockImplementationOnce((_questionText, cb) => cb(""))
      .mockImplementationOnce((_questionText, cb) => cb("Q"))

      // empty string for interest rules
      .mockImplementationOnce((_questionText, cb) => cb("I"))
      .mockImplementationOnce((_questionText, cb) => cb(""))
      .mockImplementationOnce((_questionText, cb) => cb("Q"))

      // empty string for print statements
      .mockImplementationOnce((_questionText, cb) => cb("P"))
      .mockImplementationOnce((_questionText, cb) => cb(""))
      .mockImplementationOnce((_questionText, cb) => cb("Q")),
    close: jest.fn().mockImplementationOnce(() => undefined),
  }),
}));

describe("AppController", () => {
  beforeEach(() => {
    jest.spyOn(process.stdout, "write").mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should output expected instructions and statements for full happy path", () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    let appController: AppController = new AppController();
    appController.startApp();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(WELCOME_MESSAGE[0])
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(INITIAL_MENU[0])
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(INTEREST_RULES_INSTRUCTION[0])
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("RULE03")
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(TRANSACTION_DETAILS_INSTRUCTION[0])
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("20230626")
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(STATEMENT_PRINT_INSTRUCTION[0])
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("0.03"));
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(GOOD_BYE_MESSAGE[0])
    );

    quitPrompt();
  });

  it("should show the initial menu for incorrect input", () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    let appController: AppController = new AppController();
    appController.startApp();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(INITIAL_MENU[0])
    );

    quitPrompt();
  });

  it("should re-instruct if input field missing for transactions", () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    let appController: AppController = new AppController();
    appController.startApp();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(TRANSACTION_DETAILS_INSTRUCTION[0])
    );

    quitPrompt();
  });

  it("should re-instruct if input field format error for transactions", () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    let appController: AppController = new AppController();
    appController.startApp();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(TRANSACTION_DETAILS_INSTRUCTION[0])
    );

    quitPrompt();
  });

  it("should re-instruct if input field missing for interest rules", () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    let appController: AppController = new AppController();
    appController.startApp();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(INTEREST_RULES_INSTRUCTION[0])
    );

    quitPrompt();
  });

  it("should re-instruct if input field format error for interest rules", () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    let appController: AppController = new AppController();
    appController.startApp();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(INTEREST_RULES_INSTRUCTION[0])
    );

    quitPrompt();
  });

  it("should re-instruct if input field missing for print statement", () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    let appController: AppController = new AppController();
    appController.startApp();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(STATEMENT_PRINT_INSTRUCTION[0])
    );

    quitPrompt();
  });

  it("should re-instruct if input field format error for print statements", () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    let appController: AppController = new AppController();
    appController.startApp();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(STATEMENT_PRINT_INSTRUCTION[0])
    );

    quitPrompt();
  });

  it("should show the menu if empty string is entered for transactions", () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    let appController: AppController = new AppController();
    appController.startApp();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(INITIAL_MENU[0])
    );

    quitPrompt();
  });

  it("should show the menu if empty string is entered interest rules", () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    let appController: AppController = new AppController();
    appController.startApp();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(INITIAL_MENU[0])
    );

    quitPrompt();
  });

  it("should show the menu if empty string is entered print statements", () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    let appController: AppController = new AppController();
    appController.startApp();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(INITIAL_MENU[0])
    );

    quitPrompt();
  });
});
