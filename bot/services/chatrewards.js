import bot from '@bot/bot.js';
import User from '@bot/User.js';
import { link } from '@services/util.js';
import config from '@config';

let messages = {};
let users = {};

export function countMessage(author) {
	messages[author.id] = (messages[author.id] ?? 0) + 1;
	users[author.id] = author;
}

export async function giveRewards() {
	let text = "<tg-emoji emoji-id=\"5325547803936572038\">✨</tg-emoji> <b>Награды за актив</b> <tg-emoji emoji-id=\"5325547803936572038\">✨</tg-emoji>";
	text += "\nС 12:00 до 18:00 по МСК"; // TODO: use some date api to detect if it's 12 or 18
	text += "\n";

	const lb = Object.entries(messages).sort((a, b) => b[1] - a[1]);
	const lim = Math.min(5, lb.length);
	for (let i = 0; i < lim; i++) {
		const [ id, messages ] = lb[i];
		const reward = Math.floor(Math.random() * 20) + 40;
		const tguser = users[id];
		const userLink = link({
			username: tguser.username,
			nickname: tguser.first_name,
			telegramid: tguser.id
		});
		text += `\n${userLink} (${messages} сообщений) • <b>${reward}<tg-emoji emoji-id="5807936604815235662">🤩</tg-emoji></b>`;

		const user = await User.fromID(id);
		user.coins += reward;
		await user.save();
	}

	bot.sendMessage(config.chat, text, {
		parse_mode: "HTML",
		link_preview_options: {is_disabled: true},
	});
	messages = {};
	users = {};
}

if (config.chatRewards.enabled == true) {
	Bun.cron(config.chatRewards.cron, giveRewards);
}