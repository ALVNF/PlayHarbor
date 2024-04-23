const pointsStatusBarTemplate = document.createElement("template");
pointsStatusBarTemplate.innerHTML = `
    <link rel="stylesheet" href="../webComponents/pointsStatusBar/pointsStatusBar.css">
    <div class="itemsContainer"></div>
`;

class PointsStatusBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(pointsStatusBarTemplate.content.cloneNode(true));
    this.initialized = false;
  }

  updateStats(stats) {
    const itemsContainer = this.shadowRoot.querySelector('.itemsContainer');

    // Verificar que itemsContainer exista
    if (!itemsContainer) {
        console.error('No se pudo encontrar el contenedor de items.');
        return;
    }

    if (!this.statsElements) {
      this.statsElements = {};
  }
  
    // Limpiar contenedor solo la primera vez si no ha sido inicializado
    if (!this.initialized) {
        itemsContainer.innerHTML = '';
        this.initialized = true;
    }

    // Obtener todos los elementos h3 en el contenedor actual
    const headers = itemsContainer.querySelectorAll('h3');
    
    stats.forEach(stat => {
        let found = false;

        // Buscar si ya existe un elemento con el mismo nombre
        headers.forEach(header => {
            if (header.textContent === stat.name) {
                const valueElement = header.nextElementSibling; // Asume que <h2> es siempre el siguiente elemento después de <h3>
                valueElement.textContent = stat.value;
                found = true;
            }
        });

        // Si no se encontró un elemento con el mismo nombre, crear uno nuevo
        if (!found) {
            console.log('Creando nuevo elemento para:', stat);
            const item = document.createElement('div');
            item.className = 'item';

            const header = document.createElement('h3');
            header.textContent = stat.name;

            const value = document.createElement('h2');
            value.textContent = stat.value;

            item.appendChild(header);
            item.appendChild(value);

            itemsContainer.appendChild(item);
        }
    });
  }
}

customElements.define("points-bar", PointsStatusBar);