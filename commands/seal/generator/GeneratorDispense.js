import { formatTime, now } from '@services/util.js';

export default class {
	static trigger = /^-?(тюлень|пчюлень|seal)?( )?диспенсер$/i;

	static async execute(ctx) {
		if (!ctx.user.data.upgrades.includes(2))
			return ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");
		if (!ctx.user.data.upgrades.includes(3))
			return ctx.reply("У вас нету генератора таблеток! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		const seal = await ctx.user.getSeal();
		await seal.tick(ctx);
		const cd = seal.data.gencooldown - now();
		if (cd > 0)
			return ctx.reply(`❌ Диспенсер ещё не готов! Приходите за таблеткой через <b>${formatTime(cd)}</b>`);

		const pills = Math.floor(Math.random() * 3 + seal.pillEfficiency);
		seal.data.gencooldown = now() + 3600;
		ctx.user.data.gpills += pills;
		await seal.save();
		await ctx.user.save();

		await ctx.reply(`🗜 Вы использовали диспенсер и получили <b>+${pills} Таблеток</b> 💊`);
	}
}