# github-cli
A cli for interacting with and analyzing github data

To use the `auth` command and increase request limits, enter your github username and a personal access token (https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token)

## Usage
```npm run start```
```
gh-cli$ help

  Commands:

    help [command...]  Provides help for a given command.
    refresh            Refreshes pull info from github
    dump               Output all saved pulls
    auth               Optionally use your github credentials
    set                Set the org that we populate pulls from
    exit               Exits the app
gh-cli$ auth
username: David-A-L
personal access token: *******************
Credentials saved
gh-cli$ refresh
Refreshed 371 pulls
gh-cli$ dump
[
  {
    id: 25240192,
    link: 'https://api.github.com/repos/ramda/ramdangular/pulls/1',
    title: 'Update global reference from ramda to R'
  },
  {
    id: 25240445,
    link: 'https://api.github.com/repos/ramda/ramdangular/pulls/2',
    title: 'update - license section with names from ramda.js'
  },
...
```