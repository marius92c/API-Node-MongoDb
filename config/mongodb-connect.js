const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/ApiNode', function(err,db) {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    /*
    
    Testing database insert document
    db.collection('products').insertOne({
        name:"Television Samsung 4K",
        description:"Ultra High Definition 4K, or Ultra HD 4K, is the next generation of resolution in televisions and delivers a more detailed",
        created_at: new Date(),
        updated_at: null,
        customers: []
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert product',err);
        }

        console.log(JSON.stringify(result.ops,undefined,2));
    });*/

    db.close();
});
