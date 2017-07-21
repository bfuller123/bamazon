const inquirer = require('inquirer');
const mysql = require('mysql');

var inventory = Object.create(null);
var inventoryNames = [];

exports.shopperOptions = function () {
  inquirer.prompt([
    {
    type: 'list',
    name: 'item',
    message: 'What would you like to purchase?',
    choices: inventoryNames
    }
  ]).then(function(answers){
    switch (answers.item) {
      case inventoryNames[0]:
        console.log(inventory[inventoryNames[0]].price);
        break;
      case inventoryNames[1]:
        console.log(inventory[inventoryNames[1]].price);
        break;
      case inventoryNames[2]:
        console.log(inventory[inventoryNames[2]].price);
        break;
      case inventoryNames[3]:
        console.log(inventory[inventoryNames[3]].price);
        break;
      case inventoryNames[4]:
        console.log(inventory[inventoryNames[4]].price);
        break;
      case inventoryNames[5]:
        console.log(inventory[inventoryNames[5]].price);
        break;
      case inventoryNames[6]:
        console.log(inventory[inventoryNames[6]].price);
        break;
      default:
        console.log('Hurray!');
    }
  })
};

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
  customerConnection.end();
};

customerConnection.connect(function(err){
  if(err) throw err;
  getInventory();
})
