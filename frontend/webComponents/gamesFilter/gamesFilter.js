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
            <div class="filterOptions">
                <div class="titleContainer">
                    <img src="../assets/icons/chevron-down.svg">
                    <h3>Genre</h3>
                </div>
                <label class="gameLbl"><input type="checkbox" id="action" name="action"> Action</label>
            </div>
        </div>
    </div>
`;

// Mejoras 

class GamesFilter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(gamesFilterTemplate.content.cloneNode(true));

    }

    connectedCallback() {}

    loadTags(tagName){
        this.shadowRoot.getElementById("filterOptions").appendChild = `<label class="gameLbl"><input type="checkbox" id="action" name="action"> ${tagName}</label>`;
    }
}

customElements.define("games-filter", GamesFilter);

