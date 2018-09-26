(async function __main() {
	const vo = require('vo');

	try {
		const proxy_list = await require('./source/getProxyList').getProxyList;

		// main loop of the programm
		const nightmareLoop = require('./source/nightmareLoop').nigthmareLoop;
		vo(nightmareLoop(proxy_list, process.argv))(function (error) {
			console.log('done');
		});
	} catch (e) {
		console.error(`Error: ${e}`);
	}
})();