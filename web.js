var express = require('express');
var BurstTrie = require("burst-trie");
var OptionsFromBSTNode = require("./OptionsFromBSTNode.js");

var port = process.env.PORT || 5000;
var app = express.createServer();
var myTrie = BurstTrie.createTrie();
var myOptions = new OptionsFromBSTNode(myTrie);
var myTrieWriter = BurstTrie.createTrieWriter();

loadDict(myTrie,1000);

app.configure(function ()
{
	app.use(express.query());
	app.use(express.methodOverride());
});

app.get('/autocomplete/:value', function(request, response)
{
	var term = request.params["value"];
	var options = myOptions.getOptionsFor(term);

	response.send(options);

	console.log("Responded to " + term + " with " + options.length + " options");
});

app.get('/dict', function(request, response)
{
	response.send("<pre>" + myTrieWriter.writeTrie(myTrie) + "</pre>");
});

app.listen(port, function()
{
	console.log("Listening on " + port);
	console.log("Send autocomplete requests to /autocomplete/:value");
	console.log("View trie by sending request to /dict");
});

function loadDict(trie,maxWords)
{
	var fs = require("fs");
	var data = fs.readFileSync( "dict/string.txt", "utf8");
	var words = data.split(" ");
	var numWords = Math.min(words.length,maxWords);
	var terms = [];
	var word;

	for (var i=0; i < numWords; i++)
	{
		terms.push(words[i]);
	}

	terms.sort(randOrd);

	for (var i=0; i < numWords; i++)
	{
		trie.add(terms[i]);
	}

	return terms;
}

function randOrd()
{
	return (Math.round(Math.random())-0.5);
}