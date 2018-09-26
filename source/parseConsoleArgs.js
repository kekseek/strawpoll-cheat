exports.parseConsoleArgs = function (console_args) {
	const strawpoll_id = console_args[2];
	const fields_to_click = console_args[3];
	const use_proxy = console_args.includes("-p" || "--proxy");

	if (!strawpoll_id) {
		throw new Error("Invalid input: " +
			"put strawpoll id (example:" +
			"node this_script.js [strawpoll id] [fields])"
		);
	} else {
		console.log(`Strawpoll id: ${strawpoll_id}\n`)
	}

	if (!fields_to_click.length) {
		throw new Error("Invalid input: " +
			"put numbers of fields you want to click (example:" +
			"node this_script.js [strawpoll id] [fields(1 2 3)])"
		);
	} else {
		console.log(`Field to click: ${fields_to_click}\n`);
	}

	return {
		strawpoll_id,
		fields_to_click,
		use_proxy
	};
}