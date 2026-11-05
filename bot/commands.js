import { readdir } from "bun:fs/promises";
import { join, extname } from "bun:path";
import { fileURLToPath } from "bun:url";

const path = join(fileURLToPath(new URL(".", import.meta.url)), "../commands");

async function collectCommands(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const modules = {};
	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			// discover
			const nested = await collectCommands(fullPath);
			for (const [k, v] of Object.entries(nested))
				modules[k] = v;
		} else if (entry.isFile() && entry.name.endsWith(".js")) {
			// add command
			modules[fullPath] = entry.name;
		}
	}
	return modules;
}

export default async function importCommands() {
	const modules = Object.entries(await collectCommands(path));
	const collection = await Promise.all(modules.map(c => import(c[0])));

	const validate = (command, entry) => {
		if (!(command.trigger instanceof RegExp)) {
			console.error(`\x1b[31mCommand ${entry} does not include 'trigger' of type regex\x1b[0m`);
			process.exit(1);
		} else {
			if (command.trigger.flags.includes("g")) {
				console.warn(`\x1b[33mTrigger of command ${entry} does not need global flag\x1b[0m`);
			}
		}
		if (typeof command.execute !== "function") {
			console.error(`\x1b[31mCommand ${entry} does not include 'execute' of type function\x1b[0m`);
			process.exit(1);
		}
	};

	const commands = [];
	for (const i in modules) {
		const [ _, entry ] = modules[i];
		const command = collection[i];
		const commandName = entry.replace(".js", "");
		validate(command.default, commandName);
		command.default.constructor.commandName = commandName;
		commands.push(command.default);
	}
	return commands;
}