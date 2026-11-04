import db from '@services/database.js';
import { sanitize } from '@services/util.js';
import permissions from '../data/Permissions.json';

const _pendingCreations = new Map();

export default class User {
	constructor(id, data) {
		this.id = Number(id);
		this.data = data;
	}

	static async get(options, create) {
		if (options.id == null)
			throw new TypeError("Failed to query user, expected 'id' field in options.");

		let data;
		// deduplicate promises
		if (_pendingCreations.has(options.id)) {
			console.warn("Found duplicate creation promise");
			await _pendingCreations.get(options.id);
		}
		// continue as normal
		data = (await db`SELECT * FROM users WHERE id=${Number(options.id)}`)[0];

		if (data == null) {
			if (!create) return;

			const createPromise = User._createUser(options).finally(() => {
				_pendingCreations.delete(options.id);
			});
			_pendingCreations.set(options.id, createPromise);
			data = await createPromise;
		}

		return data;
	}
	static async fromID(id, create=false) {
		const data = await User.get({ id }, create);
		if (data == null) return;
		return new User(id, data);
	}
	static async fromTelegram(author, create=true) {
		const data = await User.get({
			id: author.id,
			username: author.username,
			nickname: author.first_name
		}, create);
		if (data == null) return;
		return new User(author.id, data);
	}
	static async fromHandle(handle) {
		const data = (await db`SELECT * FROM users WHERE username=${handle.substring(1)}`)[0];
		if (data == null) return null;
		return new User(data.id, data);
	}

	// private methods
	static async _createUser(options) {
		let params;
		if (options.nickname == null) { // create by id
			params = {
				id: options.id
			};
		} else { // create by tg object
			params = {
				id: options.id,
				username: options.username,
				nickname: options.nickname
			};
		}
		return (await db`INSERT INTO users ${db(params)} RETURNING *`)[0];
	}

	// data getters
	get username() { return this.data.username }
	get nickname() { return this.data.nickname }
	get uid() { return this.data.id }
	get superadmin() { return permissions.superadmin.indexOf(this.id) != -1 }
	
	// public methods
	async save() {
		if (this.locked)
			throw new Error("User object is locked");
		this.locked = true;
		const data = {...this.data};
		data.upgrades = db.array(data.upgrades);
		await db`UPDATE users SET ${db(data)} WHERE id=${this.id}`;
	}

	get link() {
		if (this.username == null) {
			// con: not clickable on desktop
			return `<a href="tg://openmessage?user_id=${this.id}">${sanitize(this.nickname)}</a>`;
		} else {
			return `<a href="https://t.me/${this.username}">${sanitize(this.nickname)}</a>`;
		}
	}
	get mention() {
		return `<a href="tg://user?id=${this.id}">${sanitize(this.nickname)}</a>`;
	}
}