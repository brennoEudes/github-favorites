// Classe que criar um método estático:
export class GithubUser {
    static search(username) {
      const endPoint = `https://api.github.com/users/${username}`; // busca dados na API
  
      return fetch(endPoint) // recebe os dados da API
        .then((data) => data.json()) // transforma em JSON
        .then(({ login, name, public_repos, followers }) => ({
          // pega somente o que quero e retorna um obj
          login,
          name,
          public_repos,
          followers,
        })); // group operator: permite a a arrow fcn retorne um obj diretamente
  
      // Mesma forma acima só q mais extensa (não desestruturada):
      // .then((data) => ({ // pega somente o que quero e retorna um obj
      //   login: data.login,
      //   name: data.name,
      //   public_repos: data.public_repos,
      //   followers: data.followers
      // })); // group operator: permite a arrow fcn retorne um obj diretamente
    }
  }