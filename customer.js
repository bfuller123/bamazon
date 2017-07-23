const inquirer = require('inquirer');
const mysql = require('mysql');

var inventory = Object.create(null);
var inventoryNames = [];

var customer = {
  total: 0,
  purchases: Object.create(null)
}

var buyItems = function () {
  console.log('-------Products---------');
  for (var i = 0; i < inventoryNames.length; i++) {
    var item = inventoryNames[i]
    console.log(`${inventory[item].item_id}) ${item} [${inventory[item].department}] $${inventory[item].price}`);
  }
  console.log('---------------------------');
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

function shopperOptions() {
  inquirer.prompt([
    {
      name: 'options',
      message: 'What would you like to do?',
      type: 'list',
      choices: ['Purchase More Items', 'Remove Items From Cart', 'Checkout']
    }
  ]).then(function(answers){
    switch (answers.options) {
      case 'Purchase More Items':
        buyItems();
        break;
      case 'Remove Items From Cart':
        removeItems();
        break;
      default:
        console.log(`Great! You're total for today is $${customer.total}. Thank you for shopping with us!`);
        customerConnection.end();
        process.exit()
    }
  })
}

var getCartQuantity = function(item){
  var itemQuantity = customer.purchases[item];
  inquirer.prompt([
    {
      name: 'quantity',
      message: 'How many of these would you like to remove from your cart?',
      default: itemQuantity,
      validate: function(value){
        value = parseInt(value);
        if(value !== NaN && value <= itemQuantity){
          return true;
        }
        console.log('It must be a number less than or equal to the amount of that item in your cart')
      }
    }
  ]).then(function(answers){
    var quantity = answers.quantity * -1;
    updateCart(item, quantity, inventory[item].price);
    updateDatabase(item, quantity);
  })
}

function updateCart(item, quantity, price){
  var totalCost = price * quantity;
  customer.total += totalCost;
  if (customer.purchases[item] !== undefined) {
    customer.purchases[item] += quantity;
  }
  else {
    customer.purchases[item] = quantity;
  }
  console.log(`This adds $${totalCost} to your running total, bringing your total to $${customer.total}.`);
}

function removeItems() {
  inquirer.prompt([
    {
      name: 'remove',
      message: 'What item would you like to remove from your cart?',
      type: 'list',
      choices: Object.keys(customer.purchases)
    }
  ]).then(function(answers){
    getCartQuantity(answers.remove)
  })
}

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
    var quantity = inventory[item].stock_quantity;

    if (quantity - answers.amount < 0) {
      console.log(`Insufficient quantity! We only have ${quantity} of this item left.`);
      return shopperPurchases(item, price)
    }
    else {
      updateCart(item, answers.amount, price)
      updateDatabase(item, answers.amount);
    }
  })
};


function updateDatabase(item, amount) {
  customerConnection.query(
    'UPDATE bamazon.products SET stock_quantity = stock_quantity - ' + amount + ' WHERE product_name = "' + item + '"',
    function(err, res){
      if (customer.total > 0){
        shopperOptions();
      }
      else {
        buyItems();
      }
    }
  )
}

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
        if (res[i].stock_quantity > 0) {
          inventory[res[i].product_name] = {
            item_id: res[i].item_id,
            price: res[i].price,
            stock_quantity: res[i].stock_quantity,
            department: res[i].department_name
          };
          inventoryNames.push(res[i].product_name);
        }
      }
      buyItems();
    }
  )
};

exports.database = function() {
  customerConnection.connect(function(err){
    if(err) throw err;
    getInventory();
  });
}
