const TelegramBot = require("node-telegram-bot-api");
const token = "6045051520:AAF_t_ugDUnnID4afgFoDUnrfaJeNtE70RQ";
const bot = new TelegramBot(token, { polling: true });
const mongoose = require("mongoose");
const Users = require("./models/User");

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.lcxwgc2.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Database connected");
    bot.onText(/\/start/, async (msg) => {
      try {
        const user = await Users.findOne({ id: msg.chat.id });
        if (!user) {
          const newUser = new Users({
            id: msg.chat.id,
            type: "register",
          });
          await newUser.save();
          console.log("User registered");
        }
      } catch (error) {
        console.error("Error:", error);
      }
      bot.sendMessage(msg.chat.id, "👩‍⚕️ <b>EVOMED</b> ga xush kelibsiz 🎉", {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            ["📃 Savol berish", "✍️ Takliflar"],
            ["✍️ E'tirozlar", "📝 Qabulga yozilish"],
            ["📍 Lokatsiya"],
          ],
        },
        parse_mode: "HTML",
      });
    });
    bot.on("message", async (msg) => {
      const user = await Users.findOne({ id: msg.chat.id });
      if (user.type == "question") {
        bot.sendMessage(msg.chat.id, "<b>Savolingiz yetkazildi</b>", {
          parse_mode: "HTML",
          reply_markup: {
            resize_keyboard: true,
            keyboard: [
              ["📃 Savol berish", "✍️ Takliflar"],
              ["✍️ E'tirozlar", "📝 Qabulga yozilish"],
              ["📍 Lokatsiya"],
            ],
          },
        });
        bot.sendMessage(
          "-1001936206921",
          `<b>Botdan Xabar [Savol berishdi]</b>
          ${msg.text}`,
          { parse_mode: "HTML" }
        );
        await Users.updateOne(
          { id: msg.chat.id },
          { $set: { type: "registered" } }
        );
        return;
      }
      if (user.type == "taklif") {
        bot.sendMessage(msg.chat.id, "<b>Taklifingiz yetkazildi</b>", {
          parse_mode: "HTML",
          reply_markup: {
            resize_keyboard: true,
            keyboard: [
              ["📃 Savol berish", "✍️ Takliflar"],
              ["✍️ E'tirozlar", "📝 Qabulga yozilish"],
              ["📍 Lokatsiya"],
            ],
          },
        });
        bot.sendMessage(
          "-1001936206921",
          `<b>Botdan Xabar [Taklif berishdi]</b>
          ${msg.text}`,
          { parse_mode: "HTML" }
        );
        await Users.updateOne(
          { id: msg.chat.id },
          { $set: { type: "registered" } }
        );
        return;
      }
      if (user.type == "etiroz") {
        bot.sendMessage(msg.chat.id, "<b>E'tirozingiz yetkazildi</b>", {
          parse_mode: "HTML",
          reply_markup: {
            resize_keyboard: true,
            keyboard: [
              ["📃 Savol berish", "✍️ Takliflar"],
              ["✍️ E'tirozlar", "📝 Qabulga yozilish"],
              ["📍 Lokatsiya"],
            ],
          },
        });
        bot.sendMessage(
          "-1001936206921",
          `<b>Botdan Xabar [E'tiroz bildirishdi]</b>
          ${msg.text}`,
          { parse_mode: "HTML" }
        );
        await Users.updateOne(
          { id: msg.chat.id },
          { $set: { type: "registered" } }
        );
        return;
      }
      if (msg.text == "📍 Lokatsiya") {
        await bot.sendLocation(msg.chat.id, 41.36562948151538, 69.28898248007226);
        await bot.sendMessage(
          msg.chat.id,
          "🏥 <b>Manzil:</b> Toshkent shahar, Yunusobod Tumani, Axmad Donish ko'chasi 47a\n📞 <b>Telefon:</b> +998 55 500 3200",
          { parse_mode: "HTML" }
        );
      }
      if (msg.text == "📃 Savol berish") {
        try {
          await Users.updateOne(
            { id: msg.chat.id },
            { $set: { type: "question" } }
          );
          bot.sendMessage(msg.chat.id, `<b>📃 Savolingizni yo'llang</b>`, {
            parse_mode: "HTML",
            reply_markup: { remove_keyboard: true },
          });
        } catch (error) {
          console.log(error);
        }
      }
      if (msg.text == "✍️ Takliflar") {
        try {
          await Users.updateOne(
            { id: msg.chat.id },
            { $set: { type: "taklif" } }
          );
          bot.sendMessage(
            msg.chat.id,
            `<b>✍️ Taklifingizni yozib jo'nating</b>`,
            {
              parse_mode: "HTML",
              reply_markup: { remove_keyboard: true },
            }
          );
        } catch (error) {
          console.log(error);
        }
      }
      if (msg.text == "✍️ E'tirozlar") {
        try {
          await Users.updateOne(
            { id: msg.chat.id },
            { $set: { type: "etiroz" } }
          );
          bot.sendMessage(
            msg.chat.id,
            `<b>✍️ E'tirozingizni yozib jo'nating</b>`,
            {
              parse_mode: "HTML",
              reply_markup: { remove_keyboard: true },
            }
          );
        } catch (error) {
          console.log(error);
        }
      }
      if (msg.text == "📝 Qabulga yozilish") {
        bot.sendMessage(
          msg.chat.id,
          `<b>Qabulga yozilmoqchi bo'lgan shifokoringizni tanglang</b>`,
          {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "📌 Pediatr",
                    callback_data: "qabul||Pediatr",
                  },
                ],
                [
                  {
                    text: "📌 Nevropatolog",
                    callback_data: "qabul||Nevropatolog",
                  },
                ],
                [
                  {
                    text: "📌 Ortoped",
                    callback_data: "qabul||Ortoped",
                  },
                ],
                [
                  {
                    text: "📌 Logoped",
                    callback_data: "qabul||Logoped",
                  },
                ],
                [
                  {
                    text: "📌 Bolalar psixologi",
                    callback_data: "qabul||Bolalar psixologi",
                  },
                ],
                [
                  {
                    text: "📌 Massaj",
                    callback_data: "qabul||Massaj",
                  },
                ],
                [
                  {
                    text: "📌 Fizioterapiya",
                    callback_data: "qabul||Fizioterapiya",
                  },
                ],
                [
                  {
                    text: "📌 EEG",
                    callback_data: "qabul||EEG",
                  },
                ],
                [
                  {
                    text: "📌 Laboratoriya",
                    callback_data: "qabul||Laboratoriya",
                  },
                ],
              ],
            },
          }
        );
      }
    });
    bot.on("callback_query", (callbackQuery) => {
      function stripos(haystack, needle) {
        const lowerHaystack = haystack.toLowerCase();
        const lowerNeedle = needle.toLowerCase();
        return lowerHaystack.indexOf(lowerNeedle);
      }
      if (stripos(callbackQuery.data, "qabul||") == 0) {
        const { message } = callbackQuery;
        const type = callbackQuery.data.split("qabul||");
        bot.editMessageText(
          `<b>📌 ${type[1]}\n⏰ Bormoqchi bo'lgan vaqtingizni tanglang</b>`,
          {
            chat_id: message.chat.id,
            message_id: message.message_id,
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "12:00",
                    callback_data: `time||12:00||${type[1]}`,
                  },
                  {
                    text: "13:00",
                    callback_data: `time||13:00||${type[1]}`,
                  },
                  {
                    text: "14:00",
                    callback_data: `time||14:00||${type[1]}`,
                  },
                ],
                [
                  {
                    text: "15:00",
                    callback_data: `time||15:00||${type[1]}`,
                  },
                  {
                    text: "16:00",
                    callback_data: `time||16:00||${type[1]}`,
                  },
                  {
                    text: "17:00",
                    callback_data: `time||17:00||${type[1]}`,
                  },
                ],
                [
                  {
                    text: "18:00",
                    callback_data: `time||18:00||${type[1]}`,
                  },
                  {
                    text: "19:00",
                    callback_data: `time||19:00||${type[1]}`,
                  },
                  {
                    text: "20:00",
                    callback_data: `time||20:00||${type[1]}`,
                  },
                ],
                [
                  {
                    text: "21:00",
                    callback_data: `time||21:00||${type[1]}`,
                  },
                  {
                    text: "22:00",
                    callback_data: `time||22:00||${type[1]}`,
                  },
                  {
                    text: "23:00",
                    callback_data: `time||23:00||${type[1]}`,
                  },
                ],
                [
                  {
                    text: "00:00",
                    callback_data: `time||00:00||${type[1]}`,
                  },
                  {
                    text: "01:00",
                    callback_data: `time||01:00||${type[1]}`,
                  },
                  {
                    text: "02:00",
                    callback_data: `time||02:00||${type[1]}`,
                  },
                ],
                [
                  {
                    text: "03:00",
                    callback_data: `time||03:00||${type[1]}`,
                  },
                  {
                    text: "04:00",
                    callback_data: `time||04:00||${type[1]}`,
                  },
                  {
                    text: "05:00",
                    callback_data: `time||05:00||${type[1]}`,
                  },
                ],
                [
                  {
                    text: "06:00",
                    callback_data: `time||06:00||${type[1]}`,
                  },
                  {
                    text: "07:00",
                    callback_data: `time||07:00||${type[1]}`,
                  },
                  {
                    text: "08:00",
                    callback_data: `time||08:00||${type[1]}`,
                  },
                ],
                [
                  {
                    text: "09:00",
                    callback_data: `time||09:00||${type[1]}`,
                  },
                  {
                    text: "10:00",
                    callback_data: `time||10:00||${type[1]}`,
                  },
                  {
                    text: "11:00",
                    callback_data: `time||11:00||${type[1]}`,
                  },
                ],
              ],
            },
          }
        );
      }
      if (stripos(callbackQuery.data, "time||") == 0) {
        const { message } = callbackQuery;
        const type = callbackQuery.data.split("||");
        const currentDate = new Date();
        const tomorrowDate = new Date();
        tomorrowDate.setDate(currentDate.getDate() + 1);
        const afterTomorrowDate = new Date();
        afterTomorrowDate.setDate(currentDate.getDate() + 2);
        const formatDate = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${day}-${month}-${year}`;
        };
        const currentDateString = formatDate(currentDate);
        const tomorrowDateString = formatDate(tomorrowDate);
        const afterTomorrowDateString = formatDate(afterTomorrowDate);
        bot.editMessageText(
          `<b>📌 ${type[2]}\n⏰ ${type[1]}\n📅 Bormoqchi bo'lgan kuningizni tanglang</b>`,
          {
            chat_id: message.chat.id,
            message_id: message.message_id,
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: `${currentDateString}`,
                    callback_data: `day||${currentDateString}||${type[1]}||${type[2]}`,
                  },
                ],
                [
                  {
                    text: `${tomorrowDateString}`,
                    callback_data: `day||${tomorrowDateString}||${type[1]}||${type[2]}`,
                  },
                ],
                [
                  {
                    text: `${afterTomorrowDateString}`,
                    callback_data: `day||${afterTomorrowDateString}||${type[1]}||${type[2]}`,
                  },
                ],
              ],
            },
          }
        );
      }
      if (stripos(callbackQuery.data, "day||") == 0) {
        const { message } = callbackQuery;
        const type = callbackQuery.data.split("||");
        bot.editMessageText(
          `<b>📌 ${type[3]}\n⏰ ${type[2]}\n📅 ${type[1]}\n✅ Sizni qabulga yozib qoydik</b>`,
          {
            chat_id: message.chat.id,
            message_id: message.message_id,
            parse_mode: "HTML",
          }
        );
        bot.sendMessage(
          "-1001936206921",
          `<b>Botdan Xabar [Qabulga yozilishdi]</b>
  <b>📌 ${type[3]}\n⏰ ${type[2]}\n📅 ${type[1]}\n👤 ${callbackQuery.from.first_name}</b>`,
          { parse_mode: "HTML" }
        );
      }
    });
  });
