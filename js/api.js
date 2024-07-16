export class GitHubApi {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`;

    return fetch(endpoint)
      .then((data) => data.json())
      .then(
        ({ login, name, avatar_url, html_url, public_repos, followers }) => ({
          login,
          name,
          avatar_url,
          html_url,
          public_repos,
          followers,
        })
      );
  }
}
