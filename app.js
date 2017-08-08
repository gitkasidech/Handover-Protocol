const express = require('express')
const bodyParser = require('body-parser')
const request = require("request")

const app = express()

var app_token = "EAABjlvgpvDEBANzcNngL9mipKXU2Hi6bOxZB6tGwjtSpDnuNMM9ttmARHnefBw2ebssduv4EskiJurBBnApkHFOOh88xAtZCkn5naOvkMeg1R84TdOERH76S8v6VFRGMMmUvGh8NMZAy96JRCLxPTseKyaOQs04HiLEbxjgbQZDZD"
var app_tokenB = "EAACZCB9ZCwGHgBAOOJpI0QHIuzLXlStvxsDsgFVGngr73QxrGRN5BalQvuyc4A8FJHrqpei2oZABzeEHZChk0tUXjkXtarvjGNjXQc8l5OI3MRI0XKQKPXAW1woRy54qxCbTO7GZBNzeZBJ9jFWqGKcgDjXAV4binfwdX0MZCBvmAZDZD"

app.set('port', (process.env.PORT || 5000))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send("Hi, I am a chatbot 007")
})

app.get('/a', function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === 'xxx') {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});

app.post('/a', function (req, res) {
    console.log("app A")
    var data = req.body;
    if (data.object === 'page') {

        data.entry.forEach(function (entry) {
            var pageID = entry.id;
            var timeOfEvent = entry.time;

            entry.messaging.forEach(function (event) {
                if (event.message) {
                    receivedMessage(event);
                }
                else if (event.postback) {
                    receivedPostback(event);
                } else {
                    console.log("Webhook received unknown event: ", event);
                }
            });
        });

        res.sendStatus(200);
    }
});

app.get('/b', function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === 'yyy') {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});

app.post('/b', function (req, res) {
    console.log("app B")
    var data = req.body;
    if (data.object === 'page') {

        data.entry.forEach(function (entry) {
            var pageID = entry.id;
            var timeOfEvent = entry.time;

            entry.messaging.forEach(function (event) {
                if (event.message) {
                    receivedMessage(event);
                }
                else if (event.postback) {
                    receivedPostback(event);
                } else {
                    console.log("Webhook received unknown event: ", event);
                }
            });
        });

        res.sendStatus(200);
    }
});

app.get('/c', function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === 'zzz') {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});

app.post('/c', function (req, res) {
    console.log("app C")
    var data = req.body;
    if (data.object === 'page') {

        data.entry.forEach(function (entry) {
            var pageID = entry.id;
            var timeOfEvent = entry.time;

            entry.messaging.forEach(function (event) {
                if (event.message) {
                    receivedMessage(event);
                }
                else if (event.postback) {
                    receivedPostback(event);
                } else {
                    console.log("Webhook received unknown event: ", event);
                }
            });
        });

        res.sendStatus(200);
    }
});

function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);

    var messageId = message.mid;

    var messageText = message.text;
    var messageAttachments = message.attachments;

    if (messageText) {

        switch (messageText) {
            case 'gen':
                sendGenericMessage(senderID);
                break;
            case 'ขาย':
                buyBooksMessage(senderID);
                break;
            case 'สวัสดี':
                sayHi(senderID);
                break;
            default:
                sendTextMessage(senderID, messageText);
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received");
    }

}

function buyBooksMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "ต้องการอะไร",
                    buttons: [
                        {
                            type: "web_url",
                            url: "https://facebook.com/mebooksthailand",
                            title: "เพจ Mebooks"
                        },
                        {
                            type: "postback",
                            title: "Come Back",
                            payload: "Payload for first bubble"
                        },
                        {
                            type: "web_url",
                            url: "https://facebook.com/leeangkit",
                            title: "Chailee"
                        }]

                }
            }
        }
    };

    callSendAPI(messageData);
}

function sendGenericMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [{
                        title: "rift",
                        subtitle: "Next-generation virtual reality",
                        item_url: "https://www.oculus.com/en-us/rift/",
                        image_url: "http://messengerdemo.parseapp.com/img/rift.png",
                        buttons: [{
                            type: "web_url",
                            url: "https://www.oculus.com/en-us/rift/",
                            title: "Open Web URL"
                        }, {
                            type: "postback",
                            title: "Call Postback",
                            payload: "Payload for first bubble"
                        },
                        {
                            type: "web_url",
                            url: "https://facebook.com/mebooksthailand",
                            title: "เพจ MeBOOKs"
                        }],
                    }, {
                        title: "touch",
                        subtitle: "Your Hands, Now in VR",
                        item_url: "https://www.oculus.com/en-us/touch/",
                        image_url: "http://messengerdemo.parseapp.com/img/touch.png",
                        buttons: [{
                            type: "web_url",
                            url: "https://www.oculus.com/en-us/touch/",
                            title: "Open Web URL"
                        }, {
                            type: "postback",
                            title: "Call Postback",
                            payload: "Payload for second bubble"
                        }]
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

function sendTextMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };

    callSendAPI(messageData);
}

function sayHi(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: "สวัสดี นี่คือ LeeBot"
        }
    };

    callSendAPI(messageData);
}

function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: app_token },
        method: 'POST',
        json: messageData

    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            console.log("Successfully sent generic message with id %s to recipient %s",
                messageId, recipientId);
        } else {
            console.error("Unable to send message.");
            console.error(response);
            console.error(error);
        }
    });
}

function receivedPostback(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;

    var payload = event.postback.payload;

    console.log("Received postback for user %d and page %d with payload '%s' " +
        "at %d", senderID, recipientID, payload, timeOfPostback);

    sendTextMessage(senderID, "Postback called");
}

app.listen(app.get('port'), function () {
    console.log("running: port")
})
