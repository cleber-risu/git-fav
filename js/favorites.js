import { GitHubApi } from "./api.js";

class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@gh-favorites")) || [];
  }

  save() {
    localStorage.setItem("@gh-favorites", JSON.stringify(this.entries));
  }

  async add(username) {
    const userExists = this.entries.find((user) => user.login === username);

    try {
      if (userExists) {
        throw new Error("Usuário já existente");
      }

      const githubUser = await GitHubApi.search(username);

      if (githubUser.login === undefined) {
        throw new Error("Usuário não encontrado!");
      }

      this.entries = [githubUser, ...this.entries];

      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(userToDelete) {
    const filteredEntries = this.entries.filter(
      (user) => user.login !== userToDelete.login
    );
    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.onAdd();
  }

  onAdd() {
    const form = this.root.querySelector(".search");
    const input = form.querySelector("input");

    form.onsubmit = (event) => {
      event.preventDefault();
      this.add(input.value);
      input.value = "";
      input.focus();
    };
  }

  update() {
    this.deleteRows();

    this.entries.forEach((user) => {
      const row = this.createRow();
      row.querySelector(".user img").src = user.avatar_url;
      row.querySelector(".user img").alt = user.name;

      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user span").textContent = `/${user.login}`;

      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Deseja deletar este favorito?");
        if (isOk) {
          this.delete(user);
        }
      };

      this.tbody.append(row);
    });
  }

  createRow() {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <tr>
        <td class="user">
          <img src="" alt="Usuário">
          <a href="#" target="_blank">
            <p></p>
            <span></span>
          </a>
        </td>
        <td class="repositories"></td>
        <td class="followers"></td>
        <td>
          <button class="remove">Remover</button>
        </td>
      </tr>
    `;
    return tr;
  }

  deleteRows() {
    this.tbody.querySelectorAll("tr").forEach((row) => row.remove());
  }
}
