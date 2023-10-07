import { promptInfo, askInfo, quitPrompt } from "../promptUtils";
import readline, { Interface } from "readline";

jest.mock("readline", () => ({
  createInterface: jest.fn().mockReturnValue({
    question: jest
      .fn()
      .mockImplementationOnce((_questionText, cb) => cb("User input")),
    close: jest.fn().mockImplementationOnce(() => undefined),
  }),
}));

describe("readlineUtils", () => {
  beforeEach(() => {
    jest.spyOn(process.stdout, "write").mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("promptInfo should print info with line breaks", () => {
    const infoArr = ["Info1", "Info2", "Info3"];
    const consoleLogSpy = jest.spyOn(console, "log");

    promptInfo(infoArr);

    console.log(consoleLogSpy);

    expect(consoleLogSpy).toHaveBeenCalledWith("Info1\nInfo2\nInfo3");
  });

  it("askInfo should call question with the provided info", () => {
    const responseHandler = jest.fn();
    const info = "User input";

    askInfo(responseHandler);

    expect(
        readline.createInterface({
          input: process.stdin as NodeJS.ReadableStream,
          output: process.stdout as NodeJS.WritableStream,
        }).question
      ).toHaveBeenCalled();

    expect(responseHandler).toHaveBeenCalledWith(info);
  });

  it("quitPrompt should close the readline interface", () => {
    quitPrompt();
    expect(
      readline.createInterface({
        input: process.stdin as NodeJS.ReadableStream,
        output: process.stdout as NodeJS.WritableStream,
      }).close
    ).toHaveBeenCalled();
  });
});
