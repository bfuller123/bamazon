const inquirer = require('inquirer');
const mysql = require('mysql');

var inventory = Object.create(null);
var inventoryNames = [];
var managerConnection;

exports.enterPassword = function() {
  inquirer.prompt([
    {
      type: 'password',
      message: 'Please enter your password: ',
      name: 'password',
      validate: function(value){
        if (value == 'password123') {
          console.log('\n Password Accepted');
          databasePassword = value;
          return true;
        }
        return console.log('\n Password Incorrect');
      }
    }
  ]).then(function(answers){
    startManagerConnection(answers.password);
  })
}

function managerOptions(){
  console.log('-------Products---------');
  for (var i = 0; i < inventoryNames.length; i++) {
    var item = inventoryNames[i]
    console.log(`${inventory[item].item_id}) ${item} Stock:[${inventory[item].stock_quantity}] $${inventory[item].price}`);
  }
  console.log('---------------------------');
  inquirer.prompt([
    {
      name: 'option',
      message: 'What would you like to do?',
      type: 'list',
      choices: ['Stock Inventory', 'Set Prices', 'Clock Out']
    }
  ]).then(function(answers) {
    switch (answers.option) {
      case 'Stock Inventory':
        stockInventory();
        break;
      case 'Set Prices':
        setPrices();
        break;
      case 'Clock Out':
        console.log('Thanks for your hard work!');
        managerConnection.end();
        process.exit();
        break;
    }
  })
};

function stockInventory() {
  inquirer.prompt([
    {
      name: 'inventory',
      message: 'Which item would you like to stock?',
      type: 'list',
      choices: inventoryNames
    },
    {
      name: 'amount',
      message: 'How much of this item would you like to stock?',
      type: 'input',
      default: 1,
      validate: function(value){
        value = parseInt(value);
        if(typeof value !== NaN){
          return true;
        }
        return console.log('Please only enter digits');
      }
    }
  ]).then(function(answers){
    updateDatabase('stock_quantity', answers.inventory, answers.amount);
  })
};

function setPrices() {
  inquirer.prompt([
    {
      name: 'inventory',
      message: 'Which item would you like to set the price for?',
      type: 'list',
      choices: inventoryNames
    },
    {
      name: 'price',
      message: 'What is the new price?',
      type: 'input',
      validate: function(value){
        value = parseInt(value);
        if(typeof value !== NaN){
          return true;
        }
        return console.log('Please only enter digits');
      }
    }
  ]).then(function(answers){
    updateDatabase('price', answers.inventory, answers.price);
  })
};

function getInventory(){
  managerConnection.query(
    'SELECT * FROM bamazon.products',
    function(err, res){
      inventoryNames = [];
      inventory = Object.create(null);
      for (var i = 0; i < res.length; i++) {
          inventory[res[i].product_name] = {
            item_id: res[i].item_id,
            price: res[i].price,
            stock_quantity: res[i].stock_quantity,
            department: res[i].department_name
          };
          inventoryNames.push(res[i].product_name);
      }
      managerOptions();
    }
  )
};

function updateDatabase(stockOrPrice, item, number){
  if (stockOrPrice === 'stock_quantity') {
    managerConnection.query(
      `UPDATE bamazon.products SET ${stockOrPrice} = ${stockOrPrice} + ${number} WHERE product_name = '${item}'`,
      function(err, res) {
        console.log('updated!');
        getInventory();
      }
    )
  }
  else {
    managerConnection.query(
      `UPDATE bamazon.products SET ${stockOrPrice} =  ${number} WHERE product_name = '${item}'`,
      function(err, res) {
        console.log('updated!');
        getInventory();
      }
    )
  }
}

function startManagerConnection(userPassword) {
  managerConnection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'testmanager',
    password: userPassword,
    database: 'bamazon'
  });
  managerConnection.connect(function(err){
    if(err) throw err;
    getInventory();
  })
}
