const axios = require("axios");

/**
 * HTTP client configuration
 * @type {{baseURL: string, contentType: string}}
 */
const config = {
  baseURL: "http://35.207.169.147"
};

/**
 * Axios instance
 * @type {AxiosInstance}
 * @private
 */
const xhr = axios.create(config);

/**
 * Error handler
 * @param error
 * @returns {*|T}
 */
function errorHandler(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return error.response.data;
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return error.request;
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message;
  }
}

/**
 * Get data
 * @returns {Promise<T>}
 */
async function getEventData() {
  try {
    return await xhr.get('/results')
  } catch (e) {
    return errorHandler(e)
  }
}

module.exports = getEventData
