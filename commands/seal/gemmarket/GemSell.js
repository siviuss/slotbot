import { putMarket } from '@services/gemmarket.js';

export default class {
	static trigger = /^-?гем продать \d+(\.\d+)? \d+$/i;

	static async execute(ctx) {
		const args = ctx.arguments;
		args.shift();
		args.shift();

		const gems = parseFloat(args.shift());
		if (isNaN(gems) || gems < 0 || gems > 100)
			return ctx.reply("Введите корректное количество кристаллов для продажи.");
		const money = parseInt(args.shift());
		if (isNaN(money) || money < 0 || money > 1000000)
			return ctx.reply("Введите корректную цену за кристаллы.")

		const sellgems = Math.floor(gems * 100) / 100;
		if (sellgems > ctx.user.data.gem)
			return ctx.reply(`💎 | У вас не хватает кристаллов для продажи!`);
		if (sellgems < 1)
			return ctx.reply(`💎 | Количество кристаллов для покупки должно быть не менее 1!`);

		ctx.user.data.gem -= sellgems;
		await ctx.user.save();
		await putMarket(ctx.user.id, sellgems, money, false);

		await ctx.reply(`🛍 Вы разместили кристаллы на продажу в гем маркет.
💶 ${money.toLocaleString()} <b>→</b> 💎 ${sellgems}
Ожидайте пока кто-нибудь соглаится совершить сделку (после продажи будет оплачена комиссия 10%).
🕔 Если не найдётся покупатель за <b>7 дней</b> после размещения, сделка будет удалена!`);
	}
}