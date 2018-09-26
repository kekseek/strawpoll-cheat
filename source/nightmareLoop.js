// loops function interacting with strawpoll
exports.nigthmareLoop = function* (proxy_list, console_args) {
	const Nightmare = require('nightmare');
	// const voteProcess = require('./voteProcess').voteProcess;
	let parsedConsoleObj, strawpoll_id, fields_to_click, use_proxy;

	console.log(`Proxies:\n${proxy_list.join('\n')}\n`);

	// try to parse console arguments
	try {
		parsedConsoleObj = require('./parseConsoleArgs').parseConsoleArgs(console_args);
		if (!parsedConsoleObj) {
			throw new Error("Args are not parsed.");
		}
		strawpoll_id = parsedConsoleObj.strawpoll_id;
		fields_to_click = parsedConsoleObj.fields_to_click;
		use_proxy = parsedConsoleObj.use_proxy;
	} catch (error) {
		console.log(error);
	}

	// check console args for keyword "proxy"
	// if it hasn't use custom number of iterations
	console.log("Use proxy: ", use_proxy, "\n");
	const votes_count = use_proxy ? proxy_list.length : 10;

	for (let i = 0; i < votes_count; i++) {
		i > 0 ? console.log("Succes.\n") : console.log("Start voting.");

		const browser_window = use_proxy ? 
        Nightmare({
            switches: {
                'proxy-server': proxy_list[i]
            },
            show: true
        }) :
        Nightmare({
            show: true
        });

		yield browser_window    
			.goto(`https://www.strawpoll.me/${strawpoll_id}`)
			.wait('form[data-form-type="poll-vote"]')

			.evaluate(fields_to_click => {
				let checkboxes = Array.from(document.querySelectorAll('#field-options input'));

				if (Array.isArray(fields_to_click)) {
					fields_to_click.forEach(user_req => {
						checkboxes[user_req - 1].click();
					});
				} else {
					checkboxes[fields_to_click - 1].click();
				}
			}, fields_to_click)
			.wait('button[type="submit"]')
			.click('button[type="submit"]')
			.wait('p.total-votes')
			// .evaluate(() => document.querySelector('p.total-votes').innerText)
			.end()
			//.then(console.log)
			.then(console.log(`Number ${i + 1}. Voting...`))
			.catch(error => {
				console.error('Search failed:', error)
			});
		// console.log(`Number ${i + 1}. Voting...`);
	}
};