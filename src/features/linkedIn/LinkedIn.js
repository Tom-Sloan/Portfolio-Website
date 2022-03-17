const client_id = '8606e3dokg0z85';
const client_secret = 'syQOzOP9SsT254cQ';
const redirectURI = 'http://localhost:3000/resume';
let token;

const LinkedIn = {
    getAccessToken () {
        if(token) {
            return token;
        }

        const accessToken = window.location.href.match(/access_token=([^&]*)/);
        const expiresIn = window.location.href.match(/expires_in=([^&]*)/);

        if (accessToken && expiresIn) {
            token = accessToken[1];
            const expires_in = Number(expiresIn[1]);

            window.setTimeout(() => token = '', expires_in * 1000);
            window.history.pushState('Access Token', "", '/about');
            return token;
        } else {
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = accessURL;
        }
    },
}