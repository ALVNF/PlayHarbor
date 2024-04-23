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
            <label class="infoValue" id="ownedBy">1.128</label>
          </div>
          <div class="infoContainer">
            <label class="infoLabel">Tipo:</label>
            <label class="infoValue" id="rewardType">Raro</label>
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

  loadAchievementCard(datos, achievementName, achievementGame){
    /*
      achievementGame
      datos.platformExp;
      datos.imageURL;
      achievementName;
      "21/04/2024"
      datos.howToObtain;
      datos.ownedBy
      datos.difficulty;
      
    */
    this.setAchievementGame(achievementGame);
    this.setGainedExp(datos.platformExp);
    this.setAchievementIcon(datos.imageURL);
    this.setAchievementName(achievementName);
    this.setObtainDate("21/04/2024");
    this.setHowToObtain(datos.howToObtain);
    this.setOwnedBy(datos.ownedBy);
    this.setDifficulty(datos.difficulty);
    
    //console.log(datos.description);
  }


  setAchievementGame(value) {
    this.shadowRoot.querySelector("#rewardGame").innerHTML = `${value}<span class="colored"> Reward</span>`;
  }

  setGainedExp(value){
    this.shadowRoot.querySelector("#rewardAmount").innerHTML = `${value}<span class="colored">Exp.</span>`;
  }

  setAchievementIcon(value) {
    this.shadowRoot.querySelector("#achievementIcon").src = value;
  }

  setAchievementName(value) {
    this.shadowRoot.querySelector("#rewardName").innerHTML = value;
  }

  setObtainDate(value){
    this.shadowRoot.querySelector
  }

  setHowToObtain(value) {
    this.shadowRoot.querySelector("#rewardDescription").innerHTML = value;
  }

  setOwnedBy(value) {
    this.shadowRoot.querySelector("#ownedBy").innerHTML = value;
  }

  setDifficulty(value) {
    this.shadowRoot.querySelector("#rewardType").innerHTML = value;
  }



}

customElements.define("achievement-card", AchievementCard);