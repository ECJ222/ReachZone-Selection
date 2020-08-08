const express = require('express');
const app = express();
const path = require('path');

if (process.env.NODE_ENV === 'production'){
	app.use(express.static('client/build')); //all the static files are being served

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')) //sends response data to index.html
	});
}

const port = process.env.PORT || 5000; //port 5000

app.listen(port, () => console.log(`server started on port ${port}`)); //listens for port 5000