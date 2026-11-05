export default class {
	static trigger = /^-?баланс( @[0-9a-z_]+)?$/i;

	static async execute(ctx) {
		const args = ctx.arguments.slice(1);
		const user = await ctx.getArgumentsUserOrSelf(args);

		await ctx.reply(`Баланс ${user.mention}:
💵 ${user.data.money.toLocaleString()}`);
	}
}