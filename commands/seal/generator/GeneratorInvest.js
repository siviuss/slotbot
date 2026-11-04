/*
an = a1 + (n-1)*d + (n-1)(n-2)/2
=>
n = (3 - 2d + √((2d - 3)^2 + 8(an - a1 + d - 1))) / 2
a1 = 15, d = 15, an = invested
*/
const level = (d, a1, an) => {
	return (3 - 2 * d + Math.sqrt((2*d - 3)**2 + 8 * (an - a1 + d - 1))) / 2;
};

export default class {
	static trigger = /^-?(тюлень|пчюлень|seal)?( )?инвест(ировать)? \d+$/i;

	static async execute(ctx) {
		if (!ctx.user.upgrades.includes(2))
			return ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");
		if (!ctx.user.upgrades.includes(3))
			return ctx.reply("У вас нету генератора таблеток! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		const args = ctx.arguments;
		if (args.length == 3) args.shift();
		args.shift();
		const seal = await ctx.user.getSeal();

		const amount = parseInt(args[0]);
		if (amount == null || isNaN(amount) || amount <= 0)
			return ctx.reply("💸 | Введите корректное число денег для инвестиции.");
		if (ctx.user.data.money < amount)
			return ctx.reply("💸 | Вам не хватает денег для инвестиции.");

		seal.data.ginvested += amount;
		ctx.user.data.money -= amount;
		const n = Math.floor(level(15, 15, seal.data.ginvested));
		//const n = Math.floor((seal.data.ginvested - 15) / 17 + 1) + 1;
		let creditsgain = 0;
		if (seal.data.glevel < n) {
			creditsgain = (n - seal.data.glevel) * 2;
			seal.data.glevel = n;
			seal.data.gcredits += creditsgain;
		}

		await seal.save();
		await ctx.user.save();
		await ctx.reply(`🗜️ | Вы инвестировали 💶 <b>${amount.toLocaleString()}</b> и получили 🏵 <b>${creditsgain}</b>`);
	}
}