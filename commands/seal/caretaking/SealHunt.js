import { formatTime, now } from '@services/util.js';

const FISH_WEIGHT = [
	0.0, //null
	1.0, //fish
	0.7, //tropical
	0.3, //dolphin
	0.15  //shark
];
const FISH_KEY = [
	null,
	"fish",
	"tfish",
	"dfish",
	"sfish"
];
const FISH_ICON = [
	null,
	"🐟 Рыба",
	"🐠 Тропическая Рыба",
	"🐬 Дельфин",
	"🦈 Акула"
];

const HUNT_MESSAGES = [
	"⚔️ Вы с % пошли на охоту в лес...",
	"🪝 Вы с % пошли на охоту в море...",
	"🎣 Вы с % пошли рыбачить..."
];
const BOOST_MESSAGE = {
	IN_CHAT: "+25% опыта за нахождение в чате",
	SEAL_PEAK: "+10% опыта в прайм тюленей",
	RING_OF_POWER: "+200% опыта с помощью кольца всевластия"
};

function hunt(user, seal, inchat) {
	const rewards = {
		xp: 0, fish: [0, 0],
		boosts: []
	};
	rewards.xp = Math.floor(
		(Math.random() + 0.3) * 200 * seal.intellect
	);
	if (Math.random() < (0.3 + Math.log((seal.agility + 1) / 2) / 3)) {
		// determine fish type
		rewards.fish[0] = Math.floor(Math.random() * 4 + 1);
		// decide how much fish (and also deduct based on fish weight)
		rewards.fish[1] = Math.floor(
			(Math.random() * 4 + 3)
			* FISH_WEIGHT[rewards.fish[0]]
			* (1 + (Math.log(seal.agility + 1) / 1.5))
		);
		rewards.xp += 75 / FISH_WEIGHT[rewards.fish[0]];
	}

	// boosts
	let xpboost = 1;
	if (inchat) { rewards.boosts.push("IN_CHAT"); xpboost += 0.25 };
	// rewards.boosts.push("SEAL_PEAK"); xpboost += 0.1;
	if (user.data.upgrades.indexOf(5) != -1) { rewards.boosts.push("RING_OF_POWER"); xpboost += 2 }
	rewards.xp = Math.floor(rewards.xp * xpboost);

	// apply
	seal.data.experience += rewards.xp;
	if (rewards.fish[0] != 0 && rewards.fish[1] > 0)
		seal.data[FISH_KEY[rewards.fish[0]]] += rewards.fish[1];
	return rewards;
}


export default class {
	static trigger = /^-?(тюлень|пчюлень|seal)?( )?(охота|охотится|рыбачить|рыбалка)$/i;
	static is_protected = true;

	static async execute(ctx) {
		const user = ctx.user;
		if (user.data.upgrades.indexOf(2) == -1)
			return ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		// low energy
		const seal = await user.getSeal();
		if (seal.data.energy < 30)
			return ctx.reply(`😴 Ваш ${seal.nameshort} слишком уставший, и он не может охотится.
(🔋 Уровень энергии упал ниже 30!)`);

		// cooldown
		const diff = seal.data.huntcooldown - now();
		if (diff > 0)
			return ctx.reply(`Ваш ${seal.nameshort} устал и не может охотится.
🕔 Подождите <b>${formatTime(diff)}</b> прежде чем идти на охоту.`);

		// hunt
		await seal.tick(ctx);
		const rewards = hunt(user, seal, ctx.message.chat.id == -1002333517235);
		seal.data.energy -= Math.floor((Math.random() + 0.5) * 30 / (1 + Math.log(seal.endurance + 1)));
		seal.data.huntcooldown = now() + Math.floor(600 / (1 + seal.endurance / 2));
		await seal.tick(ctx);
		await seal.save();

		// build message
		let message = HUNT_MESSAGES[Math.floor(Math.random() * HUNT_MESSAGES.length)].replace("%", seal.namewith);
		if (rewards.xp > 0) message += `\n<b>Заработанный опыт</b>: ☄️ ${rewards.xp.toLocaleString()}`;
		if (rewards.fish[0] != 0 && rewards.fish[1] > 0) {
			message += "\n<b>Награды</b>:"
			message += `\n+${rewards.fish[1].toLocaleString()} <b>${FISH_ICON[rewards.fish[0]]}</b>`;
		}
		message += "\n";
		for (const boost of rewards.boosts) {
			message += `\n<i>${BOOST_MESSAGE[boost]}</i>`;
		}

		await ctx.reply(message);
	}
}