const playingUserTemplate = document.createElement("template");
playingUserTemplate.innerHTML = `
    <link rel="stylesheet" href="../webComponents/playingUser/playingUser.css">

    <div class="mainContainer">
        <h2 id="userPosition">1º</h2>
        <div class="player">
            <img src="../assets/colorful_teletubbies_faces.png" alt="Foto Jugador 2" id="playerImg">
            <div class="user-info-points">
                <h2 id="playerName">MayLonala</h2>
                <h3>Points: <span id="playerPoints">650</span></h3>
            </div>
        </div>
    </div>

`;

class PlayingUser extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(playingUserTemplate.content.cloneNode(true));
    }
}

customElements.define("playing-user", PlayingUser);
