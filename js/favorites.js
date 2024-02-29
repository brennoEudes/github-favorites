import { GithubUser } from "./githubUser.js";

// classe que vai conter a lógica dos dados
// como os dados serão estruturados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector("#app");
    this.load();

    // Como usamos o "static" não precisamos do "new" aqui. Como recebemos uma promise, devemos usas o then aqui tb:
    GithubUser.search("diego3g").then((user) => console.log(user));
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];

    console.log(this.entries);
  }

  // salvando os entries no localstorage:
  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries)); // JSON Stringify transforma obj javascript em obj tipo txt string p/ salvar no localstorage!
  }

  async add(username) {
    // console.log(username);

    // tente executar esse código:
    try {
      // verifica se o usuário já existe (devolve um obj):
      const userExists = this.entries.find((entry) => entry.login === username);

      //console.log(userExists);

      if (userExists) {
        throw new Error("Usuário já cadastrado!");
      }

      const user = await GithubUser.search(username);
      console.log(user);

      // se der ruim, capture o erro e lance a seguinte msg de erro p/ q o catch execute-a:
      if (user.login === undefined) {
        throw new Error("Usuário não encontrado!");
      }

      this.entries = [user, ...this.entries]; // cria novo array, c/ novo usuário e tb os antigos (spread operator)

      this.update(); // atualiza a aplicação
      this.save(); // salva no localstorage
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    // Higher-order functions
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    ); // se o entry NÃO for diferente do user, será deletado! (retorna true ou false)

    this.entries = filteredEntries; // reatribui um novo array, sem acabar com o antigo.
    this.update();
    this.save(); // tb salva aqui p/ evitar erros
  }
}

// classe que vai criar a visualização e eventos do html
export class FavoritesView extends Favorites {
  /* extends: une as classes! Faz com q esta classe herde as propriedades da anterior */
  constructor(root) {
    super(
      root
    ); /* É a linha que liga as classes! Chama o construtor da 1º classe e passe este root p/ela! */
    // console.log(this.root);

    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");
      // console.log(value);
      this.add(value);
    };
  }

  update() {
    this.removeAllTr();

    // P/ CADA usuário de "entries" damos o console.log:
    this.entries.forEach((user) => {
      const row = this.createRow();

      row.querySelector(
        ".user img"
      ).src = `http://github.com/${user.login}.png`;

      row.querySelector(".user img").alt = `Imagem de ${user.name}`;
      row.querySelector(".user a").href = `http://github.com/${user.login}`;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;

      // se não for necessário colocar + de um evento de clique, pode-se usar "onclick":
      row.querySelector(".remove").onclick = () => {
        const isOK = confirm("Tem certeza de que deseja deletar esse perfil?"); // confirm é metodo JS q devolve boolean

        if (isOK) {
          this.delete(user);
        }
      };

      this.tbody.append(row); // append é funcionalidade da DOM q recebe um elemento HTMl criado na DOM!
    });
  }

  createRow() {
    // Criando elemento HTML pela DOM:
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <td class="user">
      <img src="http://github.com/brennoeudes.png" alt="" />
      <a href="github.com/brennoeudes" target="_blank">
        <p>Brenno Eudes</p>
        <span>brennoeudes</span>
      </a>
    </td>
    <td class="repositories">45</td>
    <td class="followers">10973</td>
    <td><button class="remove">&times;</button></td>
       `;
    // // Inserindo o content no elemento HTML:
    //    tr.innerHTML = content;

    return tr;
  }

  removeAllTr() {
    // // pegando o elemento no html:
    // const tbody = this.root.querySelector("table tbody"); (depois o colocamos na class FavoriteView!)

    // pegando todas as linhas e p/ cada linha por vez, executando a fcn recebend o "tr" desejado:
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
