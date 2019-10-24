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

/**
 * delay function
 * @param interval
 * @returns {Promise<void>}
 */
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

  // If no content - tell parent to start a new subscription
  if (response.status !== 200) {
    parentPort.postMessage({status: 'subscribe'})
  } else {

    // Data has been retrieves - tell parent that
    let { data } = await response
    parentPort.postMessage({status: 'save', data: data})
  }
}
