export default class {
	static trigger = /^-?(тюлень|пчюлень|seal)?( )?(прокачать) /i;

	static async execute(ctx) {
		if (!ctx.user.data.upgrades.includes(2))
			return ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		const args = ctx.body.toLocaleLowerCase().split(" ");
		if (args.length == 3) args.shift();
		args.shift();
		const seal = await ctx.user.getSeal();

		if (seal.data.credits <= 0)
			return ctx.reply(`❌ | У вас нехватает 🍥 Кредитов!\nПолучите их прокачивая уровень вашего ${seal.name}, например на охоте.`);
		
		if (args[0] == "сила") {
			seal.data.strength += 1;
		} else if (args[0] == "ловкость") {
			seal.data.agility += 1;
		} else if (args[0] == "интеллект") {
			seal.data.intellect += 1;
		} else if (args[0] == "выносливость") {
			seal.data.endurance += 1;
		} else if (args[0] == "метаболизм") {
			seal.data.metabolism += 1;
		} else {
			return ctx.reply("❓ | Неизвестая статистика для прокачки. Доступные: <code>сила</code>, <code>ловкость</code>, <code>интеллект</code>, <code>выносливость</code>, <code>метаболизм</code>");
		}
		seal.data.credits -= 1;
		await seal.save();

		const mapped = {
			"сила": "силу",
			"ловкость": "ловкость",
			"интеллект": "интеллект",
			"выносливость": "выносливость",
			"метаболизм": "метаболизм"
		};
		await ctx.reply(`💪 | Вы вложили 🍥 <b>1</b> в <b>${mapped[args[0]]}</b> вашего ${seal.nameno}!`);
	}
}