import sealshop from '@services/sealshop.js';

const CURRENCY = {
	coins: "🪙",
	money: "💶",
	gpills: "💊"
};

function shopgen(user) {
	let text = "";
	for (const [ id, entry ] of Object.entries(sealshop)) {
		const currency = CURRENCY[entry.currency];
		const price = entry.price.toLocaleString();
		const mark = entry.tag(user);

		text += `[ID: ${id}] ${mark}<b>${entry.icon} ${entry.name}</b> - Цена: ${currency} ${price}\n`;
		text += `┗ ${entry.description}\n`;
	}
	return `🛒 | <b>Магазин для тюленей</b>
<code>-тюлень купить &lt;номер&gt; &lt;количество&gt;</code> чтобы купить предмет
<code>-тюлень продать &lt;номер&gt; &lt;количество&gt;</code> чтобы продать предмет за полцены
💡 Подсказка: Номер предмета находится в скобках рядом с предметом! Например: [ID: 1] это номер 1

<blockquote expandable><b><i>Магазин</i></b>
${text}
</blockquote>`;
}

export default class {
	static trigger = /^-?((тюлень|пчюлень|seal) магаз(ин)?)|(магаз(ин)? тюленей)$/i;

	static async execute(ctx) {
		await ctx.reply(shopgen(ctx.user));
	}
}