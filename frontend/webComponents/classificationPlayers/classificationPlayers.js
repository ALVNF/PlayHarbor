const classificationPlayersTemplate = document.createElement("template");
classificationPlayersTemplate.innerHTML = `
    <link rel="stylesheet" href="../webComponents/classificationPlayers/classificationPlayers.css">
    <table class="table">
      <thead>
        <tr class="header">
          <th>Rank</th>
          <th>User</th>
          <th>Total Points</th>
        </tr>
      </thead>
      <tbody id="player-rows">
        <!-- Player rows will be inserted here -->
      </tbody>
    </table>
`;

class ClassificationPlayers extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(classificationPlayersTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    this.loadClassification();
  }

  loadClassification() {
    getPuntos().then(data => {
        const playersArray = this.transformDataToArray(data);
        this.updateLeaderboard(playersArray);
    }).catch(error => {
        console.error('Error fetching classification data:', error);
    });
  }

  transformDataToArray(data) {
    return Object.keys(data).map((username, index) => ({
        rank: index + 1,
        user: username,
        profilePicture: '../assets/battle_ready_warrior_icon.png',
        totalPoints: data[username]
    }));
}

updateLeaderboard(playersArray) {
  const sortedPlayers = playersArray.sort((a, b) => b.totalPoints - a.totalPoints);
  const rows = sortedPlayers.map((player, index) => {
    return `
      <tr>
        <td>${index + 1}</td>
        <td>
          <img class="user-icon" src="${player.profilePicture}" alt="${player.user}">
          <span class="user-name">${player.user}</span>
        </td>
        <td>${player.totalPoints}</td>
      </tr>
    `;
  }).join('');

  this.shadowRoot.querySelector('#player-rows').innerHTML = rows;
}

}

customElements.define("classification-players", ClassificationPlayers);
