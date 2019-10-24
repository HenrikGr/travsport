/**
 * Subscriber worker thread module
 */
const { parentPort } = require("worker_threads")

/**
 * XHR wrapper to call end point api
 * @type {getEventData}
 */
const getEventData = require("./getEventData")

/**
 * Listening on messages from parent
 */
parentPort.on("message", message => {
  if( message === 'start' || message === 'subscribe') {
    subscribe()
  }
})

async function delay(interval = 4000) {
  await new Promise(resolve => setTimeout(resolve, interval));
}

/**
 * Subscription function, using axios to get data from polling enabled API endpoint
 * The function is recursive
 * @returns {Promise<void>}
 */
async function subscribe(interval = 4000) {
  await delay()
  console.log('start subscribing')
  let response = await getEventData()

  // If no content - restart subscribing
  if (response.status !== 200) {
    parentPort.postMessage({status: 'subscribe'})
  } else {

    // Data has been retrieves - call the parent to initiate the save worker thread
    let { data } = await response

    // Ensure database worker thread gets notified to save the data
    parentPort.postMessage({status: 'save', data: data})
  }
}
