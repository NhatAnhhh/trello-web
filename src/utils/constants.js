let apiRoot = ''

if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:5173/'
}

if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-ouqv.onrender.com'
}
export const API_ROOT = apiRoot

