import sealshop from '@services/sealshop.js';

export default class {
	static trigger = /^-?(тюлень|пчюлень|seal) продать \d+( \d*)?$/i;

	static async execute(ctx) {
		const args = ctx.arguments;
		args.shift(); // seal
		args.shift(); // sell

		const id = parseInt(args[0]);
		const quantity = args[1] ? parseInt(args[1]) : 1;
		if (isNaN(id) || id < 1 || id > Number.MAX_SAFE_INTEGER)
			return ctx.reply("Введите корректный номер предмета");
		if (isNaN(quantity) || quantity < 1 || quantity > Number.MAX_SAFE_INTEGER)
			return ctx.reply("Введите корректное количество предмета");

		const item = sealshop[id];
		if (item == null)
			return ctx.reply("Введите корректный номер предмета");

		if (item.sell != null) {
			await ctx.reply(await item.sell(ctx.user, quantity));
		} else {
			await ctx.reply("❌ | Вы не можете продать данный предмет!");
		}
	}
}