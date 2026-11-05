import User from '@bot/user.js';

export default class {
	static trigger = /^-ттик( \d+)?$/i;

	static async execute(ctx) {
		if (!ctx.user.superadmin) return;

		const args = ctx.arguments.slice(1);
		let user;
		if (args.length == 1) {
			user = await User.fromID(args.shift());
		} else {
			user = ctx.user;
		}
		if (user == null) return ctx.reply("📝 Нет информации о пользователе");
		if (!user.data.upgrades.includes(2))
			return ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		const seal = await user.getSeal();
		await seal.tick(ctx);
		await seal.save();
		await ctx.reply(`Состояние тюленя ${user.link} обновлено`);
	}
}