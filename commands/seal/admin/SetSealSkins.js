import SealSkins from '../../../data/SealSkins.json';
import User from '@bot/user.js';

export default class {
	static trigger = /^-тскин( \d+)? \d+$/i;

	static async execute(ctx) {
		if (!ctx.user.superadmin) return;

		const args = ctx.arguments.slice(1);
		let user;
		if (args.length == 2) {
			user = await User.fromID(args.shift());
		} else {
			user = ctx.user;
		}
		if (user == null) return ctx.reply("📝 Нет информации о пользователе");
		if (!user.data.upgrades.includes(2))
			return ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		const seal = await user.getSeal();
		const n = parseInt(args.shift());
		if (isNaN(n) || n < 0 || n > 2**31-1) return;
		const skin = SealSkins[n];

		if (seal.data.skins.includes(n)) {
			seal.data.skins.splice(seal.data.skins.indexOf(n), 1);
			await seal.save();
			await ctx.reply(`Скин тюленя ${skin.name} (ID: <code>${n}</code>) удалён игроку ${user.link}`);
		} else {
			seal.data.skins.push(n);
			await seal.save();
			await ctx.reply(`Скин тюленя ${skin.name} (ID: <code>${n}</code>) добавлен игроку ${user.link}`);
		}
	}
}