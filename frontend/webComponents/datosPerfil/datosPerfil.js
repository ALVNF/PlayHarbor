const datosPerfilTemplate = document.createElement("template");
datosPerfilTemplate.innerHTML = `
    <link rel="stylesheet" href="../webComponents/datosPerfil/datosPerfil.css">

    <div class="profile">
        <a href="profile.html"><img src="../assets/battle_ready_warrior_icon.png" width="54" alt="Profile" id="usrImg"></a>
        <div id="userStatsContainer">
            <div class="user-info" id="userName">Alvaro</div>
            <div id="lvlInfoContainer">
                <span class="spanStats" id="userExp"><label class="lblProfileStats">Exp.</label> 1500</span>
                <span class="spanStats" id="userLvl"><label class="lblProfileStats">Lvl.</label> 25</span>
            </div>
            <hr>
            <div class="tagList" id="tagList">
                <span class="profileInfo player">Player</span>
                <span class="profileInfo admin">Administrator</span>
                <span class="profileInfo developer">Developer</span>
            </div>
        </div>
    </div>
`;

class DatosPerfil extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(datosPerfilTemplate.content.cloneNode(true));

    }

    connectedCallback() { }

    // loadGameDescription(game) {
    //     this.setGameTitle(game.name);
    //     this.setDeveloperName(game.developer);
    //     this.setGameDescription(game.description);
    //     this.setTagList(game.tags);
    // }

    // setGameCover(cover) {
    //     this.shadowRoot.querySelector("#gameCoverImg").src = cover;
    // }

    // setGameTitle(title) {
    //     this.shadowRoot.querySelector("#gameTitle").innerText = title;
    // }

    // setDeveloperName(developer) {
    //     this.shadowRoot.querySelector("#developerName").innerText = developer;
    // }

    // setGameDescription(description) {
    //     this.shadowRoot.querySelector("#gameDescription").innerText = description;
    // }

    setTagList(tags) {
        const tagList = this.shadowRoot.querySelector("#tagList");

        for (const tag in tags) {
            for (const property in tags[tag]) {
                if (property == "name") {
                    const tagItem = document.createElement("tag-item");
                    console.log(`${property}: ${game.tags[tag][property]}`);
                    tagItem.setTagName(tags[tag][property])
                    tagList.appendChild(tagItem);
                }
            }
        }
    }

}

customElements.define("datos-perfil", DatosPerfil);