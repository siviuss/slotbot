export default class {
	static trigger = /^-?(тюлень|пчюлень|seal)?( )?улучшить (.+?) (\d+)?$/i;

	static async execute(ctx) {
		if (!ctx.user.data.upgrades.includes(2))
			return ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");
		if (!ctx.user.data.upgrades.includes(3))
			return ctx.reply("У вас нету генератора таблеток! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		const args = ctx.body.toLocaleLowerCase().split(" ");
		if (args[0].match(/улучшить/gi) == null) args.shift();
		args.shift();
		let amount = 1;
		if (args[1] != null) {
			const n = parseInt(args[1]);
			if (n == null || isNaN(n) || n < 1) {
				return ctx.reply("Введите корректное число кредитов для улучшения.");
			} else {
				amount = n;
			}
		}
		const seal = await ctx.user.getSeal();

		if (seal.data.gcredits < amount)
			return ctx.reply("У вас нехватает 🏵 Жетонов!\nПолучите их инвестируя деньги в ваш генератор.");
		
		if (args[0] == "голод") {
			seal.data.ghunger += amount;
		} else if (args[0] == "жажда") {
			seal.data.gthirst += amount;
		} else if (args[0] == "энергия") {
			seal.data.genergy += amount;
		} else if (args[0] == "здоровье") {
			seal.data.ghealth += amount;
		} else if (args[0] == "сила") {
			seal.data.gstrength += amount;
		} else if (args[0] == "ловкость") {
			seal.data.gagility += amount;
		} else if (args[0] == "интеллект") {
			seal.data.gintellect += amount;
		} else if (args[0] == "выносливость") {
			seal.data.gendurance += amount;
		} else if (args[0] == "действенность") {
			seal.data.gpotency += amount;
		} else if (args[0] == "эффективность") {
			seal.data.gefficiency += amount;
		} else {
			return ctx.reply("❓ Неизвестая статистика для прокачки. Доступные: <code>голод</code>, <code>жажда</code>, <code>энергия</code>, <code>здоровье</code>, <code>сила</code>, <code>ловкость</code>, <code>интеллект</code>, <code>выносливость</code>, <code>действенность</code>, <code>эффективность</code>");
		}
		seal.data.gcredits -= amount;
		await seal.save();

		const mapped = {
			"голод": "🌯 Голод",
			"жажда": "💧 Жажду",
			"энергия": "🔋 Энергию",
			"здоровье": "❤️ Здоровье",
			"сила": "🔥 Силу",
			"ловкость": "⚡️ Ловкость",
			"интеллект": "😎 Интеллект",
			"выносливость": "🛡️ Выносливость",
			"действенность": "💥 Действенность",
			"эффективность": "🕰 Эффективность"
		};
		await ctx.reply(`💪 Вы вложили 🏵 <b>${amount}</b> в <b>${mapped[args[0]]}</b> таблеток вашего генератора!`);
	}
}