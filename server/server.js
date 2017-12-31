var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
var {mongoose} = require('./config/mongodb-connect');
var {Product} = require('./models/product');
var {Customer} = require('./models/customer');

var app = express();

app.use(bodyParser.json());

// Insert products
app.post('/products', (req,res) => {
  
    var customersAux = [];

    if ( req.body.customers ){
        req.body.customers.forEach(function(element) {
            customersAux.push({customer_id: element.customer_id, amount: element.amount });
        }, this);
    }

    var product = new Product({
        name: req.body.name,
        description: req.body.description,
        created_at: new Date(),
        updated_at: null,
        customers: customersAux
    });

    product.save().then((product) => {
        res.send(product);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/', (req,res) => {
    res.send('Hello world!!!');
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});