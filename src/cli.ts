// @ts-nocheck
import chalk from 'chalk';
import Vorpal from 'vorpal';
import { setCredentials, setOrg } from './api/github-wrapper';
import * as db from './db/db';
const vorpal = new Vorpal();

vorpal
    .command('refresh', 'Refreshes pull info from github')
    .action((args: any, callback: () => void) => {
        this.log(chalk.green('Refreshed pulls'));
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
            setCredentials(answers.username, answers.pat);
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
            setOrg(answers.org);
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