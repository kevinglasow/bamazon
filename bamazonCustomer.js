var mysql = require("mysql");
var password = require("./pw");
var inquirer = require("inquirer");
var chosenItem = ""

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: password.secure.password,
    database: "bamazon"
});

function userInterface() {
    inquirer.prompt([{
            name: "whichProduct",
            type: "input",
            message: "Please enter the ID for the item you'd like to purchase",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "What quantity would you like to purchase?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]).then(function (answer) {
        // connect to the database and query by the item_id
        connection.query("select * from products where item_id=" + answer.whichProduct, function (err, results) {
            if (err) throw err;
            // create a variable to store the results in an object
            // var chosenItem;
            for (var i = 0; i < results.length; i++) {
                chosenItem = results[i];
            }
            if (chosenItem.stock_quantity >= answer.quantity) {
                console.log("Success! You have bought " + answer.quantity + " of " + chosenItem.product_name + ".");
                console.log("You total comes to: $" + answer.quantity * chosenItem.price + ".00.")
                removeFromInventory(answer);
            } else {
                console.log("Insufficent quantity.")
                connection.end();
            }

        })
    })
}

function removeFromInventory(answer) {
    var connectionQuery = connection.query(
        "UPDATE products SET stock_quantity = ? WHERE item_id = ?", [
            (chosenItem.stock_quantity - answer.quantity),
            chosenItem.item_id
        ],
        function (err) {
            if (err) throw err;
            console.log("Database updated")
            connection.end()
        });
    console.log(connectionQuery.sql)
}

userInterface()