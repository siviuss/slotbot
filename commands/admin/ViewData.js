import User from '@bot/user.js';
import { sanitize } from '@services/util.js';

export default class {
	static trigger = /^-дб стат( \d+)?$/i;
	static requires_user = true;

	static async execute(ctx) {
		if (!ctx.user.superadmin) return;

		const args = ctx.arguments.slice(2);
		let user;
		if (args.length == 1) {
			user = await User.fromID(args.shift());
		} else {
			user = ctx.user;
		}

		if (user == null) return ctx.reply("📝 Нет информации о пользователе");

		await ctx.reply(`Данные ${user.link}:
${Object.entries(user.data).map(e => `<code>${sanitize(e[0])}</code> = <code>${sanitize(JSON.stringify(e[1]))}</code>`).join("\n")}`);
	}
}