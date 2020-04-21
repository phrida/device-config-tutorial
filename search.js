const https = require('https')
const searchOptions = {
  hostname: 'api.ciscospark.com',
  port: 443,
  path: '/v1/devices?tag=signage',
  method: 'GET',
  headers: { 'User-Agent': 'Mozilla/5.0', 
  	'Authorization': 'Bearer YWNiZmM1MDktMjVhZi00YzEyLWFmMDItYWFjNGY2NWUzODdiYzliNmIwYzUtYjEw_PF84_4590eb6a-2ca2-4394-bc27-9b671ce2fe73',
  	'Content-Type': 'application/json'
  }
}

const req = https.request(searchOptions, res => {
  console.log(`statusCode: ${res.statusCode}`)
  	
  var responseString = '';
	res.on('data', function(data) {
	responseString += data;
	});

	res.on('end', function() {
		const devices = JSON.parse(responseString);
  	for (let device of devices.items) {
  		console.log(device.id);
  		applySignage(device.id);
  	}
	var responseObject = JSON.parse(responseString);
	console.dir(responseObject, {depth: null, colors: true})
	});
})

req.on('error', error => {
  console.error(error)
})
//req.write(data);
req.end()

function applySignage(deviceId) {
	const data = JSON.stringify([
	{
	  "op": "replace",
	  "path": "Standby.Signage.Url/sources/configured/value",
	  "value": "hejsan.se"
	},
	{
	  "op": "replace",
	  "path": "Standby.Signage.Mode/sources/configured/value",
	  "value": "On"
	},
	{
	  "op": "replace",
	  "path": "WebEngine.Mode/sources/configured/value",
	  "value": "On"
	},
	{
	  "op": "replace",
	  "path": "Standby.Delay/sources/configured/value",
	  "value": 120
	}
])

	const req = https.request(getPatchOptions(deviceId), res => {
		console.log(res.statusCode);
		var responseString = '';
		res.on('data', function(data) {
		responseString += data;
		});

		res.on('end', function() {
		var responseObject = JSON.parse(responseString);
		console.dir(responseObject, {depth: null, colors: true})
		});
	})

	req.write(data);

	req.on('error', error => {
  		console.error(error)
	})
	//req.write(data);
	req.end()
}

function getPatchOptions(deviceId) {
	return {
	  hostname: 'api.ciscospark.com',
	  port: 443,
	  path: `/v1/deviceConfigurations/${deviceId}`,
	  method: 'PATCH',
	  headers: { 'User-Agent': 'Mozilla/5.0', 
	  	'Authorization': 'Bearer YWNiZmM1MDktMjVhZi00YzEyLWFmMDItYWFjNGY2NWUzODdiYzliNmIwYzUtYjEw_PF84_4590eb6a-2ca2-4394-bc27-9b671ce2fe73',
	  	'Content-Type': 'application/json-patch+json'
	  }
	}
}

