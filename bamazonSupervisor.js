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
                "View Products Sales by Department",
                "Create New Department",
                "exit\n"
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
                case "View Products Sales by Department":
                    viewProductsbyDept();
                    break;

                case "Create New Department":
                    createNewDepartment();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}


function viewProductsbyDept() {
    inquirer.prompt([
        {
            type: "input",
            name: "department_choice",
            message: "What department would you like to see?"
        }
    ]).then(function (user) {
        departmentChoice = user.department_choice;

        connection.query("SELECT p.department_id,  p.department_name, d.over_head_costs, sum(p.product_sales), sum(p.product_sales) - d.over_head_costs as total_profit " +
            "FROM departments d, products p WHERE p.department_id = ? and p.department_id = d.department_id GROUP BY p.department_id, p.department_name, d.over_head_costs", [departmentChoice],
            function (err, res) {
                if (err) throw err;
                var showTable = cTable.getTable(res);

                console.log(showTable);
                makeASelection();
            })
    })
}


function createNewDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "department_name_input",
            message: "What is the name of the department you would like to add?"
        },
        {
            type: "input",
            name: "overhead_costs_input",
            message: "What is the estimated over head costs for this department?"
        }
    ]).then(function (user) {
        newDepartmentName = user.department_name_input;
        newOverheadCosts = user.overhead_costs_input;


        insertNewDepartment(newDepartmentName, newOverheadCosts);

    })
}


function insertNewDepartment(newDepartmentName, newOverheadCosts) {

    connection.query("INSERT INTO departments SET ?", {
            department_name: newDepartmentName,
            over_head_costs: newOverheadCosts
        },
        function (err, res) {
            console.log(res.affectedRows + " - Your Department Has Been Added\n");
            makeASelection();
        }
    );

}


