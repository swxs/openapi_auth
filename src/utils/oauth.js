const OAUTH_QUERY_KEYS = ['client_id', 'redirect_uri', 'state', 'scope']

export function oauthQueryFromRoute(route) {
  const query = {}
  for (const key of OAUTH_QUERY_KEYS) {
    if (route.query[key]) {
      query[key] = route.query[key]
    }
  }
  return query
}

export function navQueryFromRoute(route, extra = {}) {
  return { ...oauthQueryFromRoute(route), ...extra }
}
