import * as readline from "readline";

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Get an array and output to console with line breaks
export const promptInfo = (infoArr: string[]) => {
  console.log(infoArr.join("\n"));
};

// Request for information from console
export const askInfo = (responseHandler: (info: string) => void) => {
  rl.question("> ", (info) => {
    responseHandler(info);
  });
};

export const quitPrompt = () => {
  rl.close();
};
