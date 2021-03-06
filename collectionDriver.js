var objectId = require('mongodb').ObjectID;

CollectionDriver = function(db) {
    this.db = db;
};

CollectionDriver.prototype.getCollection = function(collectionName, callback) {
    this.db.collection(collectionName, function(error, the_collection) {
        if (error) callback(error);
        else callback (null, the_collection);
    });
};

CollectionDriver.prototype.findAll = function(collectionName, callback) {
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error);
        else {
            the_collection.find().toArray(function(error, results) {
                if (error) callback(error);
                else callback(null, results);
            });
        }
    });
}

//get an object from a collection
CollectionDriver.prototype.get = function(collectionName, id, callback) { //A
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error);
        else {
            var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$"); //B
            if (!checkForHexRegExp.test(id)) callback({error: "invalid id"});
            else the_collection.findOne({'_id':ObjectID(id)}, function(error,doc) { //C
                if (error) callback(error);
                else callback(null, doc);
            });
        }
    });
};

// save an object to a collection
CollectionDriver.prototype.save = function(collectionName, obj, callback) {
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) {
            callback(error);
        } else {
            obj.created_at = new Date();
            the_collection.insert(obj, function() {
                callback(null, obj);
            });
        }
    });
};

exports.CollectionDriver = CollectionDriver;
