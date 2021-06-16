//Load tmi.js as it is required for interacting with Twitch chat.
const tmi = require("tmi.js");

var client;

function start(channels) {
    if (client == null) {
        //Config settings for our Twitch client.
        client = new tmi.client({
            identity: {
                username: process.env.USERNAME,
                password: process.env.TOKEN
            },
            channels: channels
        })
    
        /*
        * Event handlers for our Twitch client.
        */
    
        client.on("connected", (address, port) => {
            console.log(`Connected to ${address}:${port}...`);
        });
    
        client.on("join", (channel, username, self) => {
            if (self)
                console.log(`Joined channel ${channel}`);
        });
    
        client.on("message", (channel, userstate, message, self) => {
            //Ignore messages sent by the bot itself.
            if (self)
                return;
    
            //Respond to chat messages.
            if (userstate["message-type"] == "action" || userstate["message-type"] == "chat") {
                var tokens = message.split(" ");
                var count = 0;
                for (var i = 0; i < tokens.length; i++) {
                    if (tokens[i] == ":kiwifruit:" || tokens[i] == "🥝")
                        count++;
                }
                var reason = `User ${userstate["username"]} has posted ${count} illegal kiwis.`;
                client.timeout(channel, userstate["username"], count, reason)
                .then(() => {
                    console.log(`Successfully timed out ${userstate["username"]} for ${count} seconds in channel ${channel}.`);
                    console.log(`Reason: ${reason}`);
                }).catch((err) => {
                    console.log(err);
                });
            }
        });
    }

    client.connect();
}

module.exports = {
    start
};