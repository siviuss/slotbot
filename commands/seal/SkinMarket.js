import SealSkins from '../../data/SealSkins.json';

function marketMap(seal, skin) {
	let item = `[ID: ${skin.id}] `;
	if (seal.data.skins.indexOf(skin.id) != -1)
		item += "✅";
	item += `<b>${skin.name}</b>`;
	if (skin.price != null)
		item += `  —  Цена: 💎 ${Math.floor(skin.price * 100) / 100}`;
	return item;
}

export default class {
	static trigger = /^-?(скин )?маркет$/i;

	static async execute(ctx) {
		if (!ctx.user.data.upgrades.includes(2))
			return await ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		const seal = await ctx.user.getSeal();
		const market = SealSkins.filter(k => k.price != null || seal.data.skins.indexOf(k.id) != -1)
			.map(k => marketMap(seal, k));

		await ctx.reply(`🛍 <b>Маркет скинов тюленя</b>
<code>-скин купить &lt;номер&gt;</code> чтобы купить скин
💡 Подсказка: Номер скина находится в скобках рядом со скином! Например: [ID: 1] это номер 1
\n${market.join("\n")}`);
	}
}