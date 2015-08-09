var assert = require("assert");
var q = require('q');
var db = require('../opin-neo');

describe('tx', function(){
	before(function(done){
		db.setup("http://localhost:7474/db/data/").then(function(){
			done();			
		}).catch(function(error){
			done(error);
		});
	});

	after(function(done){ 	
		done();
	});

	it('should reject with no statements received', function(done){
		db.tx().then(function(data){
			done(data);
		}).catch(function(error){
			assert.equal(error.statusCode, 400);
			done();
		});
    });

    it('should reject with an invalid statement received', function(done){
		db.tx(db.createNode()).then(function(data){
			done(data);
		}).catch(function(error){
			assert.equal(error.statusCode, 400);
			done();
		});
    });

    it('should reject with multiple invalid statements received', function(done){
		db.tx([
			db.createNode(),
			db.createNode(),
			db.createNode()
		]).then(function(data){
			done(data);
		}).catch(function(error){
			assert.equal(error.statusCode, 400);
			done();
		});
    });

    it('should resolve with a valid statement received', function(done){
		db.tx(db.createNode(null, {name: "Steve"}))
		.then(function(data){
			console.log(data);
			done();
		}).catch(function(error){
			done(error);
		});
    });
});