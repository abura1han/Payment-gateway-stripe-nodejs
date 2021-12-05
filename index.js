const express = require('express');
const helmet = require('helmet');
const path = require('path');
const app = express();
const routes = require('./routes/index');

// import dotenv if node isn't in production
if (process.env.NODE_ENV !== 'production') {
	const dotEnv = require('dotenv').config();
	if (dotEnv.error) {
		throw dotEnv.error;
	}
}

// get port from env if exist
const PORT = process.env.PORT || 8000;

// security middleware
app.use(helmet());

// jeson encoded
app.use(express.json());

// url encoded
app.use(express.urlencoded({ extended: false }));

// express static directory
app.use(express.static(path.join(__dirname, 'public')));

// setup `ejs` view engine
app.set('view engine', 'ejs');

// setup routes
app.use('/', routes);


// listen the server
app.listen(PORT, () => process.stdout.write(`Server running. URL: http://localhost:${PORT}/`));
