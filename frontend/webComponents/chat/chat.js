const chatTemplate = document.createElement("template");
chatTemplate.innerHTML = `
    <link rel="stylesheet" href="../webComponents/chat&Friends/chat&Friends.css">

    <div class="mainContainer">
        
    </div>
`;

class Chat extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(chatTemplate.content.cloneNode(true));
  }

}

customElements.define("chat-element", Chat);