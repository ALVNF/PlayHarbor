const gameDescriptionTemplate = document.createElement("template");
gameDescriptionTemplate.innerHTML = `
    <link rel="stylesheet" href="../webComponents/gameDescription/gameDescription.css">

    <section class="mainContainer">
        <div class="gameCober">
            <img src="" id="gameCoverImg">
            <a href="/pages/gameplay.html">Play Now</a>
        </div>

        <div class="infoContainer">
            <div class="gameInfoContainer">
                <h1 id="gameTitle"></h1>
                <label id="developerName"></label>
                <div class="tagList" id="tagList"></div>
            </div>

            <article>
                <h3>Description: </h3>
                <p id="gameDescription"></p>
            </article>
        </div>
    </section>

`;

class GameDescription extends HTMLElement {
    constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(gameDescriptionTemplate.content.cloneNode(true));

    }

    connectedCallback() {}

    loadGameDescription(game) {
        this.setGameTitle(game.name);
        this.setDeveloperName(game.developer);
        this.setGameDescription(game.description);
        this.setTagList(game.tags);
    }

    setGameCover(cover) {
        this.shadowRoot.querySelector("#gameCoverImg").src = cover;
    }

    setGameTitle(title) {
        this.shadowRoot.querySelector("#gameTitle").innerText = title;
    }

    setDeveloperName(developer) {
        this.shadowRoot.querySelector("#developerName").innerText = developer;
    }

    setGameDescription(description) {
        this.shadowRoot.querySelector("#gameDescription").innerText = description;
    }

    setTagList(tags) {
        const tagList = this.shadowRoot.querySelector("#tagList");
    
        for (const tag in tags) {
            for(const property in tags[tag]){
                if(property == "name"){
                    const tagItem = document.createElement("tag-item");
                    // console.log(`${property}: ${game.tags[tag][property]}`);
                    tagItem.setTagName(tags[tag][property])
                    tagList.appendChild(tagItem);
                }
            }
        }
    }

}

customElements.define("game-description", GameDescription);