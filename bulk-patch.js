const axios = require("axios");
const parseLinkHeader = require('parse-link-header');

const ACCESS_TOKEN =
  "enter your access token here";

const searchConfig = {
  headers: {
    "User-Agent": "Mozilla/5.0",
    "Authorization": `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
};

const patchConfig = {
  headers: {
    "User-Agent": "Mozilla/5.0",
    "Authorization": `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json-patch+json",
  },
};

// Fill in any search limits you want to put on the selection of devices that you want to apply a setting to
const searchParams =  {
  personId: null,
  placeId: null,
  orgId: null,
  displayName: null,
  product: null,
  tag: null,
  connectionStatus: null,
  serial: null,
  software: null,
  upgradeChannel: null,
  errorCode: null,
  capability: null,
  permission: null,
};

// Uncomment and replace example with setting(s) you want to bulk apply
const bulkSettings = [
  // {
  //   op: "replace",
  //   path: "NetworkServices.HTTP.Mode/sources/configured/value",
  //   value: "HTTP+HTTPS",
  // },
  // {
  //   op: "remove",
  //   path: "NetworkServices.HTTP.Mode/sources/configured/value",
  // },
];

// Convert searchParamms into the params part of the url
const filteredParams = Object.entries(searchParams)
  .filter(([key, value]) => value);
const devicesQuery = filteredParams.length === 0 ? ''
  : '?' + filteredParams
  .map(([key, value]) => `${key}=${value}`)
  .join('&');

// Recursive function to fetch all devices across pages
const getDevices = (url) => {
  return axios.get(url, searchConfig)
    .then(result => {
      console.log(`- Fetched ${url}`);
      if (result.headers.link) {
        const link = parseLinkHeader(result.headers.link.replace('>', '>;'));
        return Promise.all([
          result.data.items,
          getDevices(link.next.url)
        ])
          .then(pages => Array.prototype.concat.apply([], pages));
      } else {
        return result.data.items;
      }
    });
};

// Patch every device with settings from bulkSettings
console.log('\nGetting devices...');
getDevices(`https://api.ciscospark.com/v1/devices${devicesQuery}`).then(devices => {
  console.log(`\nApplying ${bulkSettings.length} settings to ${devices.length} devices...`);
  devices.forEach(device => {
    const url = `https://api.ciscospark.com/v1/deviceConfigurations/${device.id}`;
    axios.patch(url, JSON.stringify(bulkSettings), patchConfig)
      .then(() => {
        console.log(`- Patched ${url} (${device.displayName})`);
      })
      .catch(error => {
        if (error.response) {
          console.log(`- Patching ${url} (${device.displayName}) resulted in a ${error.response.status}: ${error.response.data.message}. trackingid: ${error.response.headers.trackingid}`);
        }
      });
  });
});
