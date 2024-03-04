const imageCarouselTemplate = document.createElement("template");
imageCarouselTemplate.innerHTML = `
    <link rel="stylesheet" href="../webComponents/imageCarousel/imageCarousel.css">
    
    <div class="imagesContainer">
        <img src="" alt="current selected image" class="bigImage" id="mainImage">

        <div class="smallImages" id="imagesList">
        </div>
    </div>


`;

class ImageCarousel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(imageCarouselTemplate.content.cloneNode(true));

  }

  connectedCallback() {}

  loadGameImages(images) {
    const imagesList = this.shadowRoot.getElementById("imagesList");
    imagesList.innerHTML = "";
    images.forEach((image, index) => {
      const smallImage = document.createElement("img");
      smallImage.src = image;
      smallImage.alt = `small image ${index + 1}`;
      smallImage.classList.add("smallImage");
      
      if (index === 0) {
        smallImage.classList.add("selected");
        this.setMainImage(image);
      }

      smallImage.addEventListener("click", () => {
        const selectedImage = imagesList.querySelector(".selected");
        selectedImage.classList.remove("selected");
        smallImage.classList.add("selected");
        this.setMainImage(image);
      });

      imagesList.appendChild(smallImage);
    });
  }

  setMainImage(image) {
    const mainImage = this.shadowRoot.getElementById("mainImage");
    mainImage.src = image;
  }

}

customElements.define("image-carousel", ImageCarousel);