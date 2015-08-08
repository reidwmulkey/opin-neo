//imported modules
var q = require('q');
var request = require('request');
var uuid = require('node-uuid');
var _ = require('underscore');

//local variables
var serverURL = null; //variable of the neo4j server, set by this.setup()
var testNodes = null; //array of nodes created while in test mode. initialized by this.startTests() and de-initialized by this.stopTests()

module.exports.setup = function(url){
	var deferred = q.defer();
	
	request({
		method: "GET",
		uri: url
	}, function(error, response, body){
		if(response.statusCode === 200 && body){
			try{
				var jsonBody = JSON.parse(body);
				if(jsonBody && jsonBody.neo4j_version){
					serverURL = url;
					deferred.resolve(jsonBody.neo4j_version);	
				} else { 
					deferred.reject({
						statusCode: response.statusCode,
						error: "Received an invalid response back from the neo4j server."
					});
				}
			}catch(e){
				deferred.reject({
					statusCode: 400,
					error: e
				});
			}
		} else {
			deferred.reject({
				statusCode: response.statusCode,
				error: error
			});
		}
	});

  	return deferred.promise;
};	

/////////////////////////////////////////////
// tx() function
/////////////////////////////////////////////
module.exports.tx = function(queries){
	var deferred = q.defer();
	deferred.reject('un-implemented');
	return deferred.promise;
}

/////////////////////////////////////////////
// all() function
/////////////////////////////////////////////
module.exports.all = function(queries){
	var deferred = q.defer();
	deferred.reject('un-implemented');
	return deferred.promise;
}


/////////////////////////////////////////////
// creating data functions
/////////////////////////////////////////////
module.exports.createNode = function(labels, nodeObject){
	var deferred = q.defer();
	deferred.reject('un-implemented');
	return deferred.promise;
}

module.exports.createRel = function(fromId, toId, labels, relObject){
	var deferred = q.defer();
	deferred.reject('un-implemented');
	return deferred.promise;
}

/////////////////////////////////////////////
// searching data functions
/////////////////////////////////////////////
module.exports.getNode = function(uuid){
	var deferred = q.defer();
	deferred.reject('un-implemented');
	return deferred.promise;
}

module.exports.searchNodes = function(labels, searchObject){
	var deferred = q.defer();
	deferred.reject('un-implemented');
	return deferred.promise;
}

module.exports.getRel = function(fromId, toId, labels, searchObject){
	var deferred = q.defer();
	deferred.reject('un-implemented');
	return deferred.promise;
}

module.exports.getRels = function(fromId, toId, labels, searchObject){
	var deferred = q.defer();
	deferred.reject('un-implemented');
	return deferred.promise;
}

/////////////////////////////////////////////
// updating data functions
/////////////////////////////////////////////
module.exports.setNode = function(uuid, nodeObject){
	var deferred = q.defer();
	deferred.reject('un-implemented');
	return deferred.promise;
}

module.exports.setRel = function(fromId, toId, labels, relObject){
	var deferred = q.defer();
	deferred.reject('un-implemented');
	return deferred.promise;
}

/////////////////////////////////////////////
// deleting data functions
/////////////////////////////////////////////
module.exports.deleteNode = function(uuid){
	var deferred = q.defer();
	deferred.reject('un-implemented');
	return deferred.promise;
}

module.exports.deleteRels = function(fromId, toId, labels){
	var deferred = q.defer();
	deferred.reject('un-implemented');
	return deferred.promise;
}

/////////////////////////////////////////////
// test mode functions
/////////////////////////////////////////////
module.exports.startTests = function(){
	var deferred = q.defer();

	//initialize testNodes, thus starting test mode. 
	//In this.createNode(), will check with:
	//if(testNodes) testNodes.push(node.uuid)
	//to handle further deleting
	testNodes = [];

	return deferred.promise;
}

module.exports.stopTests = function(){
	var deferred = q.defer();

	var deletedNodes = [], deletedRels = [];
	_.each(testNodes, function(uuid){
		deletedRels.push(this.deleteRels(uuid));
	});

	//first delete all relationships from the test nodes
	q.all(deletedRels)
	.then(function(){
		//then delete all the nodes
		_.each(testNodes, function(uuid){
			deletedNodes.push(this.deleteNode(uuid));
		});

		return q.all(deletedNodes);
	})
	.then(function(){
		//then de-initialize testNodes, thus stopping test mode
		testNodes = null;
		deferred.resolve();
	}).catch(function(e){
		deferred.reject(e);
	})
	return deferred.promise;
}