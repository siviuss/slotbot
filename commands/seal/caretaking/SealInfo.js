export default class {
	static trigger = /^(-|мой )?(тюлень|пчюлень|seal)$/i;

	static async execute(ctx) {
		const user = ctx.user;
		if (!user.upgrades.includes(2))
			return ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		const seal = await user.getSeal();
		await seal.tick(ctx);
		
		await ctx.reply(`[${seal.data.level}] ${seal.name} ${user.mention}

<b>Состояние</b>
🌯 Голод • <b>${Math.floor(seal.hunger)}/100</b>
💧 Жажда • <b>${Math.floor(seal.thirst)}/100</b>
🔋 Энергия • <b>${Math.floor(seal.energy)}/100</b>
❤️ Здоровье • <b>${Math.floor(seal.health)}/1000</b>

<b>Статистика</b>
☄️ Опыт • <b>${Math.floor(seal.data.experience).toLocaleString()}/${seal.levelXP.toLocaleString()}</b>
🍥 Кредиты • <b>${seal.data.credits.toLocaleString()}</b>
🔥 Сила • <b>${seal.strength} (${seal.data.strength})</b>
⚡️ Ловкость • <b>${seal.agility} (${seal.data.agility})</b>
😎 Интеллект • <b>${seal.intellect} (${seal.data.intellect})</b>
🛡️ Выносливость • <b>${seal.endurance} (${seal.data.endurance})</b>
🍖 Метаболизм • <b>${seal.data.metabolism}</b>

<a href="https://teletype.in/@siviuss/kreeper-seals">Гайд по тюленям</a>`);
	}
}