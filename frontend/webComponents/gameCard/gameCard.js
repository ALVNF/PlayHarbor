const gameCardTemplate = document.createElement("template");
    gameCardTemplate.innerHTML = `
    <link rel="stylesheet" href="../webComponents/gameCard/gameCard.css">
    <link rel="stylesheet" href="../webComponents/tag/tag.css">

        <div class="gameCard" id="changeId">
            <div id="imgGradient">
                <img src="../assets/action_rpg_1.jpg" class="gameImage">
            </div>
            
            <div class="gameContent">
                <div class="infoContainer">
                    <div class="header">
                        <h1 id="gameTitle">NieR: Automata</h1>
                        <h3 id="developer">PlatinumGames</h3>
                    </div>
                    <div class="scoreBorder">
                        <h2 id="score">4.9</h2>
                    </div>
                </div>

                <div class="tagList">
                </div>
            </div>
            
        </div>
    `;
    
    class GameCard extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(gameCardTemplate.content.cloneNode(true));
            this.gameName;
            // Elementos del shadow DOM
            this.gameContainer = this.shadowRoot.querySelector(".gameCard");
            this.gameImageElement = this.shadowRoot.querySelector(".gameImage");
            this.titleElement = this.shadowRoot.querySelector("#gameTitle");
            this.developerElement = this.shadowRoot.querySelector("#developer");
            this.scoreElement = this.shadowRoot.querySelector("#score");
        }

        connectedCallback() {
            this.gameContainer.addEventListener("click", () => {
                this.goToGamePage();
            });
        }

        loadGameCard(game) {
            this.gameName = game.name;
            this.setTitle(game.name);
            this.setDeveloper(game.developer);
            // this.setScore(game.score);
            this.setScore(5);
            this.setTagList(game.tags);
            this.setGameImage(game.name);
            this.setGameId(game.id);
        }

        goToGamePage() {
            localStorage.setItem("gameName", this.gameName);
            window.location.href = "/pages/descriptionGame.html";
        }

        setGameId(id){
            this.shadowRoot.getElementById("changeId").id = id;
        }

        setTagList(tags) {
            const tagList = this.shadowRoot.querySelector(".tagList");
        
            for (const tag in tags) {
                const tagItem = document.createElement("tag-item");
                tagItem.setTagName(tags[tag])
                tagList.appendChild(tagItem);
            }
        }
    
        // Setters para cada elemento de información
        setGameImage(nombreJuego) {
            getImgsJuego(nombreJuego, "profile").then((cover) => {
                this.gameImageElement.src = cover.urls[0];
            });
            
        }
    
        setTitle(title) {
            this.titleElement.innerText = title;
        }
    
        setDeveloper(developer) {
            this.developerElement.innerText = developer;
        }
    
        setScore(score) {
            this.scoreElement.innerText = score;
        }
        
    }
    
    customElements.define("game-card", GameCard);

