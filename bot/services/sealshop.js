const CURRENCY = {
	money: "💵",
	gpills: "💊"
};
const SELL_COEFFICIENT = 0.5;

const shop = {};

const bought = (item, amount) => `✅ Вы успешно приобрели <b>${item.icon} ${item.name}</b> за <b>${CURRENCY[item.currency]} ${(item.price * amount).toLocaleString()}</b>`;
const sold = (item, sell) => `✅ Вы успешно продали <b>${item.icon} ${item.name}</b> за <b>${CURRENCY[item.currency]} ${sell.toLocaleString()}</b>`;

shop[1] = {
	price: 3, currency: "money",
	icon: "🐟", name: "Рыба",
	description: "Восстанавливает 🌯 10",
	type: "regular",

	tag(user) { return "" },
	async buy(user, amount) {
		if (!user.data.upgrades.includes(2))
			return `Вы должны купить домашнего тюленя прежде чем покупать <b>${this.icon} ${this.name}</b>!`;
		const seal = await user.getSeal();
		user.data[this.currency] -= this.price * amount;
		seal.data.fish += amount;
		await user.save();
		await seal.save();
		return bought(this, amount);
	},
	async sell(user, amount) {
		if (!user.data.upgrades.includes(2))
			return `Вы должны купить домашнего тюленя прежде чем покупать <b>${this.icon} ${this.name}</b>!`;
		const seal = await user.getSeal();
		if (seal.data.fish < amount)
			return `Вам не хватает <b>${CURRENCY[item.currency]} ${(amount - seal.data.fish).toLocaleString()}</b> чтобы продать <b>${this.icon} ${this.name}</b>!`;
		const sell = Math.floor(this.price * amount * SELL_COEFFICIENT);
		user.data[this.currency] += sell;
		seal.data.fish -= amount;
		await user.save();
		await seal.save();
		return sold(this, sell);
	}
}

shop[2] = {
	price: 5, currency: "money",
	icon: "🐠", name: "Тропическая Рыба",
	description: "Восстанавливает 🌯 15",
	type: "regular",

	tag(user) { return "" },
	async buy(user, amount) {
		if (!user.data.upgrades.includes(2))
			return `Вы должны купить домашнего тюленя прежде чем покупать <b>${this.icon} ${this.name}</b>!`;
		const seal = await user.getSeal();
		user.data[this.currency] -= this.price * amount;
		seal.data.tfish += amount;
		await user.save();
		await seal.save();
		return bought(this, amount);
	},
	async sell(user, amount) {
		if (!user.data.upgrades.includes(2))
			return `Вы должны купить домашнего тюленя прежде чем покупать <b>${this.icon} ${this.name}</b>!`;
		const seal = await user.getSeal();
		if (seal.data.tfish < amount)
			return `Вам не хватает <b>${CURRENCY[item.currency]} ${(amount - seal.data.tfish).toLocaleString()}</b> чтобы продать <b>${this.icon} ${this.name}</b>!`;
		const sell = Math.floor(this.price * amount * SELL_COEFFICIENT);
		user.data[this.currency] += sell;
		seal.data.tfish -= amount;
		await user.save();
		await seal.save();
		return sold(this, sell);
	}
}

shop[3] = {
	price: 10, currency: "money",
	icon: "🐬", name: "Дельфин",
	description: "Восстанавливает 🌯 25",
	type: "regular",

	tag(user) { return "" },
	async buy(user, amount) {
		if (!user.data.upgrades.includes(2))
			return `Вы должны купить домашнего тюленя прежде чем покупать <b>${this.icon} ${this.name}</b>!`;
		const seal = await user.getSeal();
		user.data[this.currency] -= this.price * amount;
		seal.data.dfish += amount;
		await user.save();
		await seal.save();
		return bought(this, amount);
	},
	async sell(user, amount) {
		if (!user.data.upgrades.includes(2))
			return `Вы должны купить домашнего тюленя прежде чем покупать <b>${this.icon} ${this.name}</b>!`;
		const seal = await user.getSeal();
		if (seal.data.dfish < amount)
			return `Вам не хватает <b>${CURRENCY[item.currency]} ${(amount - seal.data.dfish).toLocaleString()}</b> чтобы продать <b>${this.icon} ${this.name}</b>!`;
		const sell = Math.floor(this.price * amount * SELL_COEFFICIENT);
		user.data[this.currency] += sell;
		seal.data.dfish -= amount;
		await user.save();
		await seal.save();
		return sold(this, sell);
	}
}

