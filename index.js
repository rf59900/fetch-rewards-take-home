const express = require('express');
const app = express()

app.get('/', (req, res) => {
    res.send("hi");
})

const port = process.env.PORT || 3000;
app.listen(3000, () => `Listening on port ${port}`)