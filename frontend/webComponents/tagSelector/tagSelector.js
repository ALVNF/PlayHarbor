const tagSelectorTemplate = document.createElement("template");
tagSelectorTemplate.innerHTML = `
  <link rel="stylesheet" href="../webComponents/tagSelector/tagSelector.css">

  <select id="tagSelector" style="display:none">
    <option value="none">Selecciona un tag</option>
  </select>

`;

class TagSelector extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(tagSelectorTemplate.content.cloneNode(true));

  }

  connectedCallback() {
    this.loadTags();
    this.shadowRoot.getElementById("tagSelector").addEventListener("change", (e) => {
      if(e.target.value === "none"){
        this.showSelector(false);
      }
    });
  }

  loadTags(){
    getTodosLosTags().then((tags) => {
      let tagList = this.shadowRoot.getElementById("tagSelector");
      tags.tags.forEach(tag => {
          let option = document.createElement("option");
          option.value = tag;
          option.textContent = tag;          
          tagList.appendChild(option);
      });
    });
  }

  showSelector(shouldShow){
    if(shouldShow){
      this.shadowRoot.getElementById("tagSelector").style.display = "flex";
    }else{
      this.shadowRoot.getElementById("tagSelector").style.display = "none";
    }
  }

  getSelectedTag(){
    return this.shadowRoot.getElementById("tagSelector").value;
  }
}

customElements.define("tag-selector", TagSelector);