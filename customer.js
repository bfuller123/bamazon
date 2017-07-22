const inquirer = require('inquirer');
const mysql = require('mysql');

var inventory = Object.create(null);
var inventoryNames = [];

var customer = {
  total: 0,
  purchases: Object.create(null)
}

exports.shopperOptions = function () {
  inquirer.prompt([
    {
      type: 'list',
      name: 'item',
      message: 'What would you like to purchase?',
      choices: inventoryNames
    }
  ]).then(function(answers){
    var userTotalPurchase = 0;
    switch (answers.item) {
      default:
        printPrice(answers.item)
        shopperPurchases(answers.item, inventory[answers.item].price);
    }
  })
};

var shopperPurchases = function(item, price) {
  inquirer.prompt([
    {
      type: 'input',
      name: 'amount',
      message: 'How many of this item would you like to purchase?',
      default: 1,
      validate: function(value) {
        value = parseInt(value);
        if (value !== NaN) {
          return true;
        }
        return "Please input digits only"
      }
    }
  ]).then(function(answers){
    var totalCost = price * answers.amount;
    customer.total += totalCost;
    customer.purchases[item] = answers.amount;
    console.log(`This adds $${totalCost} to your running total, bringing your total to $${customer.total}.`);
    inquirer.prompt([
      {
        type: 'confirm',
        name: 'buymore',
        message: 'Would you like to make any more purchases?',
        default: true
      }
    ]).then(function(answer){
      if(answer.buymore){
        exports.shopperOptions();
      }
      else {
        console.log(`Great! You're total for today is $${customer.total}. Thank you for shopping with us!`);
        process.exit()
      }
    })
  })
};

function printPrice(item) {
  console.log(`This item costs $${inventory[item].price}.`);
}

var customerConnection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'testcustomer',
  password: 'password123',
  database: 'bamazon'
});

function getInventory(){
  customerConnection.query(
    'SELECT * FROM bamazon.products',
    function(err, res){
      inventoryNames = [];
      inventory = Object.create(null);
      for (var i = 0; i < res.length; i++) {
        inventory[res[i].product_name] = {
          item_id: res[i].item_id,
          price: res[i].price,
          stock_quantity: res[i].stock_quantity,
          department: res[i].department
        };
        inventoryNames.push(res[i].product_name);
      }
    }
  )
  // customerConnection.end();
};

customerConnection.connect(function(err){
  if(err) throw err;
  getInventory();
})
