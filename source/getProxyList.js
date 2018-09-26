// promise which returns proxy list
exports.getProxyList = new Promise(async function (resolve, reject) {
    const Nightmare = require('nightmare'),
        nightmare = new Nightmare({
            show: false
        });

    let proxies_list = null;

    await nightmare
        .goto('http://spys.one')
        .wait(400)
        .evaluate(() => {
            const result = [];
            for (let element of Array.from(document
                    .querySelectorAll('tr[onmouseover="this.style.background=' +
                        '\'#002424\'"] td:first-child > font'))) {
                result.push(element.innerHTML);
            }
            return result;
        })
        .end()
        .then(result => {
            proxies_list = result;
        })
        .catch(error => {
            console.error('Search failed:', error);
            reject(new Error('Proxies was not parsed.'));
        });

    resolve(proxies_list);
});