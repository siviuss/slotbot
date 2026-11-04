import SealSkins from '../../../data/SealSkins.json';

export default class {
	static trigger = /^-тскин /i;

	static async execute(ctx) {
		if (!ctx.user.superadmin) return;
		const args = ctx.arguments.slice(1);
		const user = await ctx.getArgumentsUserOrSelf(args);
		if (user.data.upgrades.indexOf(2) == -1)
			return ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		const seal = await user.getSeal();

		const n = parseInt(args.shift());
		if (isNaN(n) || n < 0 || n > 2**31-1) return;
		const skin = SealSkins[n];

		if (seal.data.skins.includes(n)) {
			seal.data.skins.splice(seal.data.skins.indexOf(n), 1);
			await seal.save();
			await ctx.reply(`Скин тюленя ${skin.name} (ID: <code>${n}</code>) удалён игроку <code>${user.uid}</code>`);
		} else {
			seal.data.skins.push(n);
			await seal.save();
			await ctx.reply(`Скин тюленя ${skin.name} (ID: <code>${n}</code>) добавлен игроку <code>${user.uid}</code>`);
		}
	}
}