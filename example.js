const axios = require('axios');

const searchConfig = {
	headers: { 'User-Agent': 'Mozilla/5.0', 
		'Authorization': 'Bearer YWNiZmM1MDktMjVhZi00YzEyLWFmMDItYWFjNGY2NWUzODdiYzliNmIwYzUtYjEw_PF84_4590eb6a-2ca2-4394-bc27-9b671ce2fe73',
		'Content-Type': 'application/json'
	}
};

const patchConfig = {
	headers: { 'User-Agent': 'Mozilla/5.0', 
		'Authorization': 'Bearer YWNiZmM1MDktMjVhZi00YzEyLWFmMDItYWFjNGY2NWUzODdiYzliNmIwYzUtYjEw_PF84_4590eb6a-2ca2-4394-bc27-9b671ce2fe73',
		'Content-Type': 'application/json-patch+json'
	}
};

const signageData = 
	JSON.stringify([
		{
		  "op": "replace",
		  "path": "Standby.Signage.Url/sources/configured/value",
		  "value": "nrk.no"
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


axios.get('https://api.ciscospark.com/v1/devices?tag=signage', searchConfig).then(result => {
	console.log(result);
	for (let device of result.data.items) {
		console.log(device);
		axios.patch(`https://api.ciscospark.com/v1/deviceConfigurations/${device.id}`, signageData, patchConfig).then(result => {
			console.log(result);
		}), (error) => {
			console.log(error);
		}
	}
}), (error) => {
	console.log(error);
}




