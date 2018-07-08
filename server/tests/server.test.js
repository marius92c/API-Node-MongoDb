const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Product} = require('./../models/product');

const products = [{
    _id: new ObjectID(),
    name: 'First test product',
    description: 'Description of first test product'
},
{
    _id: new ObjectID(),
    name: 'Second test product',
    description: 'Description of second test product'
}];

beforeEach((done) => {
    Product.remove({}).then(() => {
        return Product.insertMany(products);
    }).then(() => done());
});

describe('POST /products', () => {

    it('should create a new product', (done) => {
        var userObject = {
            name: "Test product",
            description: "Description product",
        };
        
        request(app)
            .post('/products')
            .send(userObject)
            .expect(200)
            .expect((res) => {
                expect(res.body.name).toBe(userObject.name);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Product.find(userObject).then((products) => {
                    expect(products.length).toBe(1);
                    expect(products[0].name).toBe(userObject.name);
                    done();
                }).catch((e) => done(e));
            });
    });
    
    it('should not create product with invalid body data', (done) => {
        request(app)
            .post('/products')
            .send({})
            .expect(400)
            .end((err,res) => {
                if(err){
                    return done(err);
                }

                Product.find().then((products) => {
                    expect(products.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });

});

describe('GET /products', () => {
    it('should get all products', (done) => {
        request(app)
            .get('/products')
            .expect(200)
            .expect((res) => {
                expect(res.body.products.length).toBe(2)
            })
            .end(done);
    });
});

describe('GET /products/:id', () => {
    
    it('should return product doc', (done) => {
        request(app)
            .get(`/products/${products[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.product.name).toBe(products[0].name);
            })
            .end(done);
    });

    it('should return 404 if product not found', (done) => {
        var hexId = new ObjectID().toHexString();

        request(app)
            .get(`/products/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get('/products/abc1234')
            .expect(404)
            .end(done);
    });

});

describe('DELETE /products/:id', () => {
    
    it('should remove a product', (done) => {
        var hexId = products[1]._id.toHexString();
        request(app)
            .delete(`/products/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.product._id).toBe(hexId)
            })
            .end((err,res) => {
                if(err){
                    return done(err);
                }

                Product.findById(hexId).then((product) => {
                    expect(product).toNotExist();
                    done();
                }).catch((e) => done());
            });
    });

    it('should return 404 if product not found', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/products/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete(`/products/abc1234`)
            .expect(404)
            .end(done);
    });

});