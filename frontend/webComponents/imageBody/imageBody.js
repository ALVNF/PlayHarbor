const imageBodyTemplate = document.createElement("template");
imageBodyTemplate.innerHTML=`
    <link rel="stylesheet" href="../webComponents/imageBody/imageBody.css">

    
    <div class="imageContainer">
      
        <img src="../assets/LegendOfZeldaLinks.jpg" alt="current selected image" class="mediumImage">
      
        <div class="gameDay">
        
          <button id="btnPlayInicio">GAME OF THE DAY</button>
          
          <div class="textGame">
            <h2>The legend of Zelda: Link's Awakening</h2>
            <p>After defeating ganon in A Link to the Past, Link decides to go on a journey to prepare himself in case such an evil returns. Durin this journey, Link's ship falls prey to a storm. 
              <a href="">read more</a>
            </p>
          </div>
          <div class="tagSupport">
            <label class="tagContainer">Action</label>
            <label class="tagContainer">Adventure</label>
          </div>

            <button id="btnPlayNow">Play Now</button>

        </div>

      

    </div>
  

`;

class ImageBody extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(imageBodyTemplate.content.cloneNode(true));

        this.initComponent();
      }

      // El id del boton es  btnPlayinicio que es un boton diferente del otro
      initComponent(){
        this.shadowRoot.querySelector("#btnPlayNow").addEventListener("click",() =>{
          alert("Boton marcado");
        })
      }

      setTagList(tags) {
        const tagList = this.shadowRoot.querySelector("#tagList");
    
        for (const tag in tags) {
            for(const property in tags[tag]){
                if(property == "name"){
                    const tagItem = document.createElement("tag-item");
                    // console.log(`${property}: ${game.tags[tag][property]}`);
                    tagItem.setTagName(tags[tag][property])
                    tagList.appendChild(tagItem);
                }
            }
        }
    }

}

customElements.define("image-body", ImageBody);