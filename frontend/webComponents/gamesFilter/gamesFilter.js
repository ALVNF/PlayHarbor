const gamesFilterTemplate = document.createElement("template");
gamesFilterTemplate.innerHTML = `
    <link rel="stylesheet" href="../webComponents/gamesFilter/gamesFilter.css">
    <div class="filterContainer">
    
        <div class="searchSection">
            <h2>Search Game</h2>
            <div id="searchContainer">
                <input type="search" id="searchInput" placeholder="Enter game name...">
                <button id="searchButton"><img src="../assets/icons/search.svg"></button>
            </div>
        </div>

        <div class="filterSection">
            <h2>Filters</h2>
            <div class="filterOptions" id="filterOptions">
                <div class="titleContainer">
                    <img src="../assets/icons/chevron-down.svg">
                    <h3>Genre</h3>
                </div>
                <label class="gameLbl"><input type="checkbox" id="action" name="action"> Action</label>
            </div>
        </div>
        <button id="applyButton">Apply Filters</button>
    </div>
`;

// Mejoras 

class GamesFilter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(gamesFilterTemplate.content.cloneNode(true));

    }

    connectedCallback() {
        this.shadowRoot.getElementById("applyButton").addEventListener("click", () => {
            this.getCheckedElements();
        });
    }

    getCheckedElements(){
        let checkedElements = [];
        let checkboxes = this.shadowRoot.querySelectorAll("input[type='checkbox']");
        checkboxes.forEach((checkbox) => {
            if(checkbox.checked){
                checkedElements.push(checkbox.name);
            }
        });
        this.startShowingFilteredGames(checkedElements);
    }

    startShowingFilteredGames(checkedElements){
        const gameList = document.getElementById("gameList");
        gameList.innerHTML = "";
        if(checkedElements.length == 0){
            loadGames();
        }else{
            checkedElements.forEach(element => {
                loadFilteredGames(element);
            });
        }
    }

    loadTags(tagName){
        let container = document.createElement("div");
        container.innerHTML = `<label class="gameLbl"><input type="checkbox" id="action" name="${tagName}">${tagName}</label>`
        this.shadowRoot.getElementById("filterOptions").appendChild(container);
    }


}

customElements.define("games-filter", GamesFilter);

