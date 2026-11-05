import User from '@bot/user.js';

export default class {
	static trigger = /^-дб тстат( \d+)? \w+? \d+(\.\d+)?$/i;

	static async execute(ctx) {
		if (!ctx.user.superadmin) return;

		const args = ctx.arguments.slice(2);
		let user;
		if (args.length == 3) {
			user = await User.fromID(args.shift());
		} else {
			user = ctx.user;
		}
		if (user == null) return ctx.reply("📝 Нет информации о пользователе");
		if (user.data.upgrades.indexOf(2) == -1)
			return ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		const seal = await user.getSeal();
		const field = args.shift();
		const value = Number(args.shift());
		if (isNaN(value) || value < 0 || value > 2**31-1) return;

		seal.data[field] = value;
		await seal.save();
		await ctx.reply(`Статистика <code>${field}</code> у тюленя ${user.link} установлена на <code>${value}</code>`);
	}
}