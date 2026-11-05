import User from '@bot/user.js';
import { sanitize } from '@services/util.js';

export default class {
	static trigger = /^-дб тстат( \d+)?$/i;

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
		if (user.data.upgrades.indexOf(2) == -1)
			return ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		const seal = await user.getSeal();
		await ctx.reply(`Тюлень ${user.link}:
${Object.entries(seal.data).map(e => `<code>${sanitize(e[0])}</code> = <code>${sanitize(JSON.stringify(e[1]))}</code>`).join("\n")}`);
	}
}