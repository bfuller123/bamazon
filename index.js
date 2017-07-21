const inquirer = require('inquirer');
const mysql = require('mysql');
const customer = require('./customer.js');
//manager export  [managerinfo for mysql --- testmanager, password123]
//Supervisor export  [supervisorinfo for mysql --- testsupervisor, password123]

var determinePerson = function(){
  // openConnection()
  inquirer.prompt([
    {
      name:'person',
      type:'list',
      message:'Who are you?',
      choices: ['Customer', 'Manager', 'Supervisor']
    }
  ]).then(function(answers) {
    switch (answers.person) {
      case 'Customer':
        customer.shopperOptions();
        break;
      case 'Manager':
        console.log('This is still being built out');
        determinePerson();
        break;
      case 'Supervisor':
        console.log('This is still being built out');
        determinePerson();
        break;
    }
  });
};

determinePerson();
