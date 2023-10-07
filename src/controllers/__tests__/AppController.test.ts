import { AppController } from "../AppController";
import { WELCOME_MESSAGE } from "../../constants/promptConstants";
import { quitPrompt } from "../../utils/promptUtils";

describe("AppController", () => {
  beforeEach(() => {
    jest.spyOn(process.stdout, "write").mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should display the welcome message and call showMenu", () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    let appController: AppController = new AppController();
    appController.startApp();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(WELCOME_MESSAGE[0])
    );

    quitPrompt();
  });
});
