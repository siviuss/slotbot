export default class {
	static trigger = /^-?(тюлень|пчюлень|seal)?( )?откат(ить)? /i;

	static async execute(ctx) {
		if (!ctx.user.data.upgrades.includes(2))
			return ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		const args = ctx.body.toLocaleLowerCase().split(" ");
		if (args.length == 3) args.shift();
		args.shift();
		const seal = await ctx.user.getSeal();

		const stat = ({
			"сила": "strength",
			"ловкость": "agility",
			"интеллект": "intellect",
			"выносливость": "endurance",
			"метаболизм": "metabolism"
		})[args[0]];
		const mapped = {
			"сила": "силу",
			"ловкость": "ловкость",
			"интеллект": "интеллект",
			"выносливость": "выносливость",
			"метаболизм": "метаболизм"
		};

		if (stat == null)
			return ctx.reply("❓ Неизвестая статистика для отката. Доступные: <code>сила</code>, <code>ловкость</code>, <code>интеллект</code>, <code>выносливость</code>, <code>метаболизм</code>");
		if (seal.data[stat] <= 1)
			return ctx.reply(`❌ Вы не можете откатить ${mapped[args[0]]}, поскольку у неё осталось только 1 очко!`)
		seal.data[stat] -= 1;
		seal.data.credits += 1;
		seal.save();

		await ctx.reply(`💪 Вы откатили <b>${mapped[args[0]]}</b> у вашего ${seal.nameno} и получили 🍥 <b>1</b>!`);
	}
}