const achievementTemplate = document.createElement("template");
achievementTemplate.innerHTML = `
    <link rel="stylesheet" href="../webComponents/achievementCard/achievementCard.css">

    <div class="mainContainer">
      <h2 id="rewardGame">Deep Valley <span class="colored">Reward</span></h2>
      <div id="rewardContainer">
          <label id="rewardAmount">10 <span class="colored">Exp.</span></label>
          <img id="rewardIcon" src="../assets/icons/sparkles.svg" alt="sparkles"> 
      </div>

      <img id="achievementIcon" src="../assets/achievments/achievment_1.png" alt="achievement">
      <div id="achievementContainer">
        <div id="achievementTitleContainer">
          <h3 id="rewardName">Afortunado</h3>
          <label id="obtainDate">9/4/24</label>
        </div>
        <p id="rewardDescription">Has sobrevivido a una muerte segura</p>

        <div id="infoMainContainer">
          <div class="infoContainer">
            <label class="infoLabel">Num. jugadores:</label>
            <label class="infoValue">1.128</label>
          </div>
          <div class="infoContainer">
            <label class="infoLabel">Tipo:</label>
            <label class="infoValue">Raro</label>
          </div>
        </div>
      </div>

    </div>
`;

class AchievementCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(achievementTemplate.content.cloneNode(true));
  }

}

customElements.define("achievement-card", AchievementCard);