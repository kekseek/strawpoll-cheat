const Nightmare = require('nightmare'),
nightmare = new Nightmare({ show: true })

exports.formProxyList = function() {
    const proxies_list = [];

    nightmare
        .goto('http://spys.one')
        .wait(400)
        .evaluate(proxies_list => {
            proxies_list = Array.from(document.querySelectorAll('tr.spy1xx td:first-child font.spy14'));
        }, proxies_list)
        .end()
        .then(console.log(`Proxies are parsed.` + proxies_list))
		.catch(error => {
			console.error('Search failed:', error)
		})
}

exports.formProxyList();