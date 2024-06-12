const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true} ));
app.use(express.json());

const receiptsRouter = require(path.join(__dirname, 'routes', 'receipts.js'));

app.use('/receipts', receiptsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}.....`));