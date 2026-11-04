import { formatTime, now } from '@services/util.js';

const EFFECT_NAMES = {
	"coffee": "☕️ Кофе",
	"energy": "🍵 Энергетик",
	"beer": "🍺 Пиво",
	"pill": "💊 Таблетка"
};
function effectMap(data) {
	const { effect, time } = data;
	return `${EFFECT_NAMES[effect]}\n┗ ${formatTime(time - now())}`
}

export default class {
	static trigger = /^-?(тюлень|пчюлень|seal)?( )?(статус|эффекты)$/i;

	static async execute(ctx) {
		if (!ctx.user.upgrades.includes(2))
			return ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		const seal = await ctx.user.getSeal();
		await seal.tick(ctx);

		const effects = [];
		for (const effect of Object.keys(seal.effects)) {
			const time = seal.effects[effect];
			if (time > now()) effects.push({effect, time});
		}

		await ctx.reply(`🧪 <b>Эффекты ${seal.nameno}</b> ${ctx.user.mention}
${effects.map(effectMap).join("\n")}`);
	}
}