/**
 * Database worker thread module
 */
const { parentPort } = require("worker_threads");

/**
 * App config
 * @type {Object}
 */
const config = require('../config')

/**
 * Mongoose
 * @type {Mongoose}
 */
const mongoose = require("mongoose")

/**
 * Mongoose schema
 */
const Schema = mongoose.Schema;

/**
 * Use built in promise library
 * @type {Function}
 */
mongoose.Promise = global.Promise;

/**
 * Create a new schema for result
 */
const schema = new Schema({
  event: { type: String },
  horse: { id: Number, horse: String },
  time: { type: Number }
});

/**
 * Mongoose model for the result collection
 * @type {Model}
 */
const Model = mongoose.model("Result", schema);

/**
 * Listening on messages from parent
 */
parentPort.on("message", incoming => {
  const { status, data } = incoming;

  // Parent issued a connect to database message
  if (status === "connect") {
    mongoose
      .connect(config.mongoUri, config.mongoOptions)
      .then(() => {
        console.info("Mongoose connected successfully", config.mongoUri)

        // When connected - tell parent to start a new subscription
        parentPort.postMessage({ status: "subscribe" });
      })
      .catch(error => {
        console.error("Mongoose connected failed: " + error);
      })
  }

  // Save data in mongo db
  if (status === "save") {
    saveData(data);
  }
});

/**
 * Save data to mongo db
 * @param data
 * @returns {Promise<void>}
 */
async function saveData(data) {
  console.log("start saving", data)
  const document = new Model(data)
  await document.save()

  // When data is saved - tell parent to start a new subscription
  parentPort.postMessage({ status: "subscribe" })
}
