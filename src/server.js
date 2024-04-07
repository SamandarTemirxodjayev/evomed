const TelegramBot = require("node-telegram-bot-api");
const token = "6088914608:AAFa33ZdSB874dKxR_VtEsBv57uWhZ2hE8E";
const bot = new TelegramBot(token, {polling: true});
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const Users = require("./models/User");
const Qabul = require("./models/Qabul");

mongoose.set("strictQuery", false);
mongoose
	.connect(
		"mongodb+srv://admin:admin@cluster0.n5hzfrg.mongodb.net/evomed?retryWrites=true&w=majority&appName=Cluster0",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
	)
	.then(() => {
		console.log("Database connected");
		app.listen(process.env.PORT || 3000, () => {
			console.log("Server started on port 3000");
		});
	});

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.get("/", (req, res) => {
	res.json({message: "Hello 2"});
});

bot.onText(/\/start/, async (msg) => {
	try {
		const user = await Users.findOne({id: msg.chat.id});
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
				["📍 Lokatsiya", "💊 Xizmatlar"],
			],
		},
		parse_mode: "HTML",
	});
});
bot.on("message", async (msg) => {
	try {
		const user = await Users.findOne({id: msg.chat.id});
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
	const user = await Users.findOne({id: msg.chat.id});
	if (user && user.type == "question") {
		bot.sendMessage(msg.chat.id, "<b>Telefon raqamingizni kiriting</b>", {
			parse_mode: "HTML",
		});
		await Users.updateOne(
			{id: msg.chat.id},
			{$set: {type: "numberForQuestion", text: msg.text}},
		);
		return;
	}
	if (user && user.type == "numberForQuestion") {
		bot.sendMessage(msg.chat.id, "<b>Yetkazildi</b>", {
			parse_mode: "HTML",
			reply_markup: {
				resize_keyboard: true,
				keyboard: [
					["📃 Savol berish", "✍️ Takliflar"],
					["✍️ E'tirozlar", "📝 Qabulga yozilish"],
					["📍 Lokatsiya", "💊 Xizmatlar"],
				],
			},
		});
		bot.sendMessage(
			"-1001936206921",
			`<b>Botdan Xabar</b>
Telefon raqam: ${msg.text}
Xabar ${user.text}`,
			{parse_mode: "HTML"},
		);
		await Users.updateOne({id: msg.chat.id}, {$set: {type: "registered"}});
		return;
	}
	if (user && user.type == "taklif") {
		bot.sendMessage(msg.chat.id, "<b>Telefon raqamingizni kiriting</b>", {
			parse_mode: "HTML",
		});
		await Users.updateOne(
			{id: msg.chat.id},
			{$set: {type: "numberForQuestion", text: msg.text}},
		);
		return;
	}
	if (user && user.type == "etiroz") {
		bot.sendMessage(msg.chat.id, "<b>Telefon raqamingizni kiriting</b>", {
			parse_mode: "HTML",
		});
		await Users.updateOne(
			{id: msg.chat.id},
			{$set: {type: "numberForQuestion", text: msg.text}},
		);
		return;
	}
	if (user && user.type == "number") {
		const qabul = await Qabul.findOne({id: msg.chat.id});
		bot.sendMessage(
			"-1001936206921",
			`<b>Botdan Xabar [Qabulga yozilishdi]</b>
<b>📌 ${qabul.doctor}\n⏰ ${qabul.time}\n📅 ${qabul.date}\n👤 ${msg.from.first_name}\n📞${msg.text}</b>`,
			{parse_mode: "HTML"},
		);
		bot.sendMessage(
			msg.chat.id,
			`<b>📌 ${qabul.doctor}\n⏰ ${qabul.time}\n📅 ${qabul.date}\n👤 ${msg.from.first_name}\n📞${msg.text}\n✅ Sizni qabulga yozib qo'ydik</b>`,
			{
				parse_mode: "HTML",
				reply_markup: {
					resize_keyboard: true,
					keyboard: [
						["📃 Savol berish", "✍️ Takliflar"],
						["✍️ E'tirozlar", "📝 Qabulga yozilish"],
						["📍 Lokatsiya", "💊 Xizmatlar"],
					],
				},
			},
		);
		await Users.updateOne({id: msg.chat.id}, {$set: {type: "registered"}});
		return;
	}
	if (msg.text == "💊 Xizmatlar") {
		await bot.sendMessage(
			msg.chat.id,
			"📌 Pediatr\n📌 Nevropatolog\n📌 Ortoped\n📌 Pediatr- infeksionist\n📌 Bolalar psixologi\n📌 Massaj\n📌 Fizioterapiya\n📌 EEG\n📌 Laboratoriya\n📌 Pediatr - gastroenterolog\n📌 Otolaringolog (LOR)",
			{parse_mode: "HTML"},
		);
	}
	if (msg.text == "📍 Lokatsiya") {
		await bot.sendLocation(msg.chat.id, 41.36562948151538, 69.28898248007226);
		await bot.sendMessage(
			msg.chat.id,
			"🏥 <b>Manzil:</b> Toshkent shahar, Yunusobod Tumani, Axmad Donish ko'chasi 47a\n📞 <b>Telefon:</b> +998555003200",
			{parse_mode: "HTML"},
		);
	}
	if (msg.text == "📃 Savol berish") {
		try {
			await Users.updateOne({id: msg.chat.id}, {$set: {type: "question"}});
			bot.sendMessage(msg.chat.id, `<b>📃 Savolingizni yo'llang</b>`, {
				parse_mode: "HTML",
				reply_markup: {remove_keyboard: true},
			});
		} catch (error) {
			console.log(error);
		}
	}
	if (msg.text == "✍️ Takliflar") {
		try {
			await Users.updateOne({id: msg.chat.id}, {$set: {type: "taklif"}});
			bot.sendMessage(msg.chat.id, `<b>✍️ Taklifingizni yozib jo'nating</b>`, {
				parse_mode: "HTML",
				reply_markup: {remove_keyboard: true},
			});
		} catch (error) {
			console.log(error);
		}
	}
	if (msg.text == "✍️ E'tirozlar") {
		try {
			await Users.updateOne({id: msg.chat.id}, {$set: {type: "etiroz"}});
			bot.sendMessage(msg.chat.id, `<b>✍️ E'tirozingizni yozib jo'nating</b>`, {
				parse_mode: "HTML",
				reply_markup: {remove_keyboard: true},
			});
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
								text: "📌 Pediatr- infeksionist",
								callback_data: "qabul||Pediatr- infeksionist",
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
						[
							{
								text: "📌 Pediatr - gastroenterolog",
								callback_data: "qabul||Pediatr - gastroenterolog",
							},
						],
						[
							{
								text: "📌 Otolaringolog (LOR)",
								callback_data: "qabul||Otolaringolog (LOR)",
							},
						],
					],
				},
			},
		);
	}
});
bot.on("callback_query", async (callbackQuery) => {
	function stripos(haystack, needle) {
		const lowerHaystack = haystack.toLowerCase();
		const lowerNeedle = needle.toLowerCase();
		return lowerHaystack.indexOf(lowerNeedle);
	}
	if (stripos(callbackQuery.data, "qabul||") == 0) {
		const {message} = callbackQuery;
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
			},
		);
	}
	if (stripos(callbackQuery.data, "time||") == 0) {
		const {message} = callbackQuery;
		const type = callbackQuery.data.split("||");
		const currentDate = new Date();
		const formatDate = (date) => {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");
			return `${day}-${month}-${year}`;
		};

		const daysInWeek = 7;
		const dates = [];
		for (let i = 0; i < daysInWeek; i++) {
			const date = new Date();
			date.setDate(currentDate.getDate() + i);
			const formattedDate = formatDate(date);
			dates.push(formattedDate);
		}

		const replyMarkup = {
			inline_keyboard: dates.map((date) => [
				{
					text: `${date}`,
					callback_data: `day||${date}||${type[1]}||${type[2]}`,
				},
			]),
		};

		bot.editMessageText(
			`<b>📌 ${type[2]}\n⏰ ${type[1]}\n📅 Bormoqchi bo'lgan kuningizni tanglang</b>`,
			{
				chat_id: message.chat.id,
				message_id: message.message_id,
				parse_mode: "HTML",
				reply_markup: replyMarkup,
			},
		);
	}
	if (stripos(callbackQuery.data, "day||") == 0) {
		const {message} = callbackQuery;
		const type = callbackQuery.data.split("||");
		try {
			await Users.updateOne({id: message.chat.id}, {$set: {type: "number"}});
			const newUser = new Qabul({
				id: message.chat.id,
				doctor: type[3],
				time: type[2],
				date: type[1],
			});
			await newUser.save();
			bot.editMessageText(
				`<b>📌 ${type[3]}\n⏰ ${type[2]}\n📅 ${type[1]}\n📞 Siz bilan bog'lanish uchun telefon raqamingizni kiriting</b>`,
				{
					chat_id: message.chat.id,
					message_id: message.message_id,
					parse_mode: "HTML",
				},
			);
		} catch (error) {
			console.log(error);
		}

		//
	}
});
