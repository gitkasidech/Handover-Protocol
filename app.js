const express = require('express')
const bodyParser = require('body-parser')
const request = require("request")

const app = express()

var app_token = "EAAEidIjohVEBAAJSkKuRF7j4HiQxuQTijj2m1c4mTZBxxBZCOKxOGIPzZC6IyHdn4hc2oMM4WivaDi7hw6Yhd6whcU4NjHhTw8yUEsaZBQHVX3895e2r0xAp0iwCwID5Nsx8Ni5wYQtALfu3LwbD1VJ3hlCWLARLIjOG8P2ZBxgZDZD"
var app_tokenB = "EAABwcUqVk8QBADMWPBcb49OE4p2CyTxqLZCVDqiKNfzB5kN37ibR1CYHzqJqXhF0lA9qBZCHKLRmK8CAObCHZA6TX5YsbFXHxZBAiJbUVH0pG2INsqzTNZCW4Pue4kUE7ZAMAAbAUywLxlL04rwwxPYHNkiLK9r56eTUnCy1bHdgZDZD"
var app_tokenC = "EAAGlnrEPE2IBAEPm6kp5jFzx9FCNzcEvBwtsuL5tgA6S0mFHnFCioNazxjYJ7zWn444eJbg36DWQxxoPTfQNRRtrasTaMdcOLk14N9S6NAPkqcjV5GH5IMuGu8JllZAJcq8zeeqgKuRax0a9jZAFd5HLXZCygK7DSOI5AL2gAZDZD"

app.set('port', (process.env.PORT || 5000))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send("Hi, I am a chatbot 007")
})
// ===================================================================================
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
    var data = req.body;
    if (data.object === 'page') {
        data.entry.forEach(function (entry) {
            var pageID = entry.id;
            var timeOfEvent = entry.time;
            entry.messaging.forEach(function (event) {
                if (event.message) {
                    receivedMessageA(event);
                } else {
                    console.log("Webhook received unknown event: ", event);
                }
            });
        });
        res.sendStatus(200);
    }
});
// ===================================================================================
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
                    receivedMessageB(event);
                } else {
                    console.log("Webhook received unknown event: ", event);
                }
            });
        });
        res.sendStatus(200);
    }
});
// ===================================================================================
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
                    receivedMessageC(event);
                } else {
                    console.log("Webhook received unknown event: ", event);
                }
            });
        });
        res.sendStatus(200);
    }
});
// ===================================================================================
function receivedMessageA(event) {
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
            case 'a2b':
                sendA2B(senderID);
                break;
            case 'a2c':
                sendA2C(senderID);
                break;
            default:
                sendTextMessage(senderID, messageText);
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received");
    }

}
// ====================================================================================
function sendA2B(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        target_app_id: 123631884932036,
        metadata: "free formed text for another app"
    };

    callAPIA2B(messageData);
}
function callAPIA2B(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/pass_thread_control',
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
// ====================================================================================
function sendA2C(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        target_app_id: 463575970681698,
        metadata: "free formed text for another app"
    };

    callAPIA2C(messageData);
}
function callAPIA2C(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/pass_thread_control',
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
// ========================================================================================
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
// =======================================================================================
function receivedMessageB(event) {
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
            case 'b2a':
                sendB2A(senderID);
                break;
            case 'b2c':
                sendB2C(senderID);
                break;
            default:
                break;
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received");
    }

}
// ===================================================================================
function sendB2A(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        target_app_id: 319358885201233,
        metadata: "free formed text for another app"
    };

    callAPIB2A(messageData);
}
function callAPIB2A(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/pass_thread_control',
        qs: { access_token: app_tokenB },
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
// ===================================================================================
function sendB2C(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        target_app_id: 463575970681698,
        metadata: "free formed text for another app"
    };

    callAPIB2C(messageData);
}
function callAPIB2C(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/pass_thread_control',
        qs: { access_token: app_tokenB },
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
// ===================================================================================
function receivedMessageC(event) {
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
            case 'c2a':
                sendC2A(senderID);
                break;
            case 'c2b':
                sendC2B(senderID);
                break;
            default:
                break;
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received");
    }

}
// ===================================================================================
function sendC2A(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        target_app_id: 319358885201233,
        metadata: "free formed text for another app"
    };

    callAPIC2A(messageData);
}
function callAPIC2A(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/pass_thread_control',
        qs: { access_token: app_tokenC },
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
// ===================================================================================
function sendC2B(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        target_app_id: 123631884932036,
        metadata: "free formed text for another app"
    };

    callAPIC2B(messageData);
}
function callAPIC2B(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/pass_thread_control',
        qs: { access_token: app_tokenC },
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
// ===================================================================================
app.listen(app.get('port'), function () {
    console.log("running: port")
})
