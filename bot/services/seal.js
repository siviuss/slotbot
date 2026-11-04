import SealSkins from '../../data/SealSkins.json';
import db from '@services/database.js';
const now = () => Math.floor(Date.now() / 1000);

const _pendingCreations = new Map();

export default class Seal {
	constructor(user, data) {
		this.user = user;
		this.data = data;
	}

	// data getters
	get name() { return SealSkins[this.data.skin].name }
	get nameshort() { return SealSkins[this.data.skin].nameshort }
	get nameno() { return SealSkins[this.data.skin].nameno }
	get namegive() { return SealSkins[this.data.skin].namegive }
	get namewith() { return SealSkins[this.data.skin].namewith }
	get levelXP() {
		return Math.pow(2, this.data.level) * 200;
	}
	// +setters
	// vitals
	get hunger() { return this.data.hunger } set hunger(v) { this.data.hunger = v }
	get thirst() { return this.data.thirst } set thirst(v) { this.data.thirst = v }
	get energy() { return this.data.energy } set energy(v) { this.data.energy = v }
	get health() { return this.data.health } set health(v) { this.data.health = v }
	get effects() { return this.data.effects }
	get levelXP() {
		return Math.pow(2, this.data.level) * 200;
	}

	get strength() {
		let strength = this.data.strength;
		if (this.isEffectActive("coffee"))
			strength *= 2;
		if (this.isEffectActive("pill"))
			strength *= this.pillBoosts.strength;
		return strength;
	}
	get agility() {
		let agility = this.data.agility;
		if (this.isEffectActive("beer"))
			agility /= 2;
		if (this.isEffectActive("pill"))
			agility *= this.pillBoosts.agility;
		if (this.isEffectActive("energy"))
			agility *= 2;
		return Math.floor(agility);
	}
	get intellect() {
		let intellect = this.data.intellect;
		if (this.isEffectActive("beer"))
			intellect /= 2;
		if (this.isEffectActive("coffee"))
			intellect *= 2;
		if (this.isEffectActive("pill"))
			intellect *= this.pillBoosts.intellect;
		return Math.floor(intellect);
	}
	get endurance() {
		let endurance = this.data.endurance;
		if (this.isEffectActive("pill"))
			endurance *= this.pillBoosts.endurance;
		return endurance;
	}

	get pillPotency() {
		return 240 + Math.pow(this.data.gpotency, 0.6) * 50;
	}
	get pillEfficiency() {
		return Math.floor(3 + Math.pow(this.data.gefficiency / 1.5, 0.35) * 2);
	}
	get pillStats() {
		const health = Math.floor(15 * Math.log((this.data.ghealth + 1) * 4));
		const hunger = Math.floor(12 * Math.log((this.data.ghunger + 1) * 5));
		const thirst = Math.floor(20 * Math.log((this.data.gthirst + 1) * 5));
		const energy = Math.floor(15 * Math.log((this.data.genergy + 1) * 5));
		return { health, hunger, thirst, energy };
	}
	get pillBoosts() {
		const strength = Math.floor(Math.log((this.data.gstrength + 1) * 3));
		const agility = Math.floor(Math.log((this.data.gagility + 1) * 3));
		const intellect = Math.floor(Math.log((this.data.gintellect + 1) * 3));
		const endurance = Math.floor(Math.log((this.data.gendurance + 1) * 3));
		return { strength, agility, intellect, endurance };
	}
	feedPill() {
		const stats = this.pillStats;
		this.data.health += stats.health;
		this.data.hunger += stats.hunger;
		this.data.thirst += stats.thirst;
		this.data.energy += stats.energy;
		this.applyEffect("pill", this.pillPotency);
	}


