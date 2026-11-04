import { formatTime, now } from '@services/util.js';

const mapped = {
	рыб(seal, user) {
		if (seal.data.fish < 1)
			return [ false, "🐟 Рыба" ];
		seal.data.fish -= 1;
		seal.data.hunger += 10;
		return [ true, "🐟 Рыба" ];
	},

	тро(seal, user) {
		if (seal.data.tfish < 1)
			return [ false, "🐠 Тропическая Рыба" ];
		seal.data.tfish -= 1;
		seal.data.hunger += 15;
		return [ true, "🐠 Тропическая Рыба" ];
	},

	дел(seal, user) {
		if (seal.data.dfish < 1)
			return [ false, "🐬 Дельфин" ];
		seal.data.dfish -= 1;
		seal.data.hunger += 25;
		return [ true, "🐬 Дельфин" ];
	},

	аку(seal, user) {
		if (seal.data.sfish < 1)
			return [ false, "🦈 Акула" ];
		seal.data.sfish -= 1;
		seal.data.hunger += 40;
		return [ true, "🦈 Акула" ];
	},

	вод(seal, user) {
		if (seal.data.water < 1)
			return [ false, "🥤 Вода" ];
		seal.data.water -= 1;
		seal.data.thirst += 15;
		return [ true, "🥤 Вода" ];
	},

	пив(seal, user) {
		if (user.data.beer < 1)
			return [ false, "🍺 Пиво" ];
		user.data.beer -= 1;
		seal.data.thirst += 30;
		seal.applyEffect("beer", 7200);
		user.save();
		return [ true, "🍺 Пиво" ];
	},

	эне(seal, user) {
		if (seal.data.ienergy < 1)
			return [ false, "🍵 Энергетик" ];
		seal.data.ienergy -= 1;
		seal.data.thirst -= 40;
		seal.data.energy = 100;
		seal.applyEffect("energy", 3600);
		return [ true, "🍵 Энергетик" ];
	},

	коф(seal, user) {
		if (seal.data.coffee < 1)
			return [ false, "☕ Кофе" ];
		seal.data.coffee -= 1;
		seal.data.thirst += 10;
		seal.data.energy += 25;
		seal.applyEffect("coffee", 7200);
		return [ true, "☕ Кофе" ];
	},

	мед(seal, user) {
		if (seal.data.med < 1)
			return [ false, "🧪 Медицина" ];
		seal.data.med -= 1;
		seal.data.health += 250;
		return [ true, "🧪 Медицина" ];
	},

	таб(seal, user) {
		if (user.data.gpills < 1)
			return [ false, "💊 Таблетка" ];
		user.data.gpills -= 1;
		seal.feedPill();
		user.save();
		return [ true, "💊 Таблетка" ];
	}
};

export default class {
	static trigger = /^-?(тюлень|пчюлень|seal)?( )?(на|по)?кормить/i;
	static is_protected = true;

	static async execute(ctx) {
		if (!ctx.user.upgrades.includes(2))
			return ctx.reply("У вас нету тюленя! Вы можете купить его в магазине с помощью команды <code>-магазин</code>");

		const args = ctx.arguments;
		if (args.length == 3) args.shift();
		args.shift();

		const seal = await ctx.user.getSeal();
		
		const feed = mapped[(args[0] ?? "").substring(0, 3)];
		if (feed == null)
			return ctx.reply(`❓ | Неизвестная еда. Доступные виды еды:
<code>рыба</code>, <code>тропическая</code>, <code>дельфин</code>, <code>акула</code>, <code>вода</code>, <code>пиво</code>, <code>энергетик</code>, <code>кофе</code>, <code>медицина</code>, <code>таблетка</code>`);

		const diff = seal.data.feedcooldown - now();
		if (diff > 0)
			return ctx.reply(`Ваш ${seal.name} сыт и не хочет есть.
🕔 Подождите <b>${formatTime(diff)}</b> прежде чем предлагать питомцу еду снова.`)

		await seal.tick(ctx);
		const [ success, name ] = feed(seal, ctx.user);
		await seal.tick(ctx);

		if (success) {
			seal.data.feedcooldown = now() + Math.floor(600 / seal.data.metabolism);
			seal.save();
			await ctx.reply(`😋 | Вы накормили своего ${seal.nameno} <b>${name}</b>`);
		} else {
			await ctx.reply(`❌ | Вам не хватает <b>${name}</b> чтобы покормить ${seal.nameno}`);
		}
	}
}