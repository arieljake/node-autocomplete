var BurstTrie = require("../Burst/BurstTrie.js");
var OptionsFromBSTNode = require("./OptionsFromBSTNode.js");
var LinePrefix = require("../Burst/LinePrefix.js");

var myTrie = new BurstTrie();
var myOptions = new OptionsFromBSTNode();
var loadedTerms = loadDict(myTrie,100);

getOptions(loadedTerms[0], myOptions);

function addTerm(term,trie)
{
	trie.add(term);

	console.log("adding " + term);
}

function getOptions(term,options)
{
	var results = myTrie.get(term);
	options.node = results.node;

	console.log("options for " + term);
	console.dir(options.getOptions(results.prefix));
	console.log(options.node.getType());
	console.log(options.node.asString(new LinePrefix("")));
}

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

	console.log(trie.toString());

	return terms;
}

function randOrd()
{
	return (Math.round(Math.random())-0.5);
}