const navMenuTemplate = document.createElement("template");
navMenuTemplate.innerHTML = `
    <link rel="stylesheet" href="../webComponents/navMenu/navMenu.css">
    <nav class="navbar">
        <div class="logo">
            <a href="/pages/mainPage.html">
                <img src="../assets/playful_pixel_art_logo.png" width="91" alt="Logo">
            </a>
        </div>

        <div class="menuContainer">
            <div class="menu">
                <a href="/pages/mainPage.html" class="menu-item">Browse Games <img src="../assets/abstract_red_tribal_pattern.png"></a>
                <a href="gtournaments.html" class="menu-item">
                    GTournaments <img src="../assets/yellow_hazard_sign_icon.png"></a>
                <a href="upload_game.html" class="menu-item">Upload Game <img src="../assets/purple_monster_outline_icon.png"></a>
                <a href="forum.html" class="menu-item">Forum <img src="../assets/blue_gear_outline_icon.png"></a>
                <a href="news.html" class="menu-item">News <img src="../assets/white_splatter_pattern_icon.png"></a>
            </div>
            <div id="selectedMenuBar"></div>

        </div>

        <div class="profile">
            <div id="userStatsContainer">
                <div class="user-info">Valhalla Records</div>
                <span class="spanStats"><label class="lblProfileStats">Exp.</label> 1500</span>
                <span class="spanStats"><label class="lblProfileStats">Lvl.</label> 25</span>
            </div>
            <a href="perfil.html"><img src="../assets/battle_ready_warrior_icon.png" width="54" alt="Profile"></a>
        </div>
    </nav>

`;

class NavMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(navMenuTemplate.content.cloneNode(true));

  }

}

customElements.define("nav-menu", NavMenu);