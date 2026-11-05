import { formatTime, now } from '@services/util.js';

function hunt(user, seal) {
	const rewards = {
		gem: 0.0, metal: 0, raremetal: 0,
		battle: false, wonbattle: false, escape: false, hploss: 0
	};

	rewards.xp = Math.floor(
		(Math.random() + 0.3) * 600 * ((seal.intellect + 3) / 4)
	);

	// battles
	if (Math.random() < 0.5) {
		rewards.battle = true;
		if (Math.random() < (0.3 + Math.log((seal.agility + 1) / 2) / 3)) {
			rewards.escape = true;
		} else if (user.data.upgrades.indexOf(5) != -1 ||
			Math.random() < (0.0 + Math.log((seal.strength + 1) / 2) / 5)
		) {
			rewards.wonbattle = true;
			rewards.xp += 1000 * ((seal.intellect + 3) / 4);
			rewards.gem += 0.07;
		} else {
			rewards.wonbattle = false;
			rewards.hploss = Math.floor((Math.random() * 0.3 + 0.6) * 250 / (seal.endurance / 2));
		}
	}

	// finds
	if (Math.random() < 0.5) {
		rewards.gem += 0.01 * (Math.floor(Math.random() * 5 + 5) - 3);
	}
	if (Math.random() < 0.35) {
		rewards.metal += Math.floor(Math.random() * 6 + 5);
	}
	if (Math.random() < 0.1) {
		rewards.raremetal += Math.floor(Math.random() * 2.5 + 1);
	}

	seal.data.experience += rewards.xp;
	seal.data.health -= rewards.hploss;
	user.data.gem += rewards.gem;
	user.data.metal += rewards.metal;
	user.data.raremetal += rewards.raremetal;

	return rewards;
}


export default class {
	static trigger = /^-?(тюлень|пчюлень|seal)?( )?(шахта|майн|майнинг|копать)$/i;
	static is_protected = true;

	static async execute(ctx) {
		if (!ctx.user.data.upgrades.includes(2))
			return ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		const seal = await ctx.user.getSeal();
		if (seal.data.level < 7)
			return ctx.reply(`❌ Ваш ${seal.nameshort} недостаточно опытный, чтобы идти в шахту! Требуется <b>7 уровень</b>.`);
		if (seal.data.energy < 30)
			return ctx.reply(`😵 Ваш ${seal.nameshort} слишком уставший, и он не может идти в шахту.
<blockquote>🔋 Уровень энергии упал ниже 30!</blockquote>`);

		const diff = seal.data.minecooldown - now();
		if (diff > 0)
			return ctx.reply(`Ваш ${seal.nameshort} устал и не может идти в шахту.
🕔 Подождите <b>${formatTime(diff)}</b> прежде чем идти копать.`);

		await seal.tick(ctx);
		const energyloss = Math.floor(70 / (1 + Math.log(seal.endurance / 5 + 1)));
		const rewards = hunt(ctx.user, seal);
		seal.data.energy -= energyloss;
		seal.data.minecooldown = now() + Math.floor(1200 / (1 + seal.endurance / 2));
		await seal.tick(ctx);
		await seal.save();
		await ctx.user.save();

		let message = `⛏️ Вы пошли копать в шахту вместе с ${seal.namewith}...`;
		if (rewards.battle) {
			message += "\n⚔️ На вас напал пещерный монстр и ";
			if (rewards.escape) {
				message += `ваш ${seal.nameshort} сбежал.`;
			} else if (rewards.wonbattle) {
				message += `${seal.nameshort} выйграл битву.`;
			} else {
				message += `он победил вашего ${seal.nameno}. (-${rewards.hploss} ❤️)`;
			}
		}
		message += `\n<b>Потрачено энергии:</b> 🔋 ${energyloss}\n\n<b>Награды:</b>`;

		const rewardsmessage = [];
		if (rewards.gem > 0)
			rewardsmessage.push(`+${Math.floor(rewards.gem * 100) / 100} 💎 <b>Кристалл</b>`);
		if (rewards.metal > 0)
			rewardsmessage.push(`+${rewards.metal.toLocaleString()} ⚙️ <b>Металл</b>`);
		if (rewards.raremetal > 0)
			rewardsmessage.push(`+${rewards.raremetal.toLocaleString()} 🌕 <b>Ценный металл</b>`);
		if (rewards.xp > 0)
			rewardsmessage.push(`+${rewards.xp.toLocaleString()} ☄️ <b>Опыт</b>`);

		message += `\n${rewardsmessage.join("\n")}`;

		await ctx.reply(message);
	}
}