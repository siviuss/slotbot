import sealshop from '@services/sealshop.js';

export default class {
	static trigger = /^-?(тюлень|пчюлень|seal) купить \d+( \d*)?$/i;

	static async execute(ctx) {
		const args = ctx.arguments;
		args.shift(); // seal
		args.shift(); // buy

		const id = Number(args.shift());
		let amount = Number(args.shift() ?? 1);
		if (isNaN(amount) || amount < 0 || amount > 2147483647) return;

		const product = sealshop[id];
		if (product == null)
			return ctx.reply("❔ | Товар с таким номером не найден, посмотрите доступные по команде <code>-тюлень магазин</code>");
		if (product.type == "upgrade") amount = 1;
		if (product.price * amount > ctx.user.data[product.currency])
			return ctx.reply(`❌ | Вам не хватает денег для приобретения <b>${product.icon} ${product.name}</b>`);

		const message = await product.buy(ctx.user, amount);
		await ctx.reply(message);
	}
}