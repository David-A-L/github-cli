// TODO get https://api.github.com/orgs/ramda/repos
//  get all pulls https://api.github.com/repos/ramda/{repo}/pulls

let auth;
let orgName = 'ramda';

const setOrg = (org: string) => {
    orgName = org;
}

const setCredentials = (username: string, personalAccessToken: string) => {
    auth = { username, personalAccessToken };
}

const refresh = async () => {
    return fetch('https://api.github.com/orgs/ramda/repos')
        .then(response => response.json());

}

export { setCredentials, setOrg, refresh }