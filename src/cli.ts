import Vorpal from 'vorpal';
const vorpal = new Vorpal();

// TODO get https://api.github.com/orgs/ramda/repos
//  get all pulls https://api.github.com/repos/ramda/{repo}/pulls

vorpal
    .command('refresh', 'Refreshes pull info from github')
    // @ts-ignore
    .action((args: any, callback: () => void) => {
        console.log('Refreshed pulls');
        callback();
    });

vorpal
    .delimiter('gh-cli$')
    .show();