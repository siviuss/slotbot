import db from '@services/database.js';
const now = () => { return Math.floor(Date.now() / 1000) };

export async function fetchMarket() {
	return await db`SELECT * FROM gem_market`;
}
export async function putMarket(user, gem, money, buy) {
	await db`INSERT INTO gem_market ${db({ user, gem, money, buy, placed: now() })}`;
}
export async function removeMarket(id) {
	return await db`DELETE FROM gem_market WHERE id=${id} RETURNING *`;
}