// IMPORTANT!!! must run app using syntax: AIRTABLE_API_KEY=<yourAPIkey> nodemon app.js
// Bring in express, airtable, and native node module path
const base = require('airtable').base('app0mymuxI3yq2DX2');
const express = require('express');
const path = require('path');
// Initalizing express and setting pug up. Pug normally needs to be in views folder. Use path to allow page.pug to be in the root.
const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '.'));

let records;

app.get('/', (req, res) => {
	if (records) {
		console.log('cached');
		res.render('page', {
			records,
		});
	} else {
		// calling a async IIFE that will fetch the data from airtable.
		(async () => {
			let records = await base('Business Hours')
				.select({
					view: 'Grid view',
				})
				.firstPage();
			// rendering data using pug on page.pug.
			res.render('page', {
				records,
			});
			// setting records to null every 10 secs and force the page to refresh.
			setTimeout(() => {
				records = null;
			}, 10 * 1000);
		})();
	}
});
// using express to listen on port 3000
app.listen(3000, () => console.log('Server ready on port 3000'));
