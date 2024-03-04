const pointsStatusBarTemplate = document.createElement("template");
pointsStatusBarTemplate.innerHTML = `
    <link rel="stylesheet" href="../webComponents/pointsStatusBar/pointsStatusBar.css">

    <footer id="statsContainer">

        <div class="itemsContainer">
            <div class="item">
                <h3>LIFE LEFT</h3>
                <h2>90%</h2>
            </div>

            <div class="item">
                <h3>First Gun Ammunition</h3>
                <h2>30 / 60</h2>
            </div>

            <div class="item">
                <h3>Second Gun Ammunition</h3>
                <h2>24 / 24</h2>
            </div>

            <div class="item">
                <h3>First Hand Grenade</h3>
                <h2>26</h2>
            </div>

            <div class="item">
                <h3>Second Hand Grenade</h3>
                <h2>7</h2>
            </div>
            
            <div class="TotalPointsContainer">
                <h3>YOUR TOTAL POINTS</h3>
                <h2>650</h2>
            </div>
        </div>
        
    </footer>

`;

class PointsStatusBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(
      pointsStatusBarTemplate.content.cloneNode(true)
    );
  }
}

customElements.define("points-bar", PointsStatusBar);
