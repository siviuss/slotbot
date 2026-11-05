import shop from '@services/shop.js';

export default class {
	static trigger = /^-?купить \d+( \d+)?$/i;

	static async execute(ctx) {
		const args = ctx.arguments.slice(1);
		const id = Number(args.shift());
		let amount = Number(args.shift() ?? 1);
		if (isNaN(amount) || amount < 0 || amount > 2147483647) return;
		
		const product = shop[id];
		if (product == null)
			return ctx.reply("❔ Товар с таким номером не найден, посмотрите доступные по команде <code>-магазин</code>");
		if (product.type == "upgrade") amount = 1;
		if (product.price * amount > ctx.user[product.currency])
			return ctx.reply(`❌ Вам не хватает денег для приобретения <b>${product.icon} ${product.name}</b>`);

		const message = await product.buy(ctx.user, amount);
		await ctx.reply(message);
	}
}