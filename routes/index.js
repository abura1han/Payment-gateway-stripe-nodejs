const router = require('express').Router();
const checkoutController = require('./checkout');
const storeController = require('./store');
const successController = require('./success');
const aboutController = require('./about');
const homeController = require('./home');
const FOFController = require('./404');

// Checkout route
router.post('/checkout', checkoutController)

// Store route
router.get('/store', storeController)

// Purches success route
router.get('/success', successController)

// About route
router.get('/about', aboutController)

// Home route
router.get('/', homeController)

// 404 route
router.all('*', FOFController);

module.exports = router;