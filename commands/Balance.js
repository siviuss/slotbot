export default class {
	static trigger = /^-баланс$/i;

	static async execute(ctx) {
		console.log(await ctx.reply(`${ctx.user.data.money}`));
	}
}