shop[4] = {
	price: 15, currency: "money",
	icon: "🦈", name: "Акула",
	description: "Восстанавливает 🌯 40",
	type: "regular",

	tag(user) { return "" },
	async buy(user, amount) {
		if (!user.data.upgrades.includes(2))
			return `Вы должны купить домашнего тюленя прежде чем покупать <b>${this.icon} ${this.name}</b>!`;
		const seal = await user.getSeal();
		user.data[this.currency] -= this.price * amount;
		seal.data.sfish += amount;
		await user.save();
		await seal.save();
		return bought(this, amount);
	},
	async sell(user, amount) {
		if (!user.data.upgrades.includes(2))
			return `Вы должны купить домашнего тюленя прежде чем покупать <b>${this.icon} ${this.name}</b>!`;
		const seal = await user.getSeal();
		if (seal.data.sfish < amount)
			return `Вам не хватает <b>${CURRENCY[item.currency]} ${(amount - seal.data.sfish).toLocaleString()}</b> чтобы продать <b>${this.icon} ${this.name}</b>!`;
		const sell = Math.floor(this.price * amount * SELL_COEFFICIENT);
		user.data[this.currency] += sell;
		seal.data.sfish -= amount;
		await user.save();
		await seal.save();
		return sold(this, sell);
	}
}

shop[101] = {
	price: 5, currency: "money",
	icon: "🥤", name: "Вода",
	description: "Восстанавливает 💧 15",
	type: "regular",

	tag(user) { return "" },
	async buy(user, amount) {
		if (!user.data.upgrades.includes(2))
			return `Вы должны купить домашнего тюленя прежде чем покупать <b>${this.icon} ${this.name}</b>!`;
		const seal = await user.getSeal();
		user.data[this.currency] -= this.price * amount;
		seal.data.fish += amount;
		await user.save();
		await seal.save();
		return bought(this, amount);
	},
	async sell(user, amount) {
		if (!user.data.upgrades.includes(2))
			return `Вы должны купить домашнего тюленя прежде чем покупать <b>${this.icon} ${this.name}</b>!`;
		const seal = await user.getSeal();
		if (seal.data.water < amount)
			return `Вам не хватает <b>${CURRENCY[item.currency]} ${(amount - seal.data.water).toLocaleString()}</b> чтобы продать <b>${this.icon} ${this.name}</b>!`;
		const sell = Math.floor(this.price * amount * SELL_COEFFICIENT);
		user.data[this.currency] += sell;
		seal.data.water -= amount;
		await user.save();
		await seal.save();
		return sold(this, sell);
	}
}

shop[102] = {
	price: 10, currency: "money",
	icon: "🍺", name: "Пиво",
	description: "Восстанавливает 💧 30, но уменьшает интеллект и ловкость вдвое на 2 часа.",
	type: "regular",

	tag(user) { return "" },
	async buy(user, amount) {
		if (user.data.upgrades.indexOf(1) == -1)
			return `Вы должны купить доступ к пивной прежде чем покупать <b>${this.icon} ${this.name}</b>!`;
		if (!user.data.upgrades.includes(2))
			return `Вы должны купить домашнего тюленя прежде чем покупать <b>${this.icon} ${this.name}</b>!`;
		user.data[this.currency] -= this.price * amount;
		user.data.beer += amount;
		await user.save();
		return bought(this, amount);
	},
	async sell(user, amount) {
		if (!user.data.upgrades.includes(2))
			return `Вы должны купить домашнего тюленя прежде чем покупать <b>${this.icon} ${this.name}</b>!`;
		const seal = await user.getSeal();
		if (user.data.beer < amount)
			return `Вам не хватает <b>${CURRENCY[item.currency]} ${(amount - user.data.beer).toLocaleString()}</b> чтобы продать <b>${this.icon} ${this.name}</b>!`;
		const sell = Math.floor(this.price * amount * SELL_COEFFICIENT);
		user.data[this.currency] += sell;
		user.data.beer -= amount;
		await user.save();
		return sold(this, sell);
	}
}

