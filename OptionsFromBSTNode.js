var BaseOptions = require("./BaseOptions.js");
var BSTTraverser = require("../Burst/BSTTraverser.js");
var ATNTraverser = require("../Burst/ATNTraverser.js");

var OptionsFromBSTNode = module.exports = function (trie)
{
	this.trie = trie;
};

OptionsFromBSTNode.prototype = new BaseOptions();

OptionsFromBSTNode.prototype.getOptionsFor = function (term)
{
	var results = this.trie.get(term);
	var options = [];

	this.produceOptions(results.node,options,results.prefix);

	options.sort();

	return options;
};

OptionsFromBSTNode.prototype.produceOptions = function(node,options,prefix)
{
	if (node.getType() == "CON")
	{
		BSTTraverser.traverse(node.bst,addOption,prefix);
	}
	else if (node.getType() == "ATN")
	{
		ATNTraverser.traverse(node,addOption,prefix);
	}

	function addOption(item,itemPrefix)
	{
		var option = itemPrefix + item.value;

		options.push(option);
	}
}