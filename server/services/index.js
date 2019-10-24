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

    // Subscription worker has timed out, etc, subscribe again
    if( status === 'subscribe') {
      subscribeWorker.postMessage('subscribe')
    }

    // Subscription worker has found result data to be saved by the database worker
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
