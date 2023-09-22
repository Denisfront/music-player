// // Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
// // const token = 'BQB94lEu0lzspwf7o_9URmhWs1agJI6WmuqcPDKsbe4yY8smk_pHJqd8NxM1hNcioyD0ZzZD2iZi7saYD8oELMOhvxGOmGj5aep8Il2HBKaB9i7onMePDWMY1fIJqzs_EyFs0TsnD3q8j5OhqlyVmzZWVPvRXesnZz1BcJMBeO5F-D5oOPs5Fs8IJHIiY1hOiexpk9RMWWVdv0gYz0jX-VjJlmhwAeaW-AFjJ-WFWpMGvBFhXvMZWxtlL_6cbJlgp5TuLmhnWpkArPv__YO6Cj_9xPPo';
// async function fetchWebApi(endpoint, method, body) {
//   const res = await fetch(`https://api.spotify.com/${endpoint}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     method,
//     body:JSON.stringify(body)
//   });
//   return await res.json();
// }

// async function getTopTracks(){
//   // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
//   return (await fetchWebApi(
//     'v1/me/top/tracks?time_range=short_term&limit=5', 'GET'
//   )).items;
// }

// const topTracks = await getTopTracks();
// console.log(
//   topTracks?.map(
//     ({name, artists}) =>
//       `${name} by ${artists.map(artist => artist.name).join(', ')}`
//   )
// );

const clientId = '68d4f570ac6f44e18e8e6f2ee4cd1d32';
const redirectUri = 'http://localhost:8888/callback';

let credentials = {
  access_token: '',
  expires_in: 3600,
  token_type: 'Bearer',
};

export function getToken() {
  return fetch(
    'https://accounts.spotify.com/api/token?grant_type=client_credentials&=redirect_uri=http://localhost:8080',
    {
      method: 'post',
      headers: {
        Authorization:
          'Basic NjhkNGY1NzBhYzZmNDRlMThlOGU2ZjJlZTRjZDFkMzI6Nzc2N2E0NjZhNzE0NDZiN2JiY2FmMzBjMDFhMzQ2YjM=',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )
    .then(response => response.json())
    .then(data => {
      credentials = data;
    });
}

export function getTopTracks() {
  return fetch(
    `https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5`,
    {
      headers: {
        Authorization: `Bearer ${credentials.access_token}`,
      },
      method: 'GET',
    },
  );
}

export function searchTracks() {
  return fetch(`https://api.spotify.com/v1/search`, {
    method: 'post',
  });
}
