import SealSkins from '../../data/SealSkins.json';

export default class {
	static trigger = /^-?скин купить \d+$/i;

	static async execute(ctx) {
		if (!ctx.user.upgrades.includes(2))
			return ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		const args = ctx.arguments.slice(2);

		const id = Number(args[0]);
		if (isNaN(id) || id < 0 || id > SealSkins.length)
			return ctx.reply("Введите корректный номер скина");

		const seal = await ctx.user.getSeal(); 
		if (seal.data.skins.indexOf(id) != -1)
			return ctx.reply("🛍 | У вас уже есть этот скин!");
		const skin = SealSkins[id];
		if (skin.price == null)
			return ctx.reply("❌ | Этот скин нельзя приобрести.");
		if (ctx.user.data.gem < skin.price)
			return ctx.reply(`💸 | Вам не хватает 💎 <b>${skin.price - ctx.user.data.gem}</b> для покупки этого скина.`);

		seal.data.skins.push(id);
		ctx.user.data.gem -= skin.price;
		await ctx.user.save();
		await seal.save();

		await ctx.reply(`🛍 | Вы успешно приобрели скин <b>${skin.name}</b>
Оденьте его с помощью <code>-скин ${id}</code>`);
	}
}