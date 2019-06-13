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



function listItems() {
    connection.query("SELECT * FROM bamazon.products", function(err, res) {
      if (err) throw err;
  
      // Log all results of the SELECT statement
      for (i = 0; i < res.length; i++) {
      console.log("id: " + res[i].item_id + " || product: " + res[i].product_name + " || department: " + res[i].department_name + " || price: " + res[i].price + " || stock quantity: " + res[i].stock_quantity);
      
      };
     
    });
 
    
}
listItems();
idSearch();

function idSearch() {
    inquirer
      .prompt({
        name: "item_id",
        type: "input",
        message: "Product id number:\n"
      })
      .then(function(input) {
        var item = input.item_id;
        var query = "SELECT * FROM products WHERE ? ";
        connection.query(query, {item_id: item}, function(err, data) {
           if (err) throw err;
           var productInfo = data[0];
           console.log("product quantity: " + productInfo.stock_quantity);
           inquirer
            .prompt({
            name: "quantity",
            type: "input",
            message: "How many " + productInfo.product_name + " do you want to buy?"
            })
            .then(function(input) {
                var amount = input.quantity;
                
                if (amount <= productInfo.stock_quantity) {
                    var updateQuery = "UPDATE products SET stock_quantity=" + (productInfo.stock_quantity - amount) + " WHERE item_id='" + item + "'";
                    connection.query(updateQuery, function(err, data) {
                        if (err) throw err;
                        console.log("Your order for " + amount + " " + productInfo.product_name + " has been placed.");
                        console.log("Total is: $" + (amount * productInfo.price));
                        connection.end();
                    })
                }
                 else {
                    console.log("insufficient quantity");
                    connection.end();
                }
                
            })
        });
    
    })
};
