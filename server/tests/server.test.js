const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Product} = require('./../models/product');

const products = [{
    name: 'First test product',
    description: 'Description of first test product'
},
{
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