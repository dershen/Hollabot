require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || 8080

var   bodyParser = require('body-parser')
var   proxy = require('express-http-proxy')
var request = require("request");

app.use(express.static('static'))

app.get('/test', (req, res) => res.send('<h1>Hello World!<h2>'))
// app.use('/', proxy('http://63.33.65.125/'));

app.get('/create_session', (req, res) => {
	// call watson api and create a session
		console.log(req.query)

		var options = { method: 'POST',
		  url: 'https://gateway-fra.watsonplatform.net/assistant/api/v2/assistants/f8eab3dc-e954-419c-9ca5-679b7a525189/sessions',
		  qs: { version: '2018-11-08' },
		  headers:
		   { 'Postman-Token': 'b879df4e-8275-47e2-8f53-0fc82df399d2',
		     'cache-control': 'no-cache',
		     Authorization: 'Basic YXBpa2V5Oi1YdnpGSU5yY3VCa0hOa1ZWc01idzNEdmkzR0lwa1FoOWJlYTYxUFpDeFk5',
		     version: '2018-11-08',
		     'Content-Type': 'application/json' },
		  body: {},
		  json: true };

		request(options, function (error, response, body) {
		  if (error) throw new Error(error);
		  res.send(body.session_id)
		  console.log(body);
		});
	})


app.get('/send_message',(req, res) => {
	console.log(req.query)


	var options = { method: 'POST',
	  url: `https://gateway-fra.watsonplatform.net/assistant/api/v2/assistants/f8eab3dc-e954-419c-9ca5-679b7a525189/sessions/${req.query.session}/message`,
	  qs: { version: '2018-11-08' },
	  headers:
	   { 'Postman-Token': 'dd3432c5-2948-46d1-88bb-8e1335a20fda',
	     'cache-control': 'no-cache',
	     Authorization: 'Basic YXBpa2V5Oi1YdnpGSU5yY3VCa0hOa1ZWc01idzNEdmkzR0lwa1FoOWJlYTYxUFpDeFk5',
	     'Content-Type': 'application/json' },
	  body: { input: { text: req.query.message } },
	  json: true };

	request(options, function (error, response, body) {
	  if (error) throw new Error(error);
	  console.log(body.output.generic.map(val => { return {text : val.text, source : val.source }}))
	  res.type('json')
	  res.send({ res: body.output.generic.map(val => { return {text : val.text, source : val.source }})})
	});
})

app.get( '/speak', (req, res) => {

	res.setHeader(
		'Content-Type','audio/mpeg'
		)
	var options = { method: 'GET',
	  url: 'https://stream-fra.watsonplatform.net/text-to-speech/api/v1/synthesize',
	  qs: { text: req.query.message },
	  headers:
	   { 'Postman-Token': '890bf087-68ff-45bc-8d26-a713799fd4b2',
	     'cache-control': 'no-cache',
	     Authorization: 'Basic YXBpa2V5OmUtckdRTXJsNW1JcmRoUUM4bUJxeHZ0N0ZZcXdtdHNqQWh4Tklhdi10cjFH',
     Accept: 'audio/mp3' } };

	request(options, function (error, response, body) {
	  if (error) throw new Error(error);
		// res.send(body)
		res.send(body)
	  console.log(body);
	});
	})

app.use('/speech', proxy('https://stream-fra.watsonplatform.net/'));


app.listen(port, () => console.log(`Example app listening on port ${port}!`))