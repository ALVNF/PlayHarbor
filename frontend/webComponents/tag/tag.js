const tagTemplate = document.createElement("template");
tagTemplate.innerHTML = `
    <link rel="stylesheet" href="../webComponents/tag/tag.css">

    <div class="tagContainer">
        <label id="tagName">Action RPG</label>
    </div>
`;

class Tag extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(tagTemplate.content.cloneNode(true));

  }

  connectedCallback() {}

  setTagName(tag) {
    this.shadowRoot.querySelector("#tagName").innerText = tag;
  }

}

customElements.define("tag-item", Tag);