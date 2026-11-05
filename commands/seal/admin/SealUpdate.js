export default class {
	static trigger = /^-ттик /i;

	static async execute(ctx) {
		if (!ctx.user.superadmin) return;
		const args = ctx.arguments.slice(1);
		const user = await ctx.getArgumentsUserOrSelf(args);
		if (!user.data.upgrades.includes(2))
			return ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		const seal = await ctx.user.getSeal();
		await seal.tick(ctx);
		await seal.save();
		await ctx.reply(`Состояние тюленя обновлёно`);
	}
}