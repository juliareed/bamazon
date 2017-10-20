// Require inquirer and mysql
var inquirer = require('inquirer');
var mysql = require('mysql');

// Connect to my sql local instance database
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,

	user: 'root',

	password: '',
	database: 'bamazon'
});

// whatDoYouWant will show menu options
function whatDoYouWant() {

	// Ask user to pick option
	inquirer.prompt([
	{
		type: 'list',
		name: 'option',
		message: 'Please select an option:',
		choices: ['View Products for Sale 🦎', 'View Low Inventory ⛈', 'Add to Inventory ⚾️', 'Add New Product 🌌'],
		filter: function (val) {
			if (val === 'View Products for Sale 🦎') {
				return 'sale';
			} else if (val === 'View Low Inventory ⛈') {
				return 'lowInventory';
			} else if (val === 'Add to Inventory ⚾️') {
				return 'addInventory';
			} else if (val === 'Add New Product 🌌') {
				return 'newProduct';
			} else {
					// This case should be unreachable
					console.log('ERROR: Unsupported operation!⚠️');
					exit(1);
				}
			}
		}
		]).then(function(input) {

		// Trigger option user picks
		if (input.option ==='sale') {
			showInventory();
		} else if (input.option === 'lowInventory') {
			showLowInventory();
		} else if (input.option === 'addInventory') {
			addInventory();
		} else if (input.option === 'newProduct') {
			createNewProduct();
		} else {
			// This case should be unreachable
			console.log('ERROR: Unsupported operation!⚠️');
			exit(1);
		}
	})
	}

// showInventory will retrieve the current inventory from the database and output it to the console
function showInventory() {

	// Construct the db query string
	queryStr = 'SELECT * FROM products';

	// Make the db query
	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log('🐡 Current Inventory: ');
		console.log('...................\n');

		var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].item_id + '  //  ';
			strOut += 'Product Name: ' + data[i].product_name + '  //  ';
			strOut += 'Department: ' + data[i].department_name + '  //  ';
			strOut += 'Price: $' + data[i].price + '  //  ';
			strOut += 'Quantity: ' + data[i].stock_quantity + '\n';

			console.log(strOut);
		}

		console.log("---------------------------------------------------------------------\n");

		// End database connection
		connection.end();
	})
}

// showLowInventory will show list of products with quantity < 100
function showLowInventory() {

	// Db query string
	queryStr = 'SELECT * FROM products WHERE stock_quantity < 100';

	// Make db query
	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log('🐨 Low Inventory Items (below 100): ');
		console.log('................................\n');

		var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].item_id + '  //  ';
			strOut += 'Product Name: ' + data[i].product_name + '  //  ';
			strOut += 'Department: ' + data[i].department_name + '  //  ';
			strOut += 'Price: $' + data[i].price + '  //  ';
			strOut += 'Quantity: ' + data[i].stock_quantity + '\n';

			console.log(strOut);
		}

		console.log("---------------------------------------------------------------------\n");

		// End the database connection
		connection.end();
	})
}

// addInventory will guilde a user in adding additional quantify to an existing item
function addInventory() {

	// Prompt the user to select an item
	inquirer.prompt([
	{
		type: 'input',
		name: 'item_id',
		message: 'Enter the Item ID for stock_count update 🔑',
		filter: Number
	},
	{
		type: 'input',
		name: 'quantity',
		message: 'How many would you like to add? 🌻',
		filter: Number
	}
	]).then(function(input) {

		var item = input.item_id;
		var addQuantity = input.quantity;

		// Query db to confirm that the given item ID exists and to determine the current stock_count
		var queryStr = 'SELECT * FROM products WHERE ?';

		connection.query(queryStr, {item_id: item}, function(err, data) {
			if (err) throw err;

			// If the user has selected an invalid item ID, data attay will be empty

			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.⚠️');
				addInventory();

			} else {
				var productData = data[0];
				console.log('Updating Inventory...😎');

				// Construct the updating query string
				var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity + addQuantity) + ' WHERE item_id = ' + item;
				// Update the inventory
				connection.query(updateQueryStr, function(err, data) {
					if (err) throw err;

					console.log('Stock count for Item ID ' + item + ' has been updated to ' + (productData.stock_quantity + addQuantity) + ' ✅');
					console.log("\n---------------------------------------------------------------------\n");

					// End the database connection
					connection.end();
				})
			}
		})
	})
}

// createNewProduct will guide the user in adding a new product to the inventory
function createNewProduct() {

	// Prompt the user to enter information about the new product
	inquirer.prompt([
	{
		type: 'input',
		name: 'product_name',
		message: 'Enter the new product name 🍕',
	},
	{
		type: 'input',
		name: 'department_name',
		message: 'Which department does the new product belong to? 🤔',
	},
	{
		type: 'input',
		name: 'price',
		message: 'What is the price? 💵',
	},
	{
		type: 'input',
		name: 'stock_quantity',
		message: 'How many items are in stock? 💯',
	}
	]).then(function(input) {

		console.log('Adding New Item: \n    product_name = ' + input.product_name + '\n' +  
			'    department_name = ' + input.department_name + '\n' +  
			'    price = ' + input.price + '\n' +  
			'    stock_quantity = ' + input.stock_quantity);

		// Create the insertion query string
		var queryStr = 'INSERT INTO products SET ?';

		// Add new product to the db
		connection.query(queryStr, input, function (error, results, fields) {
			if (error) throw error;

			console.log('New product has been added to the inventory under Item ID ' + results.insertId + ' ⚡️');
			console.log("\n---------------------------------------------------------------------\n");

			// End the database connection
			connection.end();
		});
	})
}

// runBamazon will execute the main application logic
function runBamazon() {

	// Prompt manager for input
	whatDoYouWant();
}

// Run the application logic
runBamazon();