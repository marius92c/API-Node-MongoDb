const express = require('express');
const axios = require('axios');

var app = express();

app.get('/', (req,res) => {
    res.send('Hello world!!!');
});

app.listen(3000);