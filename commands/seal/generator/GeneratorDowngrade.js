export default class {
	static trigger = /^-?(тюлень|пчюлень|seal)?( )?ухудшить (.+?) (\d+)?$/i;

	static async execute(ctx) {
		if (!ctx.user.data.upgrades.includes(2))
			return ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");
		if (!ctx.user.data.upgrades.includes(3))
			return ctx.reply("У вас нету генератора таблеток! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		const args = ctx.body.toLocaleLowerCase().split(" ");
		if (args[0].match(/ухудшить/gi) == null) args.shift();
		args.shift();
		let amount = 1;
		if (args[1] != null) {
			const n = parseInt(args[1]);
			if (n == null || isNaN(n) || n < 1) {
				return ctx.reply("Введите корректное число уровней для ухудшения.");
			} else {
				amount = n;
			}
		}
		const seal = await ctx.user.getSeal();

		const stat = ({
			"голод": "ghunger",
			"жажда": "gthirst",
			"энергия": "genergy",
			"здоровье": "ghealth",
			"сила": "gstrength",
			"ловкость": "gagility",
			"интеллект": "gintellect",
			"выносливость": "gendurance",
			"действенность": "gpotency",
			"эффективность": "gefficiency"
		})[args[0]];

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

		if (stat == null)
			return ctx.reply("❓ Неизвестая статистика для ухудшения. Доступные: <code>голод</code>, <code>жажда</code>, <code>энергия</code>, <code>здоровье</code>, <code>сила</code>, <code>ловкость</code>, <code>интеллект</code>, <code>выносливость</code>");
		if (seal.data[stat] < amount)
			return ctx.reply(`❌ Вы не можете ухудшить ${mapped[args[0]]}, поскольку у неё не останется очков!`)
		seal.data[stat] -= amount;
		seal.data.gcredits += amount;
		await seal.save();

		await ctx.reply(`💪 Вы ухудшили <b>${mapped[args[0]]}</b> и получили 🏵 <b>${amount}</b> для вашего генератора!`);
	}
}