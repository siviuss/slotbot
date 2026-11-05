const CURRENCY = {
	money: "💵"
};

const shop = {};

shop[1] = {
	price: 1000, currency: "money",
	icon: "🍻", name: "Доступ пивной",
	description: "Даёт доступ к пивной, в которой можно купить пиво",
	type: "upgrade",

	tag(user) {
		if (user.data.upgrades.indexOf(1) != -1)
			return "✅";
		return "";
	},
	async buy(user, amount) {
		if (user.data.upgrades.indexOf(1) != -1)
			return "❌ У вас уже имеется доступ к пивной!";
		user.data.upgrades.push(1);
		user.data[this.currency] -= this.price;
		await user.save();
		return `✅ Вы успешно приобрели <b>${this.icon} ${this.name}</b> за <b>${CURRENCY[this.currency]} ${this.price.toLocaleString()}</b>`;
	}
}

shop[2] = {
	price: 10, currency: "money",
	icon: "🍺", name: "Пиво",
	description: "Сокращает вашу задержку карточек на 1 час",
	type: "regular",

	tag(user) {
		if (user.data.upgrades.indexOf(1) == -1)
			return "❌";
		return "";
	},
	async buy(user, amount) {
		if (user.data.upgrades.indexOf(1) == -1)
			return "❌ Вам необходим <b>🍻 Доступ пивной</b> чтобы покупать пиво!";
		user.data.beer += amount;
		user.data[this.currency] -= this.price * amount;
		await user.save();
		return `✅ Вы успешно приобрели <b>${this.icon} ${amount.toLocaleString()}</b> за <b>${CURRENCY[this.currency]} ${(this.price * amount).toLocaleString()}</b>`;
	}
}

shop[3] = {
	price: 0, currency: "money",
	icon: "🦭", name: "Домашний тюлень",
	description: "Доступен по команде <code>-тюлень</code>. Заботьтесь о нём, и он о вас.",
	type: "upgrade",

	tag(user) {
		if (user.data.upgrades.indexOf(2) != -1)
			return "✅";
		return "";
	},
	async buy(user, amount) {
		if (user.data.upgrades.indexOf(2) != -1)
			return "❌ У вас уже имеется тюлень!";
		user.data.upgrades.push(2);
		user.data[this.currency] -= this.price;
		await user.save();
		return `✅ Вы успешно приобрели домашнего тюленя за <b>${CURRENCY[this.currency]} ${this.price.toLocaleString()}</b>, теперь он доступен по команде <code>-тюлень</code>`;
	}
}

shop[4] = {
	price: 50, currency: "money",
	icon: "🗜", name: "Генератор",
	description: "Может генерировать и изменять структуру таблеток, для тюленя",
	type: "upgrade",

	tag(user) {
		if (user.data.upgrades.indexOf(3) != -1)
			return "✅";
		return "";
	},
	async buy(user, amount) {
		if (user.data.upgrades.indexOf(3) != -1)
			return "❌ У вас уже имеется генератор!";
		user.data.upgrades.push(3);
		user.data[this.currency] -= this.price;
		await user.save();
		return `✅ Вы успешно приобрели генератор за <b>${CURRENCY[this.currency]} ${this.price.toLocaleString()}</b>, теперь он доступен по команде <code>-генератор</code>`;
	}
}

shop[5] = {
	price: 200, currency: "money",
	icon: "🧰", name: "Верстак",
	description: "Используется для крафта различных ценных предметов",
	type: "upgrade",

	tag(user) {
		if (user.data.upgrades.indexOf(4) != -1)
			return "✅";
		return "";
	},
	async buy(user, amount) {
		if (user.data.upgrades.indexOf(4) != -1)
			return "❌ У вас уже имеется верстак!";
		user.data.upgrades.push(4);
		user.data[this.currency] -= this.price;
		await user.save();
		return `✅ Вы успешно приобрели верстак за <b>${CURRENCY[this.currency]} ${this.price.toLocaleString()}</b>, теперь он доступен по команде <code>-верстак</code>`;
	}
}

export default shop;