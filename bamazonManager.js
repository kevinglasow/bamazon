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

// function to be run upon load to correctly route the user
function managerSystem() {
    inquirer.prompt([{
        name: "choice",
        type: "list",
        message: "Please choose an option.",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }]).then(function (answer) {
        if (answer.choice === "View Products for Sale") {
            viewAllProducts()
        } else if (answer.choice === "View Low Inventory") {
            lowInventory()
        } else if (answer.choice === "Add to Inventory") {
            addInventory()
        } else if (answer.choice === "Add New Product") {
            addProduct()
        }
    })
}

function viewAllProducts() {
    connection.query("select * from products", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            chosenItem = results[i];
            console.log("Item ID: " + results[i].item_id + "| Product Name: " + results[i].product_name + "| Department Name: " + results[i].department_name + "| Price: $" + results[i].price + ".00 | Stock Quantity: " + results[i].stock_quantity)
        }
    })
    connection.end()
}


function lowInventory() {
    connection.query("select * from products where stock_quantity<5", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            chosenItem = results[i];
            console.log("Item ID: " + results[i].item_id + "| Product Name: " + results[i].product_name + "| Department Name: " + results[i].department_name + "| Price: $" + results[i].price + ".00 | Stock Quantity: " + results[i].stock_quantity)
        }
    })
    connection.end()
}

function addInventory() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        choiceArray = []
        var chosenProductQuantity = ""
        var chosenProductID = ""
        results.forEach(function (result) {
            var product = {
                id: result.item_id,
                name: result.product_name,
                quantity: result.stock_quantity
            }
            choiceArray.push(product.id + " " + product.name +  " " + product.quantity);
            chosenProductQuantity = product.quantity;
            chosenProductID = product.id;
        })
        inquirer.prompt([{
                name: "choice",
                type: "list",
                choices: choiceArray,
                message: "What product would you like to add?"
            },
            {
                name: "amount",
                type: "input",
                message: "How much would you like to add?"
            }
        ]).then(function (answer) {
            var answerLength = answer.choice.split(" ").length;
            var previousQuantity = answer.choice.split(" ")[answerLength-1];
            var productId = answer.choice.split(" ")[0];
            console.log("prev quantity:",previousQuantity);
            console.log("product id:",chosenProductID);
            connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [
                parseInt(answer.amount) + parseInt(previousQuantity),
                productId
            ], function (err) {
                if (err) throw err;
                console.log("Database updated.")
            })
            connection.end()
        })
    })
}

function addProduct() {
    inquirer.prompt([{
            name: "name",
            type: "input",
            message: "Enter the name of the item you would like to add."
        },
        {
            name: "department",
            type: "input",
            message: "Enter the department this item is in",
        },
        {
            name: "price",
            type: "input",
            message: "Please enter the cost of the item",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return fale;
                }
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "Please enter the quantity for the new item",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]).then(function (answer) {
        connection.query("insert into products(product_name, department_name, price, stock_quantity) values(?, ?, ?, ?)", [
            answer.name,
            answer.department,
            answer.price,
            answer.quantity
        ], function (err) {
            if (err) throw err;
            console.log("Item Added to Inventory")
        })
        connection.end()
    })

}

managerSystem()