// import dotenv if node isn't in production
if (process.env.NODE_ENV !== 'production') {
	const dotEnv = require('dotenv').config();
	if (dotEnv.error) {
		throw dotEnv.error;
	}
}

const fs = require('fs').promises;
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const checkoutController = async (req, res) => {
	try {
		// read data from store.json
		const products = await fs.readFile(path.join(__dirname, '../', 'store.json'), 'utf-8');
		const parsedData = JSON.parse(products); // parse json data
		const storeData = [...parsedData.music, ...parsedData.merch];

		// if product purches request is 0 or not provided
		if (!req.body.products || req.body.products < 1) {
			return res.status(400).json({ message: 'Empty cart can\'t be submit' })
		}

		// create stripe session
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			mode: 'payment',
			line_items: req.body.products.map(item => {
				const product = storeData.find(e => e.id == item.id);

				return {
					price_data: {
						currency: 'usd',
						product_data: {
							name: product.name,
						},
						unit_amount: product.price,
					},
					quantity: item.quantity
				}
			}),
			success_url: `${process.env.SERVER_URL}/success`,
			cancel_url: `${process.env.SERVER_URL}/store`,
		})

		res.status(200).json({ url: session.url });
	} catch (err) {
		console.error(err.message);
		if (err) res.status(500).json({ message: err.message })
	}
}

module.exports = checkoutController;