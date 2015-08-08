Background
==============

After about half a year of developing express neo4j applications, I have had several takeaways about developing graph database applications, and have had several frustrations with the current express adapters to the neo4j rest interface. 

-Most are not promise driven, an importance that shouldn't even need to be stressed.

-They  have functions that depend on the neo4j node id's. These id's are assigned with volatility, So should not be used for any queries.

-Transactions are unsupported.

Because of these reasons, development boiled down to just running pre-written queries, which has worked very well, but in order for neo4j express applications to get anywhere close to the point of MEAN applications, we're going to need a much more intuitive way of accessing our data.

Assumptions
==============

Being an opinionated adapter, this program will run off a couple assumptions for your database.

-each node has a .uuid property that is a unique string. If one is passed in when creating a node, it will be used. If not, then a uuid will be generated from node-uuid.

-transactions should be used for any multi-part queries that are dependent on each other, e.g., creating a group and then adding a user to a group.

-transactions and batch processes will use promise arrays. I have found this is the easiest way to pass pre-set parameters into promise chains. 

-Labels should be used extensively throughout the application, due to auto-indexing. For writing a generic query, a label of null will apply to all nodes. Passing an array of labels will instead query with each of those labels applied.

-Unit testing isn't entirely there yet for neo4j unfortunately. To get around this, all nodes and relationships created under test mode will be deleted when test mode is disabled.

Usage
===============

Initialization
---------------
In main.js/app.js, first initialize the adapter with the URL of your neo4j rest API:

	...
	var db = require('opin-neo');
	db.setup("http://127.0.0.1:7474/db/data/");
	//in order to authenticate:
	db.setup("http://bob:iAmABadAdmin@127.0.0.1:7474/db/data/");
	...

Creating nodes
---------------
	//nodeObject: JSON object with the properties to store for the node
	//Labels: either null, a string, or an array of strings which should be applied as labels
	db.createNode(Labels, nodeObject).then(function(node){
		//returns the node object created, with a generated .uuid property if one was not provided
	})

Batch creation
----------------
Each promise will execute in a promise.all() asynchronous fashion

	db.all([
		db.createNode(["Oolong", "Tea"], {name:"Low oxidation Oolong"}),
		db.createNode(["Chai", "Tea", "Yerba Mate"], {name:"Yerba Chai"}),
		db.createNode("Store", {name:"Avoca Coffee Shop"}),
		db.createNode(null, {name:"Random node"})
	]).then(function(results){
		//returns an array of the nodes created
		console.log(results[0].name); //logs "Low oxidation Oolong"
		console.log(results[1].name); //logs "Yerba Chai"
		console.log(results[2].name); //logs "Avoca Coffee Shop"
		console.log(results[3].name); //logs "Random node"
	})

Creating Relationships
--------------
If passed integers, it will use the uuid of a transaction array index. If passed strings, it will use node UUIDs. 

	db.createRel(fromId, toId, Labels, relObject).then(function(relationship){
		console.log(relationship.from); //logs the from node
		console.log(relationship.to); 	//logs the to node
		console.log(relationship.data);	//logs the relationship properties
	}) 

Transactions
-----------------------
Each promise will resolve synchronously, so that data from one can be used by a following promise.

	db.tx([
		db.createNode("Store", {name:"Avoca Coffee Shop"}),
		db.createNode(["Chai", "Tea", "Yerba Mate"], {name:"Yerba Chai"}),
		db.createRel(0, 1, "STORE_HAS_TEA", {quantity: 10})
	]).then(function(results){
		console.log(results[0].name); //logs "Avoca Coffee Shop"
		console.log(results[1].name); //logs "Yerba Chai"
		console.log(results[2].data.quantity); //logs 10	
	});

Finding nodes
--------------
	db.getNode(uuid).then(function(node){

	})

	//search object is a JSON object with properties you are looking for. Supports the cypher regular expressions
	db.searchNodes(Labels, searchObject).then(function(nodes){

	})

	//can also use collection searching in the searchObject, e.g.,
	db.searchNodes("Tea", {
		name: ["Yerba Chai", "Low oxidation Oolong", "Some other name"]
	}).then(function(nodes){

	});

	db.findRels(fromId, toId, Labels, searchObject).then(function(rels){

	})

Updating information
--------------------
	db.setNode(uuid, nodeObject).then(function(node){
	})

	db.setRel(fromId, toId, Labels, relObject).then(function(rel){
	})	

Deleting information
--------------------
	db.deleteNode(uuid).then(function(){
		//resolves with no parameters	
	})

	db.deleteRels(fromId, toId, Labels).then(function(){
		//resolves with no parameters
	})	

Test Mode
============
In order to perform unit tests, you must first enable testing mode.

	db.startTests().then(function(){
		//nodes and relationships created will be deleted when test mode is stopped
	});

Testing mode will keep track of all nodes and relationships created, and this information will be deleted when you stop testing mode.

	db.stopTests().then(function(){
		//nodes and relationships created while in testing mode are all deleted
	});

Due to security/"Woops, there goes the whole database" concerns, test mode will eventually be removed from the main branch forked off into its own project.