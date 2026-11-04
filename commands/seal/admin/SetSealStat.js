export default class {
	static trigger = /^-тстат /i;

	static async execute(ctx) {
		if (!ctx.user.superadmin) return;
		const args = ctx.arguments.slice(1);
		const user = await ctx.getArgumentsUserOrSelf(args);
		if (user.data.upgrades.indexOf(2) == -1)
			return ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		const seal = await user.getSeal();

		const k = args.shift();
		const n = parseInt(args.shift());
		if (isNaN(n) || n < 0 || n > 2**31-1) return;

		seal.data[k] = n;
		await seal.save();

		await ctx.reply(`Статистика <code>${k}</code> у тюленя установлена на <code>${n}</code>`);
	}
}