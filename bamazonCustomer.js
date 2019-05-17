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
        var query = "SELECT * FROM products WHERE ?";
        connection.query(query, {item_id: item}, function(err, data) {
           if (err) throw err;
           var productInfo = data[0];
           inquirer
            .prompt({
            name: "quantity",
            type: "input",
            message: "How many " + productInfo.product_name + " do you want to buy?"
            })
            .then(function(input) {
                var amount = input.quantity;
                var query = "SELECT * FROM products"
            })
        });
    
    })
};




/*function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Find songs by artist",
        "Find all artists who appear more than once",
        "Find data within a specific range",
        "Search for a specific song",
        "exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "Find songs by artist":
        artistSearch();
        break;

      case "Find all artists who appear more than once":
        multiSearch();
        break;

      case "Find data within a specific range":
        rangeSearch();
        break;

      case "Search for a specific song":
        songSearch();
        break;
          
      case "exit":
        connection.end();
        break;
      }
    });
}



function multiSearch() {
  var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].artist);
    }
    runSearch();
  });
}

function rangeSearch() {
  inquirer
    .prompt([
      {
        name: "start",
        type: "input",
        message: "Enter starting position: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "end",
        type: "input",
        message: "Enter ending position: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
      connection.query(query, [answer.start, answer.end], function(err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log(
            "Position: " +
              res[i].position +
              " || Song: " +
              res[i].song +
              " || Artist: " +
              res[i].artist +
              " || Year: " +
              res[i].year
          );
        }
        runSearch();
      });
    });
}

function songSearch() {
  inquirer
    .prompt({
      name: "song",
      type: "input",
      message: "What song would you like to look for?"
    })
    .then(function(answer) {
      console.log(answer.song);
      connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
        console.log(
          "Position: " +
            res[0].position +
            " || Song: " +
            res[0].song +
            " || Artist: " +
            res[0].artist +
            " || Year: " +
            res[0].year
        );
        runSearch();
      });
    });
}
*/