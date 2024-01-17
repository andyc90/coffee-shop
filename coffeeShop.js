import chalk from "chalk";
import inquirer from "inquirer";

class CoffeeShopTill {
  constructor() {
    this.prices = {
      Espresso: 2.0,
      Americano: 1.8,
      Cappuccino: 3.5,
      Latte: 2.5,
    };
  }

  calculateTotal(drinks) {
    return drinks.reduce((total, drink) => total + (this.prices[drink] || 0), 0);
  }

  formatCurrency(amount) {
    return `£${amount.toFixed(2)}`;
  }
}

class Customer {
  constructor(name, totalCash) {
    this.name = name;
    this.totalCash = totalCash;
  }

  canAfford(orderTotal) {
    return this.totalCash >= orderTotal;
  }

  formatCurrency(amount) {
    return `£${amount.toFixed(2)}`;
  }
}

const till = new CoffeeShopTill();

inquirer
  .prompt([
    {
      type: "input",
      name: "name",
      message: chalk.white("What is your name?"),
    },
    {
      type: "input",
      name: "totalCash",
      message: chalk.white("How much cash do you have?"),
      validate: (input) => {
        const parsed = parseFloat(input);
        if (isNaN(parsed) || parsed <= 0) {
          return chalk.red("Please enter a valid number for cash amount.");
        }
        return true;
      },
      filter: (input) => parseFloat(input).toFixed(2),
    },
    {
      type: "checkbox",
      name: "order",
      message: chalk.white("Select the drinks for your order:"),
      choices: Object.keys(till.prices).map((drink) => drink.charAt(0).toUpperCase() + drink.slice(1)),
      validate: (answer) => {
        if (answer.length < 1) {
          return chalk.red("You must choose at least one drink.");
        }
        return true;
      },
    },
  ])
  .then((answers) => {
    const customer = new Customer(answers.name, parseFloat(answers.totalCash));
    const orderTotal = till.calculateTotal(answers.order);
    const canAfford = customer.canAfford(orderTotal);

    console.log(
      chalk.white(`Can ${customer.name} afford the order? `) +
        (canAfford ? chalk.black.bgGreen.bold("Yes") : chalk.black.bgRed.bold("No"))
    );

    console.log(
      chalk.black.bgWhite.bold(
        `${customer.name} has ${customer.formatCurrency(
          customer.totalCash
        )} and the total for the order is ${till.formatCurrency(orderTotal)}.`
      )
    );
  })
  .catch((error) => {
    console.error("An error occurred while getting the customer details:", error);
  });
