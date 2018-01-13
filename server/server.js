var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
var _ = require('lodash');
var {mongoose} = require('./config/mongodb-connect');
var {ObjectID} = require('mongodb');
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

// Fetch list products
app.get('/products', (req,res) => {
  
  Product.find().then((products) => {
    res.send({products});
  }, (e) => {
    res.status(400).send(e);
  });
    
});

// Fetch one product
app.get('/products/:id', (req,res) => {

  var productId = req.params.id;  

  if ( !ObjectID.isValid(productId) ){
      console.log(1);
      res.status(404).send();
  }

  Product.findById(productId).then((product) => {
     if(!product){
         console.log(2);
         return res.status(404).send();
     }

     res.send({product});

  }).catch((e) => {
      res.status(400).send(e);
  });
      
});

// Update partial product
app.patch('/products/:id', (req,res) => {

    var productId = req.params.id;

    var body = _.pick(req.body, ['name','description','updated_at']);

    if ( !ObjectID.isValid(productId) ){
        return res.status(404).send();
    }

    body.updated_at = new Date();

    Product.findByIdAndUpdate(productId, {$set: body}, {new: true}).then((product) => {

        if (!product){
            return res.status(404).send();
        }

        res.send({product});

    }).catch((e) => {
        res.status(400).send();
    })

});

app.get('/', (req,res) => {
    res.send('Hello world!!!');
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});