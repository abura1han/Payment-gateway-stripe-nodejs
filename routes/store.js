const fs = require('fs');
const path = require('path');

// import dotenv if node isn't in production
if (process.env.NODE_ENV !== 'production') {
	const dotEnv = require('dotenv').config();
	if (dotEnv.error) {
		throw dotEnv.error;
	}
}

// Get stripe public api key
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

const storeController = (req, res) => {
	fs.readFile(path.join(__dirname, '../', 'store.json'), 'utf-8', (err, data) => {
		if (err) return res.status(500).json({ message: 'An error occurred' });

		res.status(200).render('store', { stripePublicKey, products: JSON.parse(data) });
	})
}

module.exports = storeController;