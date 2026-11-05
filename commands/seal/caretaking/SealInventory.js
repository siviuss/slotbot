export default class {
	static trigger = /^-?(тюлень|пчюлень|seal)?( )?инвентарь$/i;

	static async execute(ctx) {
		if (!ctx.user.data.upgrades.includes(2))
			return ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		const seal = await ctx.user.getSeal();
		await seal.tick(ctx);
		
		await ctx.reply(`[${seal.data.level}] ${seal.name} ${ctx.user.mention}

<blockquote expandable><b><i>Инвентарь</i></b>
<b>Драгоценности</b>
💎 Кристаллы | ${ctx.user.data.gem.toLocaleString()}
⚙️ Металл | ${ctx.user.data.metal.toLocaleString()}
🌕 Ценный металл | ${ctx.user.data.raremetal.toLocaleString()}

<b>Добыча</b>
🐟 Рыба | ${seal.data.fish.toLocaleString()}
🐠 Тропическая Рыба | ${seal.data.tfish.toLocaleString()}
🐬 Дельфин | ${seal.data.dfish.toLocaleString()}
🦈 Акула | ${seal.data.sfish.toLocaleString()}

<b>Другая Еда</b>
🥤 Вода | ${seal.data.water.toLocaleString()}
🍺 Пиво | ${ctx.user.data.beer.toLocaleString()}
🍵 Энергетик | ${seal.data.ienergy.toLocaleString()}
☕ Кофе | ${seal.data.coffee.toLocaleString()}
🧪 Медицина | ${seal.data.medicine.toLocaleString()}
💊 Таблетки | ${ctx.user.data.gpills.toLocaleString()}
</blockquote>`);
	}
}