import shop from '@services/shop.js';

const CURRENCY = {
	money: "💵"
};
const entry = (user, id, item) => {
	return `[ID: ${id}] ${item.tag(user)}<b>${item.icon} ${item.name}</b> - Цена: ${CURRENCY[item.currency]} ${item.price.toLocaleString()}
┗ ${item.description}`;
}

export default class {
	static trigger = /^-?магазин$/i;

	static async execute(ctx) {
		let message = [];
		for (const [ id, item ] of Object.entries(shop)) {
			message.push(entry(ctx.user, id, item));
		}

		await ctx.reply(`🛒 <b>Магазин SlotBot</b>
<code>-купить &lt;номер&gt; &lt;количество&gt;</code> чтобы купить предмет
💡 Подсказка: Номер предмета находится в скобках рядом с предметом! Например: [ID: 1] это номер 1

<blockquote expandable>${message.join("\n")}</blockquote>`);
	}
}