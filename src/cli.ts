// @ts-nocheck
import chalk from 'chalk';
import Vorpal from 'vorpal';
import * as api from './api/github-wrapper';
import * as db from './db/db';
const vorpal = new Vorpal();

vorpal
    .command('refresh', 'Refreshes pull info from github')
    .action(async function (args: any, callback: () => void) {
        try {
            await db.reset();
            const pulls = await api.getOrgPulls();
            if (!pulls) throw new Error('Could not fetch pulls');
            await db.savePulls(pulls);
            this.log(chalk.green(`Refreshed ${pulls.length} pulls`));

        } catch (err) {
            this.log(chalk.red(err));
        }
        callback();
    });

vorpal
    .command('dump', 'Output all saved pulls')
    .action(async function (args: any, callback: () => void) {
        try {
            const pulls = await db.getPulls();
            this.log(pulls.map(p => {
                return { id: p.id, link: p.data.url, title: p.data.title };
            }));

        } catch (err) {
            this.log(chalk.red(err));
        }
        callback();
    });


vorpal
    .command('auth', 'Optionally use your github credentials')
    .action(function (args, callback) {
        this.prompt([
            {
                type: 'input',
                name: 'username',
                message: chalk.yellow('username: ')
            },
            {
                type: 'password',
                name: 'pat',
                message: chalk.yellow('personal access token: ')
            }
        ], answers => {
            api.setCredentials(answers.username, answers.pat);
            this.log(chalk.green('Credentials saved'));
            callback();
        });
    });

vorpal
    .command('set', 'Set the org that we populate pulls from')
    .action(function (args, callback) {
        this.prompt([
            {
                type: 'input',
                name: 'org',
                message: chalk.yellow('organization name: ')
            }
        ], async answers => {
            await db.reset();
            api.setOrg(answers.org);
            this.log(chalk.green(`Targeting repos under ${answers.org}`));
            callback();
        });
    });

vorpal.find('exit').remove();
vorpal
    .command('exit', 'Exits the app')
    .action(async function (args: any, callback: () => void) {
        await db.close()
            .then(() => this.log(chalk.green('Db Connection closed')))
            .catch(err => this.error(chalk.red(err.message)));
        process.exit(0);
    });

const run = async () => {
    db.init()
        .then(() => {
            console.log(chalk.green('Database connected'));

            vorpal
                .delimiter('gh-cli$')
                .show();
        })
        .catch(err => console.error(chalk.red(err.message)));;
}

run()