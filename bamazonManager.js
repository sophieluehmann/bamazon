var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
});

runSearch();

function listItems() {
    connection.query("SELECT * FROM bamazon.products", function(err, res) {
      if (err) throw err;
  
      // Log all results of the SELECT statement
      for (i = 0; i < res.length; i++) {
      console.log("id: " + res[i].item_id + " || product: " + res[i].product_name + " || department: " + res[i].department_name + " || price: " + res[i].price + " || stock quantity: " + res[i].stock_quantity);
      
      };
      
      nextThing();

    });
 
    
}



function lowInventory() {
    connection.query("SELECT * FROM bamazon.products WHERE stock_quantity < 50", function (err, data) {
        if (err) throw err;
        for (i = 0; i < data.length; i++) {
        console.log("id: " + data[i].item_id + " || product: " + data[i].product_name + " || department: " + data[i].department_name + " || price: " + data[i].price + " || stock quantity: " + data[i].stock_quantity);
        }
        nextThing();
    })
    
};

function inventoryAdd() {
    connection.query("SELECT * FROM bamazon.products", function(err, data){
        if (err) throw err;
        var productNames = [];
        for (i = 0; i < data.length; i++){
            productNames.push(data[i].product_name);
        }
        inquirer
        .prompt({
            type: "list",
            name: "product_name",
            message: "What product do you want to add inventory?",
            choices: productNames
        })
        .then(function(input) {
            var itemAdd = input.product_name;
            var query = "SELECT * FROM bamazon.products WHERE ?";
            connection.query(query, {product_name:itemAdd}, function(err, data) {
              if (err) throw err;
              var productInfo = data[0];
              console.log("stock quantity: " + productInfo.stock_quantity);
              inquirer
              .prompt({
                type: 'input',
                name: 'quantity',
                message: "How many? " + itemAdd + " do you want to add?"
              })
              .then(function(answer) {
                var addQuantity = answer.quantity;
                var productInfo = data[0];
                var addQuery = "UPDATE bamazon.products SET stock_quantity=" + (productInfo.stock_quantity + parseInt(addQuantity)) + " WHERE product_name='" + productInfo.product_name + "'";
                connection.query(addQuery, function(err, data) {
                   if (err) throw err;
                   console.log("added");
                   nextThing();
                });
              })
            });

        })
      })
};

function addProduct() {
  inquirer
  .prompt({
    type: "input",
    name: "product_name",
    message: "What product would you like to add? "
  })
  .then(function(input) {
    var item_name = input.product_name;
    inquirer
    .prompt({
      type: "input",
      name: "department_name",
      message: "What department is " + item_name + " in? "
    })
    .then(function(input) {
      var department = input.department_name;
      inquirer
      .prompt({
        type: "input",
        name: "price",
        message: "What would you like to set as the price per unit? "
      })
      .then(function(input) {
      var price = parseInt(input.price);
      inquirer
      .prompt({
        type: "input",
        name: "stock_quantity",
        message: "How many would you like to add? "
      })
      .then(function(input){
        var quantity = parseInt(input.stock_quantity);
        var sql = "INSERT INTO bamazon.products (product_name, department_name, price, stock_quantity) VALUES ?";
        var values = [[item_name, department, price, quantity]];
        connection.query(sql, [values], function(err) {
          if (err) throw err;
          console.log("added " + values);
          nextThing();
        })
  
      })
    })
  })
})
}

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View Products for Sale":
        listItems();
        break;

      case "View Low Inventory":
        lowInventory();
        break;

      case "Add to Inventory":
        inventoryAdd();
        break;

      case "Add New Product":
        addProduct();
        break;
      }

    })
}

function nextThing() {
    inquirer
    .prompt({
        name: "action",
        type: "list",
        message: "",
        choices: [
            "Back",
            "Close"
        ]
    })
    .then(function(answer) {
        switch (answer.action) {
            case "Back":
                runSearch();
                break;

            case "Close":
                connection.end();
          
        }
    })
}