import { promptInfo, askInfo, quitPrompt } from "../utils/promptUtils";
import {
  CONTINUE_APP_MESSAGE,
  GOOD_BYE_MESSAGE,
  INCORRECT_FORMAT_ERROR_MESSAGE,
  INITIAL_MENU,
  INTEREST_RULES_INSTRUCTION,
  INVALID_CHOICE_MESSAGE,
  STATEMENT_PRINT_INSTRUCTION,
  TRANSACTION_DETAILS_INSTRUCTION,
  WELCOME_MESSAGE,
} from "../constants/promptConstants";
import { BankController } from "./BankController";

export class AppController {
  private _bankController: BankController;

  constructor() {
    this._bankController = BankController.getInstance();
  }

  public startApp = () => {
    promptInfo(WELCOME_MESSAGE);
    this.showMenu();
  };

  private showMenu = () => {
    promptInfo(INITIAL_MENU);
    askInfo((choice) => {
      this.handleMenuChoice(choice);
    });
  };

  private continueApp = () => {
    promptInfo(CONTINUE_APP_MESSAGE);
    this.showMenu();
  };

  private handleMenuChoice = (choice: string) => {
    switch (choice.toUpperCase()) {
      case "T":
        this.inputTransactions();
        break;
      case "I":
        this.defineInterest();
        break;
      case "P":
        this.printStatement();
        break;
      case "Q":
        promptInfo(GOOD_BYE_MESSAGE);
        quitPrompt();
        break;
      default:
        promptInfo(INVALID_CHOICE_MESSAGE);
        this.startApp();
    }
  };

  private inputTransactions = () => {
    promptInfo(TRANSACTION_DETAILS_INSTRUCTION);

    askInfo((input) => {
      if (input.trim() === "") {
        // If the user enters blank, return to the main menu
        this.startApp();
      } else {
        const [date, accountName, type, amount] = input.split(" ");

        if (date && accountName && type && amount) {
          try {
            this._bankController.addAccountTransaction(
              accountName,
              date,
              type,
              amount
            );
            promptInfo([
              this._bankController.getTransactionOverview(accountName),
            ]);
            this.continueApp();
          } catch (e) {
            promptInfo([e as string]);
            this.inputTransactions();
          }
        } else {
          promptInfo(INCORRECT_FORMAT_ERROR_MESSAGE);
          this.inputTransactions();
        }
      }
    });
  };

  private defineInterest = () => {
    promptInfo(INTEREST_RULES_INSTRUCTION);

    askInfo((input) => {
      if (input.trim() === "") {
        // If the user enters blank, return to the main menu
        this.startApp();
      } else {
        const [date, ruleId, rate] = input.split(" ");

        if (date && ruleId && rate) {
          try {
            this._bankController.defineInterestRule(date, ruleId, rate);
            promptInfo([this._bankController.getInterestRuleOverview()]);
            this.continueApp();
          } catch (e) {
            promptInfo([e as string]);
            this.defineInterest();
          }
        } else {
          promptInfo(INCORRECT_FORMAT_ERROR_MESSAGE);
          this.defineInterest();
        }
      }
    });
  };

  private printStatement = () => {
    promptInfo(STATEMENT_PRINT_INSTRUCTION);

    askInfo((input) => {
      if (input.trim() === "") {
        // If the user enters blank, return to the main menu
        this.startApp();
      } else {
        const [accountName, month] = input.split(" ");

        if (accountName && month) {
          try {
            promptInfo([
              this._bankController.getAccountStatement(accountName, month),
            ]);

            this.continueApp();
          } catch (e) {
            promptInfo([e as string]);
            this.printStatement();
          }
        } else {
          promptInfo(INCORRECT_FORMAT_ERROR_MESSAGE);
          this.printStatement();
        }
      }
    });
  };
}
