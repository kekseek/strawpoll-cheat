function parseConsoleArgs() {
	const strawpoll_id       = process.argv[2];
	const fields_to_click    = process.argv.slice(3);

	if (!strawpoll_id) {
		throw new Error("Invalid input: "
			+ "put strawpoll id (example:"
			+ "node this_script.js [strawpoll id] [fields])"
		);
	}

	if (!fields_to_click.length) {
		throw new Error("Invalid input: "
			+ "put numbers of fields you want to click (example:"
			+ "node this_script.js [strawpoll id] [fields(1 2 3)])"
		);
	}
	return { strawpoll_id, fields_to_click };
}

function* nigthmareLoop(proxy_list) {
	console.log(proxy_list);

	const Nightmare          = require('nightmare'),
		parsedConsoleObj     = parseConsoleArgs(),
		strawpoll_id         = parsedConsoleObj.strawpoll_id,
		fields_to_click      = parsedConsoleObj.fields_to_click;
	
	for (let i = 0, l = proxy_list.length; i < l; i++) {
		yield nightmare 			=  Nightmare({
			switches: { 
				'proxy-server': proxy_list[i]
			},
			show: true 
		});

		yield nightmare
			.goto(`https://www.strawpoll.me/${strawpoll_id}`)
			.wait('form[data-form-type="poll-vote"]')
			
			.evaluate(fields_to_click => {
				let b = Array.from(document.querySelectorAll('#field-options input'));
				
				b.forEach((field, ind) => {
					fields_to_click.forEach(user_req => {
						if (ind + 1 == Number(user_req)) {
							field.click();
						}
					})
				});
			}, fields_to_click)
			
			.click('button[type="submit"]')
			.wait('span#vote-count' || 'p.error')
			.end()
			.then(console.log(`Voted. Number ${i + 1}`))
			.catch(error => {
				console.error('Search failed:', error)
			})
	}
};


async function main() {
	const vo             = require('vo');
	const proxy_list     = await require('./proxy_list').formProxyList;

	vo(nigthmareLoop(proxy_list))(function (error) {
		console.log('done');
	});
}

main();