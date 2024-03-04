const chatAndFriendsTemplate = document.createElement("template");
chatAndFriendsTemplate.innerHTML = `
    <link rel="stylesheet" href="../webComponents/chat&Friends/chat&Friends.css">

    <div class="mainContainer">
        <div class="chatContainer">
            <div class="chatHeader">
                <h1><img src="../assets/icons/arrowDown.svg">Chat</h1>
                <hr>
            </div>

            <div class="chatList">
                <userchat-item></userchat-item>
            </div>
        </div>

        <div class="friendsContainer">
            <div class="friendsHeader">
                <h1><img src="../assets/icons/arrowDown.svg">Friends</h1>
                <hr>
            </div>

            <div class="friendsList">
                <friend-item></friend-item>
            </div>
        </div>
        
    </div>
`;

class ChatAndFriends extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(chatAndFriendsTemplate.content.cloneNode(true));
  }

}

customElements.define("chatfriends-menu", ChatAndFriends);