	/*
		public methods
	*/
	async tick(ctx) {
		const updated = this.data.updated;
		const seconds = now() - updated;
		this.data.updated = now();
		if (updated == 0) return;

		// Update hunger and thirst
		const hungerDeplete = seconds / 2400;
		const thirstDeplete = seconds / 1800;
		this.hunger -= hungerDeplete;
		this.thirst -= thirstDeplete;

		// Convert negative hunger/thirst points into health loss
		if (this.hunger < 30) {
			this.health -= hungerDeplete;
			this.energy -= Math.floor(hungerDeplete / 4);
		}
		if (this.thirst < 30) {
			this.health -= thirstDeplete;
			this.energy -= Math.floor(thirstDeplete / 4);
		}
		if (this.health < 250) {
			this.energy += Math.floor((this.health - 250) / 3); // + negative
		}
		// Regen
		if (this.hunger > 80 && this.thirst > 80) {
			this.energy += seconds / 25;
			this.health += seconds / 10;
		}

		// Cap stats (hunger has soft cap)
		this.health = Math.min(Math.max(this.health, 0), 1000);
		this.thirst = Math.min(Math.max(this.thirst, 0), 100);
		this.energy = Math.min(Math.max(this.energy, 0), 100);

		if (this.hunger > 120) {
			// throw up
			this.hunger = 75 - Math.random() * 15;
			if (ctx != null) {
				await ctx.reply(`🤮 Вы перекормили своего ${this.nameno}, и его вырвало.
🌯 Очки голода сброшены до <b>${Math.floor(this.hunger)}/100</b>`);
			}
		} else if (this.hunger < 0) {
			this.hunger = 0;
		}

		// Level up
		while (this.data.experience > this.levelXP) {
			this.data.experience -= this.levelXP;
			this.data.level += 1;
			this.data.credits += 1;
			if (ctx != null) {
				let levelupText = `🔰 Поздравляем! Ваш ${this.nameshort} теперь <b>${this.data.level} уровня</b>\n+1 Кредит 🍥`;
				if (this.data.level > 5 && !this.data.skins.includes(10)) {
					levelupText += "\n🎉 Вам разблокирован скин 🐋 <b>Морж</b>! Оденьте его командой <code>-скин 10</code>";
					this.data.skins.push(10);
				}
				if (this.data.level == 7) {
					levelupText += "\n🎉 Вам разблокирована шахта! Используйте команду <code>-шахта</code>";
				}
				if (this.data.level > 12 && !this.data.skins.includes(11)) {
					levelupText += "\n🎉 Вам разблокирован скин 🦌 <b>Олень</b>! Оденьте его командой <code>-скин 11</code>";
					this.data.skins.push(11);
				}
				await ctx.reply(levelupText);
			}
		}

		// Optimize effects dictionary
		for (const effect of Object.keys(this.effects)) {
			if (!this.isEffectActive(effect)) {
				delete this.effects[effect];
			}
		}
	}

	getProperties() {
		let { strength, agility, intellect, endurance } = this.data;
		return { strength, agility, intellect, endurance };
	}

	applyEffect(etype, duration) {
		this.effects[etype] = now() + duration;
	}
	isEffectActive(etype) {
		return (this.effects[etype] ?? 0) > now();
	}

	async save() {
		const data = { ...this.data };
		data.skins = db.array(data.skins);
		data.effects = db.array(data.effects);
		await db`UPDATE seals SET ${db(data)} WHERE owner=${this.user.id}`;
	}


	/*
		private methods
	*/
	static async _create(owner) {
		return (await db`INSERT INTO seals ${db({ owner })} RETURNING *`)[0];
	}

	static async get(owner) {
		let data;

		// deduplicate promises
		if (_pendingCreations.has(owner)) {
			console.warn("Found duplicate creation promise");
			await _pendingCreations.get(owner);
		}
		// continue as normal
		data = (await db`SELECT * FROM seals WHERE owner=${owner}`)[0];

		if (data == null) {
			const createPromise = Seal._create(owner).finally(() => {
				_pendingCreations.delete(owner);
			});
			_pendingCreations.set(owner, createPromise);
			data = await createPromise;
		}

		if (data.skins == null) data.skins = [];
		if (!data.skins.includes(0)) data.skins.push(0);
		if (data.effects == null) data.effects = {};

		return data;
	}
}