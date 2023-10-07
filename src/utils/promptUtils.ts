import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Get an array and output to console with line breaks
const promptInfo = (infoArr: string[]) => {
  console.log(infoArr.join("\n"));
};

// Request for information from console
const askInfo = (responseHandler: (info: string) => void) => {
  rl.question("> ", (info) => {
    responseHandler(info);
  });
};

const quitPrompt = () => {
  rl.close();
};

export { promptInfo, askInfo, quitPrompt };
