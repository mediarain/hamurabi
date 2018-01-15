var init = require('../../../src/services/HammurabiGame.js').create();
module.exports = {
  "session": {
    "sessionId": "SessionId.42c9fd44-0aa3-4754-a95b-2f56d6424e2a",
    "application": {},
    "attributes": {
      "modelData": init,
      "state": "query-action"
    },
    "user": {},
    "new": false
  },
  "request": {
    "type": "IntentRequest",
    "requestId": "EdwRequestId.74a139b1-6c1a-4200-8db0-3bfe294e82d4",
    "timestamp": "2016-04-05T05:13:40Z",
    "intent": {
      "name": "BuyIntent",
      "slots": {
        "acresCnt": {
          "name": "acresCnt",
          "value": "5"
        }
      }
    }
  },
  "version": "1.0"
};

