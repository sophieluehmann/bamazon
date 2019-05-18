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
            name: "product",
            message: "What product do you want to add inventory?",
            choices: productNames
        })
        .then(function(answer) {
            console.log(answer);
        })

        nextThing();
    })
    
   /* var quantity = [
        {
            type: 'input',
            name: 'quantity',
            message: "Name of artist: ",
            input: String
        },
    ]
    connection.query
    */
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

      /*case "Search for a specific song":
        songSearch();
        break;
          
      case "exit":
        connection.end();
        break;*/
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
                break;
        }
    })
}