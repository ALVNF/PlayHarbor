const friendItemTemplate = document.createElement("template");
friendItemTemplate.innerHTML = `
  <link rel="stylesheet" href="../webComponents/friendItem/friendItem.css">

  <div class="profile">
    <img src="../assets/red_trooper_helmet_icon.png" width="54" alt="Profile">
    <div id="userStatsContainer">
      <span class="user-info">Red Macaco</span>
      <div>
        <span class="spanStats"><label class="lblProfileStats">Exp.</label> 1500</span>
        <span class="spanStats"><label class="lblProfileStats">Lvl.</label> 25</span>
      </div>
    </div>
  <div>
`;

class FriendItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(friendItemTemplate.content.cloneNode(true));
  }

}

customElements.define("friend-item", FriendItem);