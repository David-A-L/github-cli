import fetch, { Headers, Response } from 'node-fetch';
import linkParse from 'parse-link-header';


let auth: { username: string, personalAccessToken: string };
let orgName = 'ramda';

const setOrg = (org: string) => {
    orgName = org;
}

const setCredentials = (username: string, personalAccessToken: string) => {
    auth = { username, personalAccessToken };
}
const makeGetRequest = (url: string): Promise<Response> => {
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
            return response;
        });
}

// TODO potentially fetch all pages at once for efficiency?
const getRepoPulls = (url: string) => {
    return new Promise(async (res) => {
        let pulls: any = [];
        let currentResponse = await makeGetRequest(`${url}?page=1&per_page=100&state=all`);

        pulls = pulls.concat(await currentResponse.json());

        while (currentResponse.headers.has('Link')) {
            const link = linkParse(currentResponse.headers.get('Link')!) || {};
            if (!link.next) break;
            currentResponse = await makeGetRequest(link.next.url);
            pulls = pulls.concat(await currentResponse.json());
        }

        res(pulls);
    });

}

const getOrgPulls = async () => {
    const pullResults = await makeGetRequest(`https://api.github.com/orgs/${orgName}/repos`)
        .then(response => response.json())
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