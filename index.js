#!/usr/bin/env node
var fs = require('fs');
var https = require('https');
const chalk = require('chalk');
const moment = require('moment');

function getdesktimeUrl(apiKey){
	return `https://desktime.com/api/v2/json/employee?apiKey=${apiKey}`;
}

function makeDashboard(dtData){
	let conversation = `Hi ${chalk.greenBright(dtData.name.split(' ')[0])}, You are ${chalk.greenBright(parseInt(dtData.productivity))}${chalk.greenBright('%')} productive today and you may leave by ${chalk.greenBright(getExpectedLeavingTime(dtData.atWorkTime))}`;
	console.log(conversation);
} 

function getExpectedLeavingTime(atWorkTime){
	let now = moment();
	let workRemaining = (32400 - atWorkTime);
	return now.add(workRemaining, 'seconds').format('LTS');
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
		console.log('Goto https://desktime.com/app/api to get the desktime API key.');
		return console.log("Please specify the key using --key option.");
	} else {
		fs.writeFile('.desktime.conf', argv.key, (err) => {
			if (err) throw err;
			console.log('Success!');
		});
	}
}

fs.readFile('.desktime.conf', (err, apiKey) => {
	if (err) {
		console.log('Goto https://desktime.com/app/api to get the desktime API key.');
		return console.log("Please specify the key using --key option.");
	} ;
	https.get(getdesktimeUrl(apiKey), res => {
		res.setEncoding("utf8");
		let body = "";
		res.on("data", data => {
			body += data;
		});
		res.on("end", () => {
			body = JSON.parse(body);
				// console.log(body);
				makeDashboard(body);
			});
	});
});