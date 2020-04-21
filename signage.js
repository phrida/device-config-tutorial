const https = require('https')
const options = {
  hostname: 'api.ciscospark.com',
  port: 443,
  path: '/v1/deviceConfigurations/Y2lzY29zcGFyazovL3VybjpURUFNOnVzLWVhc3QtMl9hL0RFVklDRS9hZGNkNmUzOS1lNjYxLTQ5ZjktODIwOC1kYzU3MTQwZjI4YTI',
  method: 'PATCH',
  headers: { 'User-Agent': 'Mozilla/5.0', 
  	'Authorization': 'Bearer YWNiZmM1MDktMjVhZi00YzEyLWFmMDItYWFjNGY2NWUzODdiYzliNmIwYzUtYjEw_PF84_4590eb6a-2ca2-4394-bc27-9b671ce2fe73',
  	'Content-Type': 'application/json-patch+json'
  }
}

const data = JSON.stringify([
	{
	  "op": "replace",
	  "path": "Standby.Signage.Url/sources/configured/value",
	  "value": "svt.se"
	},
	{
	  "op": "replace",
	  "path": "Standby.Signage.InteractionMode/sources/configured/value",
	  "value": "Interactive"
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

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', d => {
    process.stdout.write(d)
  })
})

req.on('error', error => {
  console.error(error)
})
req.write(data);
req.end()