import { fetchMarket, removeMarket } from '@services/gemmarket.js';
import User from '@bot/user.js';

export default class {
	static trigger = /^-?гем сделка \d+$/i;

	static async execute(ctx) {
		const market = await fetchMarket();
		const args = ctx.arguments;
		args.shift();
		args.shift();

		const dealid = parseInt(args.shift());
		if (isNaN(dealid) || dealid < 1 || dealid > 999999)
			return ctx.reply("Введите корректный номер сделки.");

		const deal = market.find(k => k.id == dealid);
		if (deal == null)
			return ctx.reply("❓ Сделка с таким номером не найдена.");
		if (deal.user == ctx.user.id)
			return ctx.reply("❌ Вы не можете совершить сделку с самим собой.");

		const dealer = await User.fromID(deal.user);

		if (deal.buy) { // dealer buys from caller
			if (ctx.user.data.gem < deal.gem)
				return ctx.reply("💎 У вас не хватает кристаллов для продажи!");
		} else { // dealer sells to caller
			if (ctx.user.data.money < deal.money)
				return ctx.reply("💸 У вас не хватает денег для покупки!");
		}

		// fix: check if delete did anything, to mitigate two players completing the same trade at once
		const fulfilled = await removeMarket(dealid);
		if (fulfilled.length == 0)
			return ctx.reply("❌ Ошибка: Сделка уже совершена");

		if (deal.buy) { // dealer buys from caller
			dealer.data.gem += deal.gem;
			// dont charge dealer for money, it was already done in GemBuyCommand
			ctx.user.data.money += deal.money;
			ctx.user.data.gem -= deal.gem;
			await ctx.user.save();
			await dealer.save();
			await ctx.reply(`✅ Вы успешно продали 💎 ${deal.gem} за 💵 ${deal.money.toLocaleString()}`);
		} else {  // dealer sells to caller
			//dealer.data.gem -= deal.gem;
			dealer.data.money += Math.floor(deal.money / 1.1);
			ctx.user.data.gem += deal.gem;
			ctx.user.data.money -= deal.money;
			await ctx.user.save();
			await dealer.save();
			await ctx.reply(`✅ Вы успешно купили 💎 ${deal.gem} за 💵 ${deal.money.toLocaleString()}`);
		}
	}
}