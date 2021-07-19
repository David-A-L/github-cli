// TODO get https://api.github.com/orgs/ramda/repos
//  get all pulls https://api.github.com/repos/ramda/{repo}/pulls
import fetch, { Headers } from 'node-fetch';


let auth: { username: string, personalAccessToken: string };
let orgName = 'ramda';

const setOrg = (org: string) => {
    orgName = org;
}

const setCredentials = (username: string, personalAccessToken: string) => {
    auth = { username, personalAccessToken };
}
const makeGetRequest = (url: string) => {
    let promise;
    if (auth) {
        const headers = new Headers();
        headers.set('Authorization', 'Basic ' + Buffer.from(auth.username + ":" + auth.personalAccessToken).toString('base64'));
        promise = fetch(url, {
            method: 'GET',
            headers: headers,
        });
    }
    else {
        promise = fetch(url);
    }

    return promise
        .then(response => {
            if (response.status !== 200) throw new Error(`${url} returned ${response.status}`);
            return response.json();
        });
}

const getRepoPulls = (url: string) => {
    // TODO real pagination to pull more data
    return makeGetRequest(`${url}?page=1&per_page=100&state=all`);
}

const getOrgPulls = async () => {
    const pullResults = await makeGetRequest(`https://api.github.com/orgs/${orgName}/repos`)
        .then(body => {
            return Promise.all(body.map(
                (repo: any) => getRepoPulls(repo.pulls_url.replace('{/number}', ''))
            ));
        });
    return pullResults.reduce(function (prev: any[], cur) {
        return prev.concat(cur);
    }, []);
}

export { setCredentials, setOrg, getOrgPulls }