var assert = require("assert");
var q = require('q');
var db = require('../opin-neo');

describe('createNode', function(){
	it('should return "" with no params', function(done){
		var result = db.createNode();
		assert.equal(result, "");
		done();
    });

    it('should return node with uuid if no uuid provided and no labels provided', function(done){
    	var result = db.createNode(null, {name: "Steve"});
    	assert.equal(result.parameters.params.name, "Steve");
    	assert.ok(result.parameters.params.uuid);
    	done();
    });

    it('should return node with no labels provided', function(done){
    	var result = db.createNode(null, {name: "Steve", uuid: "Bob"});
    	assert.equal(result.parameters.params.name, "Steve");
    	assert.equal(result.parameters.params.uuid, "Bob");
    	done();
    });

    it('should return node with a single label string provided', function(done){
    	var result = db.createNode("Person", {name: "Steve"});
    	var labelString = result.statement.substring(result.statement.indexOf("%id%")+4);
    	labelString = labelString.substring(0, labelString.indexOf(' '));
    	assert.equal(labelString, ":Person");
    	assert.equal(result.parameters.params.name, "Steve");
    	assert.ok(result.parameters.params.uuid);
    	done();
    });

    it('should return node with a label array provided', function(done){
    	var result = db.createNode(["Person", "Asshole", "Traitor"] , {name: "Steve"});
    	var labelString = result.statement.substring(result.statement.indexOf("%id%")+4);
    	labelString = labelString.substring(0, labelString.indexOf(' '));
    	assert.equal(labelString, ":Person:Asshole:Traitor");
    	assert.equal(result.parameters.params.name, "Steve");
    	assert.ok(result.parameters.params.uuid);
    	done();
    });
});