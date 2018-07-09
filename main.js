function parseConsoleArgs() {
	const strawpoll_id 		= process.argv[2];
	const fields_to_click 	= process.argv.slice(3);

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

function* nigthmareLoop() {
	var Nightmare 		= require('nightmare'),
	nightmare 			= Nightmare({ show: true }),
	parsedConsoleObj 	= parseConsoleArgs();
	
	for (let i = 0; i < 100; i++) {
		yield nightmare
		.goto(`https://www.strawpoll.me/${parsedConsoleObj.strawpoll_id}`)
		.wait('form[data-form-type="poll-vote"]')
		
		.evaluate(parsedConsoleObj => {
			let b = Array.from(document.querySelectorAll('#field-options input'));
			
			b.forEach((field, ind) => {
				parsedConsoleObj.fields_to_click.forEach(user_req => {
					if (ind + 1 == Number(user_req)) {
						field.click();
					}
				})
			});
		}, parsedConsoleObj)
		
		.click('button[type="submit"]')
		.wait('span#vote-count')
		.then(console.log(`Voted. Number ${i + 1}`))
		.catch(error => {
			console.error('Search failed:', error)
		})
	}
};


function main() {
	vo = require('vo');
	
	vo(nigthmareLoop)(function (error) {
		console.log('done');
	});
}

main();
