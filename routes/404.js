const FOFController = (req, res) => {
	if (req.method === 'GET') {
		return res.status(200).render('404');
	}

	res.status(404).json({ message: "404 page not found" });
}

module.exports = FOFController;