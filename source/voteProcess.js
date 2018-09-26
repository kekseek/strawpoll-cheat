exports.voteProcess = function (use_proxy, strawpoll_id, fields_to_click, Nightmare) {
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

    browser_window    
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
};