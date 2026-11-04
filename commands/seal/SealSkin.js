import SealSkins from '../../data/SealSkins.json';

export default class {
	static trigger = /^-?(тюлень|пчюлень|seal)?( )?скин \d+$/i;

	static async execute(ctx) {
		if (!ctx.user.upgrades.includes(2))
			return ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		const args = ctx.arguments;
		if (args[0].match(/^-?(тюлень|пчюлень|seal)/gi)) args.shift();
		args.shift();

		const id = parseInt(args.shift());
		if (isNaN(id) || id < 0 || id > SealSkins.length)
			return ctx.reply("Введите корректный номер скина");

		const seal = await ctx.user.getSeal();
		if (seal.data.skins.indexOf(id) == -1)
			return ctx.reply("❌ | У вас нету этого скина! Приобрести скины можно в <code>-скин маркет</code>");
		seal.data.skin = id;
		await seal.save();

		await ctx.reply(`🎭 | Вы одели скин <b>${SealSkins[id].name}</b> вашему тюленю`);
	}
}