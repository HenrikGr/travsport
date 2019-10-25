/**
 * Worker services
 */
const { Worker } = require("worker_threads");

/**
 * Services that dealing with communicating to worker thread
 * for subscription and database
 * @returns {Promise<void>}
 */
async function runService() {
  const subscribeWorker = new Worker("./server/services/subscribeWorker.js");
  const dbWorker = new Worker("./server/services/dbWorker.js");

  /**
   * Start to ensure database worker thread connect to the database
   * When successful, it will call back to start subscription
   */
  dbWorker.postMessage({status: 'connect'})

  /**
   * Listening on feedback messages from subscription worker
   */
  subscribeWorker.on("message", incoming => {
    const { status, data } = incoming

    // Tell subscription worker to start a subscription
    // - After connection to the database is established
    // - After a subscription call has timed out
    // - After data has been saved
    if( status === 'subscribe') {
      subscribeWorker.postMessage('subscribe')
    }

    // Call database worker to save data
    if( status === 'save') {
      dbWorker.postMessage({status: 'save', data: data})
    }

  })
  subscribeWorker.on("error", code => new Error(`Subscribe Worker error with exit code ${code}`));
  subscribeWorker.on("exit", code =>
    console.log(`Subscribe Worker stopped with exit code ${code}`)
  )

  /**
   * Listening on feedback messages from database worker
   */
  dbWorker.on("message", incoming => {
    const { status, data } = incoming

    // Call subscription worker after data has been saved by the save worker
    if( status === 'subscribe') {
      subscribeWorker.postMessage('subscribe')
    }

  })
  dbWorker.on("error", code => new Error(`Save Worker error with exit code ${code}`));
  dbWorker.on("exit", code =>
    console.log(`Save Worker stopped with exit code ${code}`)
  )
}

module.exports = async function run() {
  await runService()
};
