var mysql = require("mysql");
var inquirer = require("inquirer");

// global variables


var userItemId;
var userCount;

var connection = mysql.createConnection( {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Koshima_2019",
    database: "bamazonDB"
});


connection.connect(function(err) {
    if (err) throw err;
    console.log("connected  as id " + connection.threadId);
    showInventory();
});

function showInventory() {
    connection.query("SELECT item_id, product_name, price, stock_quantity, product_sales FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        // connection.end();
        getUserInput();
    })
};


function getUserInput() {
    inquirer.prompt([
        {
            type: "input",
            name: "product_id_input",
            message: "What is the ID of the product you would like to buy?"
        },
        {
            type: "input",
            name: "count_input",
            message: "How many would you like to purchase?"
        }
    ]).then(function (user) {
        userItemId = user.product_id_input;
        userCount = user.count_input;

        processOrder(userItemId);


    })
}

function processOrder(itemID) {

    var theSelectQuery = mysql.format("SELECT * FROM products WHERE item_id = ?", [itemID]);

    connection.query(theSelectQuery, function (err, res) {

        var stockQuantity = res[0].stock_quantity - userCount;

        if (stockQuantity > 0) {

            var totalPrice = res[0].price * userCount;

            var productSales = res[0].product_sales + totalPrice;

            console.log("Your Total Cost Is: $"+ totalPrice);

            var theUpdateStatement = mysql.format("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [stockQuantity, itemID]);

            connection.query(theUpdateStatement, function (err, res) {

                    console.log("The Inventory Has Been Updated!\n");
            })

            var theUpdateSalesStatement = mysql.format("UPDATE products SET product_sales = ? WHERE item_id = ?", [productSales, itemID]);

            connection.query(theUpdateSalesStatement, function (err, res) {

                console.log("The Sales Has Been Updated!\n");
            })

        } else { console.log("there is not enough inventory")}

        productName = res[0].product_name;
        price = res[0].price;
        departmentName = res[0].department_name;
    });

}





