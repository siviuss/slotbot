import { putMarket } from '@services/gemmarket.js';

export default class {
	static trigger = /^-?гем купить \d+(\.\d+)? \d+$/i;

	static async execute(ctx) {
		const args = ctx.arguments.slice(2);

		const gems = parseFloat(args[0]);
		if (isNaN(gems) || gems < 0 || gems > 100)
			return ctx.reply("Введите корректное количество кристаллов для покупки.");
		const money = parseInt(args[1]);
		if (isNaN(money) || money < 0 || money > 1000000)
			return ctx.reply("Введите корректную цену за кристаллы.")

		const buygems = Math.floor(gems * 100) / 100;
		const pay = Math.ceil(money * 1.1);
		if (pay > ctx.user.data.money)
			return ctx.reply(`💸 У вас не хватает денег для взноса за размещения товара — 💵 <b>${pay.toLocaleString()}</b> (<i>после комиссии 10%</i>)`);
		if (buygems < 1)
			return ctx.reply(`💎 Количество кристаллов для покупки должно быть не менее 1!`);
		if (money < 250 * buygems)
			return ctx.reply(`💸 Цена за кристалл должна быть не менее 250!`);

		ctx.user.data.money -= pay;
		await ctx.user.save();
		await putMarket(ctx.user.id, buygems, money, true);

		await ctx.reply(`🛍 Вы оплатили взнос за размещение товара 💵 <b>${pay.toLocaleString()}</b> (<i>после комиссии 10%</i>) и разместили сделку в гем маркет.
💎 ${buygems} <b>→</b> 💵 ${money.toLocaleString()}
Ожидайте пока кто-нибудь соглаится совершить сделку.
🕔 Если не найдётся продавец за <b>7 дней</b> после размещения, сделка будет удалена!`);
	}
}