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

// whatDoYouWant will ask user for the item/quantity they would like to purchase
function whatDoYouWant() {
	// console.log('___ENTER whatDoYouWant___');

	// Ask user to pick an item
	inquirer.prompt([
	{
		type: 'input',
		name: 'item_id',
		message: 'Enter the Item ID of your desired product 🙂',
		filter: Number
	},
	{
		type: 'input',
		name: 'quantity',
		message: 'How many do you need?',
		filter: Number
	}
	]).then(function(input) {
		var item = input.item_id;
		var quantity = input.quantity;

		// Query to confirm that the item ID exists in desired quantity
		var queryStr = 'SELECT * FROM products WHERE ?';

		connection.query(queryStr, {item_id: item}, function(err, data) {
			if (err) throw err;

			// If the user has selected an invalid item ID, tell them

			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID 🤕 Please select a valid Item ID.');
				showInventory();

			} else {
				var productData = data[0];

				// If the quantity requested is in stock
				if (quantity <= productData.stock_quantity) {
					console.log('Yay, the product you requested is in stock! Placing order 📦');

					// Updating query string
					var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;

					// Update inventory
					connection.query(updateQueryStr, function(err, data) {
						if (err) throw err;

						console.log('Your order has been placed 🤗');
						console.log('Your total is $' + productData.price * quantity);
						console.log('🔮 Thank you for choosing Bamazon 🔮');
						console.log("\n---------------------------------------------------------------------\n");

						// End database connection
						connection.end();
					})
				} else {
					console.log('Not enought items in stock 😢');
					console.log('Choose another quantity or item 🤔');
					console.log("\n---------------------------------------------------------------------\n");

					showInventory();
				}
			}
		})
	})
}

// showInventory will retrieve the current inventory from the database
function showInventory() {

	// Construct query string
	queryStr = 'SELECT * FROM products';

	// Make the db query
	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log('Existing Inventory: ');
		console.log('...................\n');

		var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].item_id + '  |  ';
			strOut += 'Product Name: ' + data[i].product_name + '  |  ';
			strOut += 'Department: ' + data[i].department_name + '  |  ';
			strOut += 'Price: $' + data[i].price + '\n';

			console.log(strOut);
		}

		console.log("---------------------------------------------------------------------\n");

	  	// Ask user for item/quantity they would like to purchase
	  	whatDoYouWant();
	  })
}

// runBamazon will execute the main application logic
function runBamazon() {

	// Display the available inventory
	showInventory();
}

// Run the application logic
runBamazon();