shop[103] = {
	price: 15, currency: "money",
	icon: "🍵", name: "Энергетик",
	description: "Удаляет 💧 40, но полностью восполняет энергию. Удваивает ловкость тюленя на 1 час.",
	type: "regular",

	tag(user) { return "" },
	async buy(user, amount) {
		if (!user.data.upgrades.includes(2))
			return `Вы должны купить домашнего тюленя прежде чем покупать <b>${this.icon} ${this.name}</b>!`;
		const seal = await user.getSeal();
		user.data[this.currency] -= this.price * amount;
		seal.data.ienergy += amount;
		await user.save();
		await seal.save();
		return bought(this, amount);
	},
	async sell(user, amount) {
		if (!user.data.upgrades.includes(2))
			return `Вы должны купить домашнего тюленя прежде чем покупать <b>${this.icon} ${this.name}</b>!`;
		const seal = await user.getSeal();
		if (seal.data.ienergy < amount)
			return `Вам не хватает <b>${CURRENCY[item.currency]} ${(amount - seal.data.ienergy).toLocaleString()}</b> чтобы продать <b>${this.icon} ${this.name}</b>!`;
		const sell = Math.floor(this.price * amount * SELL_COEFFICIENT);
		user.data[this.currency] += sell;
		seal.data.ienergy -= amount;
		await user.save();
		await seal.save();
		return sold(this, sell);
	}
}

shop[104] = {
	price: 15, currency: "money",
	icon: "☕", name: "Кофе",
	description: "Восстанавливает 💧 10, и добавляет 🔋 25. Удваивает силу и интеллект тюленя на 2 часа.",
	type: "regular",

	tag(user) { return "" },
	async buy(user, amount) {
		if (!user.data.upgrades.includes(2))
			return `Вы должны купить домашнего тюленя прежде чем покупать <b>${this.icon} ${this.name}</b>!`;
		const seal = await user.getSeal();
		user.data[this.currency] -= this.price * amount;
		seal.data.coffee += amount;
		await user.save();
		await seal.save();
		return bought(this, amount);
	},
	async sell(user, amount) {
		if (!user.data.upgrades.includes(2))
			return `Вы должны купить домашнего тюленя прежде чем покупать <b>${this.icon} ${this.name}</b>!`;
		const seal = await user.getSeal();
		if (seal.data.coffee < amount)
			return `Вам не хватает <b>${CURRENCY[item.currency]} ${(amount - seal.data.coffee).toLocaleString()}</b> чтобы продать <b>${this.icon} ${this.name}</b>!`;
		const sell = Math.floor(this.price * amount * SELL_COEFFICIENT);
		user.data[this.currency] += sell;
		seal.data.coffee -= amount;
		await user.save();
		await seal.save();
		return sold(this, sell);
	}
}

shop[105] = {
	price: 3, currency: "gpills",
	icon: "🧪", name: "Медицина",
	description: "Восстанавливает ❤️ 250",
	type: "regular",

	tag(user) { return "" },
	async buy(user, amount) {
		if (!user.data.upgrades.includes(2))
			return `Вы должны купить домашнего тюленя прежде чем покупать <b>${this.icon} ${this.name}</b>!`;
		const seal = await user.getSeal();
		user.data[this.currency] -= this.price * amount;
		seal.data.medicine += amount;
		await user.save();
		await seal.save();
		return bought(this, amount);
	},
	async sell(user, amount) {
		if (!user.data.upgrades.includes(2))
			return `Вы должны купить домашнего тюленя прежде чем покупать <b>${this.icon} ${this.name}</b>!`;
		const seal = await user.getSeal();
		if (seal.data.medicine < amount)
			return `Вам не хватает <b>${CURRENCY[item.currency]} ${(amount - seal.data.medicine).toLocaleString()}</b> чтобы продать <b>${this.icon} ${this.name}</b>!`;
		const sell = Math.floor(this.price * amount * SELL_COEFFICIENT);
		user.data[this.currency] += sell;
		seal.data.medicine -= amount;
		await user.save();
		await seal.save();
		return sold(this, sell);
	}
}

export default shop;