var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
var _ = require('lodash');
var {mongoose} = require('./config/mongodb-connect');
var {ObjectID} = require('mongodb');
var {Product} = require('./models/product');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

app.use(bodyParser.json());


/** PRODUCTS 
 * =======================
*/


// Insert products
app.post('/products', (req,res) => {
  
    var usersAux = [];

    if ( req.body.users ){
        req.body.users.forEach(function(element) {
            usersAux.push({user_id: element.user_id, amount: element.amount });
        }, this);
    }

    var product = new Product({
        name: req.body.name,
        description: req.body.description,
        created_at: new Date(),
        updated_at: null,
        user: usersAux
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
      res.status(404).send();
  }

  Product.findById(productId).then((product) => {
     if(!product){
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


// Update partial product
app.delete('/products/:id', (req,res) => {

    var productId = req.params.id;

    if ( !ObjectID.isValid(productId) ){
        return res.status(404).send();
    }

    Product.findByIdAndRemove(productId, function(err, product) {

        if (!product){
            return res.status(404).send();
        }
        
        res.send({product});

    }).catch((e) => {
        res.status(400).send();
    })

});



/** USERS 
 * =======================
*/

// Insert user
app.post('/users', (req, res) => {

    var body = _.pick(req.body, ['email','password']);
    var user = new User({
        name: req.body.name,
        document_number: req.body.document_number,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        created_at: new Date()
    });

    user.save().then(() => {
        return user.generateAuthToken();
    }).then( (token) =>{
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });

});

// Get information to user
app.get('/users/me', authenticate, (req,res) => {
    res.send(req.user);
});

// Login User 
app.post('/users/login', (req,res) => {
    var body = _.pick(req.body, ['email','password']);

    User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});