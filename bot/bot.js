import { readdir } from "bun:fs/promises";
import { join, extname } from "bun:path";
import { fileURLToPath } from "bun:url";

import TelegramBot from '@lib/telegram.js';
import { sanitize, now } from '@services/util.js';
import { getValue } from '@services/localstorage.js';
import db from '@services/database.js';
import config from '@config';
import Context from './context.js';
import { onMessage } from '@bot/events/Message.js';
import { onCallbackQuery, bindCallbackQuery } from '@bot/events/CallbackQuery.js';

async function importAllFromDir(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const modules = [];

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);

		if (entry.isDirectory()) {
			const nested = await importAllFromDir(fullPath);
			for (const command of nested) modules.push(command);
		} else if (entry.isFile() && entry.name.endsWith(".js")) {
			const command = await import(fullPath);
			modules.push(command.default);
		}
	}

	return modules;
}

const path = join(fileURLToPath(new URL(".", import.meta.url)), "../commands");
const commands = await importAllFromDir(path);
console.log(`Loaded ${commands.length} commands`);


// start bot
const bot = new TelegramBot({
	token: config.telegram.token
});
bot.start();


// command handling
bot.on("message", async (message) => {
	if (message.from.id == 777000) return;
	if (message.from.is_bot) return; // group anonymous bot or something else
	if (message.text == null) return;
	if (message.date + 60 < now()) return; // if bot experienced downtime

	if (config.disallowedchats.includes(message.chat.id))
		return;
		
	let context;
	try {
		context = new Context(bot, message);
		await context.getUser();
	} catch (e) {
		console.error(`Failed to create context:`);
		console.error(e);
		return;
	}

	if (getValue("maintenance") && !context.superadmin) return;

	for (const command of commands) {
		if (!message.text.match(command.trigger)) continue;
		// protected commands are unable to be executed if the message is not explicitly sent by the user (e.g. not scheduled)
		if (message.is_from_offline && command.is_protected) continue;

		try {
			await command.execute(context);
		} catch (e) {
			console.error(e);
			if (command.is_silent) continue; // for example: chat events, chat rp commands
			await context.reply("При выполнении данной команды произошла ошибка.");
		}
	}
});

bot.on("message", onMessage);
bot.on("callback_query", onCallbackQuery);
bindCallbackQuery(async (query) => {
	if (query.data == "disabled") {
		bot._request("answerCallbackQuery", {
			callback_query_id: query.id
		});
	}
});

export default bot;