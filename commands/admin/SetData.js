import User from '@bot/user.js';

export default class {
	static trigger = /^-дб стат( \d+)? \w+? \d+(\.\d+)?$/i;
	static requires_user = true;

	static async execute(ctx) {
		if (!ctx.user.superadmin) return;

		const args = ctx.arguments.slice(2);
		let user;
		if (args.length == 3) {
			user = await User.fromID(args.shift());
		} else {
			user = ctx.user;
		}
		const field = args.shift();
		const value = Number(args.shift());

		if (user == null) return ctx.reply("📝 Нет информации о пользователе");

		user.data[field] = value;
		await user.save();
		await ctx.reply(`Значение <code>${field}</code> установлено на <code>${value}</code> у пользователя <code>${user.link}</code>`);
	}
}