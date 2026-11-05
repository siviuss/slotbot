import { formatTime, now } from '@services/util.js';
const level = (d, a1, an) => {
	return (3 - 2 * d + Math.sqrt((2*d - 3)**2 + 8 * (an - a1 + d - 1))) / 2;
};
const a_level = (d, a1, n) => {
	return a1 + (n-1)*d + (n-1)*(n-2)/2;
};

export default class {
	static trigger = /^-?(тюлень|пчюлень|seal)?( )?ген(ератор)?$/i;

	static async execute(ctx) {
		if (!ctx.user.data.upgrades.includes(2))
			return ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");
		if (!ctx.user.data.upgrades.includes(3))
			return ctx.reply("У вас нету генератора таблеток! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		const seal = await ctx.user.getSeal();
		await seal.tick(ctx);
		const stats = seal.pillStats;
		const boosts = seal.pillBoosts;

		const n = level(15, 15, seal.data.ginvested);
		const goal = n < 2 ? (30 - seal.data.ginvested) : Math.floor(a_level(15, 15, Math.floor(n + 1))) - seal.data.ginvested;
		const cd = seal.data.gencooldown - now();
		
		await ctx.reply(`🗜️ <b>Генератор таблеток</b> ${ctx.user.mention}
Инвестировать в генератор: <code>-инвестировать &lt;количество&gt;</code>
Прокачать статистику: <code>-улучшить &lt;статистика&gt; [количество]</code>
Откатить статистику: <code>-ухудшить &lt;статистика&gt; [количество]</code>

<blockquote expandable><i><b>Генератор</b></i>
<b>База</b>
💫 Уровень • <b>${Math.floor(seal.data.glevel)}</b>
🏵 Жетоны • <b>${seal.data.gcredits.toLocaleString()}</b>
💸 Инвестировано • 💶 <b>${seal.data.ginvested.toLocaleString()}</b>
┗ До следующего уровня: 💶 <b>${goal.toLocaleString()}</b>
💥 Действенность • <b>${seal.data.gpotency.toLocaleString()} (${formatTime(seal.pillPotency)})</b>
🕰 Эффективность • <b>${seal.data.gefficiency.toLocaleString()} (${seal.pillEfficiency-1}–${seal.pillEfficiency+2} таб.)</b>

<b>Статистика</b>
🌯 Голод • <b>${seal.data.ghunger.toLocaleString()} (+${stats.hunger})</b>
💧 Жажда • <b>${seal.data.gthirst.toLocaleString()} (+${stats.thirst})</b>
🔋 Энергия • <b>${seal.data.genergy.toLocaleString()} (+${stats.energy})</b>
❤️ Здоровье • <b>${seal.data.ghealth.toLocaleString()} (+${stats.health})</b>
🔥 Сила • <b>${seal.data.gstrength.toLocaleString()} (${boosts.strength}x)</b>
⚡️ Ловкость • <b>${seal.data.gagility.toLocaleString()} (${boosts.agility}x)</b>
😎 Интеллект • <b>${seal.data.gintellect.toLocaleString()} (${boosts.intellect}x)</b>
🛡️ Выносливость • <b>${seal.data.gendurance.toLocaleString()} (${boosts.endurance}x)</b>
</blockquote>
💊 Диспенсер: ${cd < 0 ? "✅ <b>ГОТОВ</b>" : `⏳ <b>${formatTime(cd)}</b>`},
Получить таблетку: <code>-диспенсер</code>`);
	}
}