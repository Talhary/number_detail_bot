const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

require("dotenv").config();
const data = require("./script");
const app = express();

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(botToken, { polling: true });
const port = process.env.PORT || 3000;

app.use(express.json());
app.get("/", (req, res) => {
  res.send("hi");
});
const channelId = "-1001862686008";

async function getUserVerified(channelId, userId, key) {
  try {
    const user = await bot.getChatMember(channelId, userId);
    console.log(user.status);
    if (user.status == "member" || user.status == "creator") {
      const getUserId = await getUserIdCheck(userId);

      console.log(getUserId, "userid");
      if (!getUserId) {
        const acceptReply = await bot.sendMessage(
          userId,
          "Bot owner has nothing to do with this use at you own risk. \nBot save some of your data.\n\n click /allow to allow.",
          { reply_markup: { force_reply: true } }
        );
        await bot.onReplyToMessage(
          userId,
          acceptReply.message_id,
          async (msgReply) => {
            if (msgReply.text == "/allow") {
              if (key) {
                bot.sendMessage(
                  userId,
                  `\n\n\n Send your number like 033xxxxxxx \n\n\n------------`
                );
              }
              await getUserIdSaved(userId);
              return true;
            } else {
              if (!key) return false;
              return false;
            }
          }
        );
      } else if (user.status == "member" || user.status == "creator") {
        if (key) {
          bot.sendMessage(
            userId,
            `\n\n\n Send your number like 033xxxxxxx \n\n\n--------------`
          );
        }
        return true;
      }
    } else {
      joinChannel(userId);
      return false;
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function joinChannel(chatId) {
  const options = {
    reply_markup: {
      inline_keyboard: [[{ text: "Joined", callback_data: `3` }]],
    },
  };

  await bot.sendMessage(
    chatId,
    "Please Join the channel first:@TalhaRiazC",
    options
  );
}
const commands = [
  { command: "/start", description: "Start the bot" },

  // Add more commands as needed
];
bot.setMyCommands(commands);

bot.on("message", async (msg) => {
  try {
    console.log(msg);
    if (msg.text == "/delete") {
      const res = await deleteUserId(msg.chat.id);
      if (res) return bot.sendMessage(msg.chat.id, "Deleted id");
    }
    if (msg.text.startsWith("03")) {
      const number = msg.text;
      if (number.length > 11 || number.length < 11)
        return bot.sendMessage(msg.chat.id, "Please write correct number");
      let res;
      try {
        res = await data(number);
        console.log(res);
      } catch (error) {
        bot.sendMessage(msg.chat.id, "Error");
        return bot.sendMessage(msg.chat.id, error.message);
      }
      for (let i = 0; i < res.length; i++) {
        let el = res[i];
        bot.sendMessage(
          msg.chat.id,
          el.fullName +
            "\n \n" +
            el.phoneNumber +
            "\n\n" +
            el.cnicNumber +
            "\n\n" +
            el.address
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
});

bot.onText(/\/start/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    await getUserVerified(channelId, msg.from.id, true);
  } catch (error) {
    console.log(error);
  }
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const buttonClicked = query.data.split("_")[0];

  if (!chatId) return;

  if (buttonClicked == "3") {
    await getUserVerified(channelId, chatId, true);
  }
});
const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`port is listening ${port}...`);
    });
  } catch (err) {
    console.log(err);
  }
};
start();
