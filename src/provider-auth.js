// pretend this is firebase, netlify, or auth0's code.
// you shouldn't have to implement something like this in your own app
const localStorageKey = '__auth_provider_token__';

async function getToken() {
  // if we were a real auth provider, this is where we would make a request
  // to retrieve the user's token. (It's a bit more complicated than that...
  // but you're probably not an auth provider so you don't need to worry about it).
  return window.localStorage.getItem(localStorageKey);
}

function handleUserResponse(response) {
  //il faut mettre console.log de response pour faire la déstructuration (connaitre quoi distructurer)
  window.localStorage.setItem(localStorageKey, response.token);

  return response;
}

function login({ email, password }) {
  return client('login', { email, password }).then(handleUserResponse);
}

function register({ email, password }) {
  return client('register', { email, password }).then(handleUserResponse);
}

async function logout() {
  window.localStorage.removeItem(localStorageKey);
}

// an auth provider wouldn't use your client, they'd have their own
// so that's why we're not just re-using the client
// const authURL = "https://reqres.in/api";

async function client(endpoint, data) {
  const config = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  };

  return window
    .fetch(`${import.meta.env.VITE_REACT_API_URL}/${endpoint}`, config)
    .then(async (response) => {
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    });
}

export { getToken, login, register, logout, localStorageKey };
