var fs = require("fs");

var BurstTrie = require("burst-trie");
var OptionsFromBSTNode = require("./OptionsFromBSTNode.js");

var Autocomplete = module.exports = function (dictPath)
{
	this.trie = BurstTrie.createTrie();
	this.options = new OptionsFromBSTNode(this.trie);
	this.trieWriter = BurstTrie.createTrieWriter();

	this.load(dictPath);
};

Autocomplete.prototype.trieToString = function ()
{
	return this.trieWriter.writeTrie(this.trie);
};

Autocomplete.prototype.load = function(path)
{
	var data = fs.readFileSync(path, "utf8");
	var words = data.split(" ");

	words.sort(randOrd);

	for (var i=0; i < words.length; i++)
	{
		this.add(words[i]);
	}
};

Autocomplete.prototype.add = function(term)
{
	this.trie.add(term);
};

Autocomplete.prototype.unload = function()
{
	this.trie = BurstTrie.createTrie();
};

Autocomplete.prototype.getOptionsFor = function (term)
{
	return this.options.getOptionsFor(term);
};

function randOrd()
{
	return (Math.round(Math.random())-0.5);
};