var express = require('express');
var util = require("util");
var Autocomplete = require("./Autocomplete.js");

var port = process.env.PORT || 5000;
var app = express.createServer();
var autocomplete = new Autocomplete("dict/string.txt");

app.configure(function ()
{
	app.use(express.query());
	app.use(express.methodOverride());
});

app.get('/autocomplete/:value', function(request, response)
{
	var term = request.params["value"];
	var startTime = new Date();
	var options = autocomplete.getOptionsFor(term);
	var endTime = new Date();
	var execTime = (endTime.getTime() - startTime.getTime());

	var result = {
		summary: {
			execTime: execTime,
			execTimeUnits: "ms",
			optionCount: options.length
		},
		options: options
	}

	response.send(result);

	console.log("Responded to " + term + " with " + options.length + " options in " + execTime + "ms");
});

app.get('/dict', function(request, response)
{
	response.send("<pre>" + autocomplete.trieToString() + "</pre>");
});

app.get('/memory', function (request,response)
{
	response.send(util.inspect(process.memoryUsage()));
});

app.get('/add/:term', function (request,response)
{
	var term = request.params["term"];

	autocomplete.add(term);

	response.send(term + " added");
});

app.get('/unload', function (request,response)
{
	autocomplete.unload();

	response.send("unloaded");
});

app.listen(port, function()
{
	console.log("Listening on " + port);
	console.log("Send autocomplete requests to /autocomplete/:value");
	console.log("View trie by sending request to /dict");
});