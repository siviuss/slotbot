export default class {
	static trigger = /^-баланс$/i;

	static async execute(ctx) {
		await ctx.reply(`Баланс ${ctx.user.mention}:
💵 ${ctx.user.data.balance.toLocaleString()}`);
	}
}