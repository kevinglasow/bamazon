var mysql = require("mysql");
var password = require("./pw");
var inquirer = require("inquirer");

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
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                chosenItem = results[i];
            }
            if (chosenItem.stock_quantity >= answer.quantity) {
                removeFromInventory(answer);
                console.log("Success! You have bought " + answer.quantity + " of " + chosenItem.product_name + ".");
                console.log("You total comes to: $" + answer.quantity * chosenItem.price + ".00.")
            } else {
                console.log("Insufficent quantity.")
            }
            connection.end();
        })
    })
}

function removeFromInventory(answer) {
    connection.query("update products set stock_quantity=100 WHERE item_id=1", function (err, results) {
        if (err) throw err;
        console.log("Database updated")
        connection.end();
    });

}

userInterface()