#!/usr/bin/env node
var fs = require('fs');
var https = require('https');

function getdesktimeUrl(apiKey){
	return `https://desktime.com/api/v2/json/employee?apiKey=${apiKey}`;
}

const argv = require('yargs')
.usage('Usage : desktime --key=YOUR_DESKTIME_API_KEY')
.command('count', 'Count the lines in a file')
.example('desktime --key=YOUR_DESKTIME_API_KEY')
.describe('key', 'Loads API key')
.alias('k', 'key')
.describe('version', 'Version number')
.alias('v', 'version')
.help('help')
.epilog('copyright 2018')
.argv;

// .demandOption(['key'])

if (argv.help) {
	console.log('Goto https://desktime.com/app/api to get the desktime API key.');
}
if (argv.config) {
	if (!argv.key || argv.key=="") {
		return console.log("Please specify the key.");
	} else {
		fs.writeFile('desktime.conf', argv.key, (err) => {
			if (err) throw err;
			console.log('Success!');
		});
	}
}

if (argv.sample) {
	fs.readFile('desktime.conf', (err, apiKey) => {
		if (err) throw err;
		https.get(getdesktimeUrl(apiKey), res => {
			res.setEncoding("utf8");
			let body = "";
			res.on("data", data => {
				body += data;
			});
			res.on("end", () => {
				body = JSON.parse(body);
				console.log(body);
			});
		});
	});
}