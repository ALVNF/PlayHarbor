const userChatItem = document.createElement("template");
userChatItem.innerHTML = `
    <link rel="stylesheet" href="../webComponents/userChatItem/userChatItem.css">

    <div class="mainContainer">
        <div class="profile">
            <img src="../assets/red_trooper_helmet_icon.png" width="54" alt="Profile">
            <div id="userStatsContainer">
                <span class="user-info">Red Macaco</span>
                <div>
                    <span class="spanStats"><label class="lblProfileStats">Exp.</label> 1500</span>
                    <span class="spanStats"><label class="lblProfileStats">Lvl.</label> 25</span>
                </div>
                <p class="lastMessage">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
            </div>
        <div>
    </div>
`;

class UserChatItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(userChatItem.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.querySelector(".mainContainer").addEventListener("click", () => {
            console.log("UserChatItem clicked");
        });
    }

}

customElements.define("userchat-item", UserChatItem);