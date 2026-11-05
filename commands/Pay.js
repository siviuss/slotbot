export default class {
	static trigger = /^-?(дать|передать)( @[a-zA-Z0-9_]+)? \d+$/i;
	static requires_user = true;

	static async execute(ctx) {
		const args = ctx.arguments.slice(1);
		const payer = ctx.user;
		const receiver = await ctx.getArgumentsUser(args);
		const amount = Number(args.shift());

		if (isNaN(amount)) return;
		if (receiver == null) return ctx.reply("📝 Нет информации о пользователе");
		if (payer.uid == receiver.uid) return;

		if (payer.money < amount)
			return ctx.reply(`❌ Вам не хватает <b>💵 ${amount.toLocaleString()}</b> для передачи`);

		payer.money -= amount;
		receiver.money += amount;
		await payer.save();
		await receiver.save();

		await ctx.reply(`💸 ${payer.mention} заплатил ${receiver.mention} <b>💵 ${amount.toLocaleString()}</b>`);
	}
}