import { fetchMarket } from '@services/gemmarket.js';
import { formatTime, now } from '@services/util.js';

export default class {
	static trigger = /^-?гем( маркет)?$/i;

	static async execute(ctx) {
		const market = await fetchMarket();

// <code>-гем купить &lt;гемы&gt; &lt;цена&gt;</code> чтобы сделать ставку покупки гемов
// <code>-гем продать &lt;гемы&gt; &lt;цена&gt;</code> чтобы сделать ставку продажи гемов
		let message = `🏦 <b>Гем Маркет SlotBot</b>
<code>-гем сделка &lt;номер&gt;</code> чтобы совершить сделку купле-продажи
\n`;
		const deals = []
		for (const deal of market) {
			let text = `[ID: ${deal.id}] `;
			if (deal.buy) {
				text += `💵 ${deal.money.toLocaleString()} <b>→</b> 💎 ${Math.floor(deal.gem * 100) / 100}`;
			} else {
				text += `💎 ${Math.floor(deal.gem * 100) / 100} <b>→</b> 💵 ${deal.money.toLocaleString()}`;
			}
			text += `\n💲 <b>Курс обмена</b>: ${(deal.money / deal.gem).toLocaleString()}`;
			text += `\n🧑‍💼 <a href="tg://openmessage?user_id=${deal.user}">${deal.buy ? "Покупатель" : "Продавец"}</a>`;
			text += ` • ${formatTime(now() - deal.placed)}`;
			deals.push(text);
		}

		if (deals.length == 0) {
			message += "<i>Рынок пуст!</i>";
		} else {
			message += `<blockquote expandable><b><i>Рынок</i></b>
${deals.join("\n")}
</blockquote>`;
		}
		await ctx.reply(message);
	}
}