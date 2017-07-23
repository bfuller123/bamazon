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
      choices: ['Stock Inventory', 'Set Prices', 'Add New Item', 'Delete Item', 'Clock Out']
    }
  ]).then(function(answers) {
    switch (answers.option) {
      case 'Stock Inventory':
        stockInventory();
        break;
      case 'Set Prices':
        setPrices();
        break;
      case 'Add New Item':
        addItem();
        break;
      case 'Delete Item':
        deleteItem();
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

function addItem() {
  inquirer.prompt([
    {
      name: 'item',
      message: 'What is the product name you would like to add?',
      type: 'input',
      validate: function(value){
        if(value !== undefined || value !== '' || value !== ' '){
          if(value.length <= 30){
            return true;
          }
        }
        console.log('This is a required field and can only be 30 characters long');
      }
    },
    {
      name: 'price',
      message: "What is the price of product?",
      type: 'input',
      validate: function(value){
        value = parseFloat(value);
        if(value !== NaN){
            return true;
        }
        console.log('This is a required field and can have at most one decimal');
      }
    },
    {
      name: 'inventory',
      message: "How much of this item would you like to stock?",
      type: 'input',
      validate: function(value){
        value = parseInt(value);
        if(value !== NaN){
            return true;
        }
        console.log('This is a required field and must be numbers only');
      }
    },
    {
      name: 'department',
      message: 'What is the department of the product?',
      type: 'list',
      choices: ['board games', 'books', 'household', 'office', 'clothing', 'other']
    }
  ]).then(function(answers){
    addRow(answers.item, answers.price, answers.inventory, answers.department)
  })
}

function addRow(item, price, quantity, department) {
  managerConnection.query(
    `INSERT INTO bamazon.products (product_name, department_name, price, stock_quantity) VALUES ('${item}', '${department}', ${price}, ${quantity})`,
    function(err, res) {
      console.log(`${item} added`);
      getInventory();
    }
  )
}

function deleteItem() {
  inquirer.prompt([
    {
      name: 'item',
      type: 'list',
      message: 'What item would you like to get rid of?',
      choices: inventoryNames
    }
  ]).then(function(answers){
    deleteRow(answers.item)
  })
}

function deleteRow(item) {
  managerConnection.query(
    `DELETE FROM bamazon.products WHERE product_name = '${item}'`,
    function(err, res) {
      console.log(`${item} deleted`);
      getInventory();
    }
  )
}

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
