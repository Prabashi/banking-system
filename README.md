# Banking System

## Local environment setup

Before everything please clone the project and install node JS in your local computer. Version used here is,

### `v18.17.0`

I recommend using `nvm` to insall the `NodeJS` so you ca have multiple versions in your local environment. Now let's get the project from git using the fllowing command.

```
git clone git@github.com:Prabashi/banking-system.git
```

In the project directory, please run:

```
npm install
```

Now run the application

```
npm run dev
```

## Testing

Please run the following command to test the application

```
npm run test
```

To run with coverage

```
npm run test:coverage
```

## Production run

```
npm run production
```

## Banking System Features

### Add transactions

When application is running, it will give a prompt to enter transactions in the following format

```
20230626 AC001 W 100.00
```

Date format, amount format and transaction type format errors are handled within the application.

### Add Interest Rules

Interest rules should be added in the following format

```
20230615 RULE03 2.20
```

Now this interest rules are used when calculating interest for the monthly statement.

### Get Account Statements

Assuming that we don't add interests to previous months balance, system will do the following steps to figure out interest record for the monthly statement.

- When the year and month is input by user, system will first check the total balance up until the begining of the input month

- Then it will get all the transactions and rules relavnt to the current month

- Now system creates a distinct sorted date array using the transactions and rules for the month and also add last day of the month to this array in order to calculate interest

- Then system calculates the total interest for the month and then credit that interest as a transaction record with the input type `I`
