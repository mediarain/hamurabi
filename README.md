# Hamurabi Alexa
A Node application allowing Amazon Alexa users to play the classic Hamurabi terminal game.

# Development Setup
 * In `config/local.json`, edit the `appId` to your own appId obtained by starting a new Alexa skill at http://developer.amazon.com
 * Update your interaction model using `intents.json` and `utterances.txt`
 * Setup Node.js  v0.10.36. This is the only version supported by AWS Lambda right now
 * Verify with ```node version```
 * ```npm install```
 * ```npm test```
 * If running on AWS Lambda, zip and upload to your Lambda function
 * If running locally with http://ngrok.io or similar, start the thing up ```npm start```
