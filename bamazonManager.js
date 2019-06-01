var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require('console.table');


var connection = mysql.createConnection( {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Koshima_2019",
    database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
    makeASelection();
});



function makeASelection() {
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
                "exit\n"
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    viewProductsSale();
                    break;

                case "View Low Inventory":
                    viewProductsLow();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    addProduct();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}


function viewProductsSale() {
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);

        makeASelection();
    });

}

function viewProductsLow() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5", function(err, res) {
        if (err) throw err;
        console.table(res);

        makeASelection();
    });
}

function addInventory() {
    inquirer.prompt([
        {
            type: "input",
            name: "product_id_input",
            message: "What is the ID of the product you would like to add inventory to?"
        },
        {
            type: "input",
            name: "count_input",
            message: "Please enter the inventory you would like to add?"
        }
    ]).then(function (user) {
        userItemId = user.product_id_input;
        userCount = user.count_input;

        processInventory(userItemId);


    })
}

function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "product_name_input",
            message: "What is the name of the product you would like to add?"
        },
        {
            type: "input",
            name: "department_name_input",
            message: "What department do you want the product to be sold in?"
        },
        {
            type: "input",
            name: "price_input",
            message: "What is the price for your product?"
        },
        {
            type: "input",
            name: "stock_quantity_input",
            message: "Please add your initial inventory amount."
        }
    ]).then(function (user) {
        newProductName = user.product_name_input;
        newdepartmentName = user.department_name_input;
        newPrice = user.price_input;
        newStockQuantity = user.stock_quantity_input;

        addNewProduct(newProductName, newdepartmentName, newPrice, newStockQuantity);

    })
}


function processInventory(itemID) {

    var theSelectQuery = mysql.format("SELECT * FROM products WHERE item_id = ?", [itemID]);

    connection.query(theSelectQuery, function (err, res) {

        var stockQuantity = res[0].stock_quantity + parseInt(userCount);

        var theUpdateStatement = mysql.format("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [stockQuantity, itemID]);

        connection.query(theUpdateStatement, function (err, res) {
            console.log("The Inventory Has Been Updated!\n");
        })
        makeASelection();
    });
}


function addNewProduct(newProductName, newDepartmentName, newPrice, newStockQuantity) {

    connection.query("INSERT INTO products SET ?", {
        product_name: newProductName,
        department_name: newDepartmentName,
        price: newPrice,
        stock_quantity: newStockQuantity
    },
    function (err, res) {
        console.log(res.affectedRows + " - Your Product Has Been Added\n");
        makeASelection();
    }
);

}
