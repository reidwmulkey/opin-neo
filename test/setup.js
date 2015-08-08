var assert = require("assert");
var q = require('q');
var db = require('../opin-neo');

describe('Setup', function(){
	before(function(done){
		done();
	});

	after(function(done){ 	
		done();
	});

	it('should not error with a valid server address provided and no authentication', function(done){
		db.setup("http://localhost:7474/db/data/").then(function(data){
			done();
		}).catch(function(error){
			done(error);
		});
    });

	it('should not error with a valid server address provided and valid authentication', function(done){
		db.setup("http://admin:admin@localhost:7474/db/data/").then(function(data){
			done();
		}).catch(function(error){
			done(error);
		});
    });

    it('should error with a valid server address provided and invalid authentication', function(done){
		db.setup("http://failure:badadmin@localhost:7474/db/data/").then(function(data){
			
			done("TODO: implement http mocks to mock a 401 from neo. " + data);
		}).catch(function(error){
			console.log(error);
			done();
		});
    });

    it('should error with an invalid server address provided', function(done){
		db.setup("http://www.google.com/").then(function(data){
			done(data);
		}).catch(function(error){
			done();
		});
    });
});