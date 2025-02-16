require('dotenv').config();
const { App } = require('@slack/bolt');

// Initialize Slack app
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Event: When a user joins the workspace
app.event('team_join', async ({ event, client }) => {
    try {
        await client.chat.postMessage({
            channel: event.user.id,
            text: "Welcome! Do you like Cats or Dogs?",
            attachments: [
                {
                    text: "Choose one:",
                    fallback: "You can't pick!",
                    callback_id: "cat_or_dog",
                    actions: [
                        { type: "button", text: "🐱 Cats", value: "cats" },
                        { type: "button", text: "🐶 Dogs", value: "dogs" }
                    ]
                }
            ]
        });
    } catch (error) {
        console.error(error);
    }
});

// Handle button responses
app.action(/cat_or_dog/, async ({ body, ack, say }) => {
    await ack();
    const userName = body.user.name;
    const choice = body.actions[0].value;
    say(`Thanks, ${userName}! You chose ${choice}!`);
});

// Start the bot
(async () => {
    await app.start(process.env.PORT || 3000);
    console.log('Slack bot is running...');
})();
