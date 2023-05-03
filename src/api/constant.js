const axios = require('axios')
const aws = require('aws-sdk')

const ssm = new aws.SSM({
  region: "eu-north-1"
});

const fetchKeys = async () => {
  try {
    const getParametersResponse = await ssm.getParameters({
      Names: [
        "MC_AWR_TOKEN",
        "NESTE_GDRIVE_KEY"
      ],
      WithDecryption: true
    }).promise();

    const parameters = getParametersResponse.Parameters;

    const digitransit_sub_key = parameters.find(param => param.Name === "DIGITRANSIT_SUB_KEY").Value

    const graphhopper_api_key = parameters.find(param => param.Name === "GRAPHHOPPER_API").Value

    console.log(graphhopper_api_key, digitransit_sub_key, 'graphhopper_api_key');


    return { digitransit_sub_key, graphhopper_api_key }
  } catch (error) {
    console.log(error, 'error');
  }
}

const graphhopperAPI = axios.create({
  baseURL: 'https://graphhopper.com/api/1'
})

const digitransitAPI = axios.create({
  baseURL: 'https://api.digitransit.fi',
  headers: {
    'Content-Type': 'application/json',
    'digitransit-subscription-key': '486aab41f80e491e9068ec79e3a3f30d',
  },
});



module.exports = { digitransitAPI, graphhopperAPI, fetchKeys }