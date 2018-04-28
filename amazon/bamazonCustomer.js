var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  displayques();
  });

  function displayques () {
    connection.query("SELECT * FROM products", function(err, res){
      if(err) throw err;
      for (i=0;i<res.length; i++) {
        console.log("Item ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " | " + "Price: " + res[i].price );
      }
    });
    run();
  }

  function run(){
    connection.query("SELECT * FROM products", function(err, res){
      if (err) throw err;
        inquirer
          .prompt([
            {
              name: "item_id",
              type: "input",
              message: "Input the Item ID of the product you want to buy?"
            },
            {
              name: "quantity",
              type: "input",
              message: "How many do you want to buy?"
            }
          ])
          .then(function(answer){
            // console.log(answer.item_id)
            connection.query("SELECT stock_quantity FROM products WHERE ?", { item_id: answer.item_id }, function(err, result) {
              if(err) throw err;
              result.map(item_id => {
                let nstock_quantity = item_id.stock_quantity;
                // console.log(nstock_quantity)

                if (nstock_quantity > answer.quantity ) {
                  nstock_quantity -= answer.quantity;
                  // console.log( nstock_quantity);
                  updateQuan (nstock_quantity, answer);
                  console.log("Your purchase has been sucessfuly processed!")
                  console.log("------------------------------------------------------------------")
                  displayques();
                  }
                  else {
                  console.log("Sorry not enough product, please select a differnet product or reduce the quanitity of your purchase")
                  console.log("------------------------------------------------------------------")
                  run();
                  }
              });
            });
            });
          });
    };

  function updateQuan (nstock_quantity, answer) {
    var query = connection.query("UPDATE products SET  ? WHERE ? ",
    [
        {stock_quantity: nstock_quantity },
        {item_id: answer.item_id}
    ],
      
      function(err, result) {
        if(err) throw err;
      }
    );
    };
  

