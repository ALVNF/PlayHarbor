const logrosTemplate = document.createElement("template");
logrosTemplate.innerHTML = `
    <link rel="stylesheet" href="../webComponents/logros/logros.css">
    <div class="logrosContainer">   
        <div class="achievments">
            <img src="../assets/achievments/Group 127.png">
            <img src="../assets/achievments/Group 123.png">
            <img src="../assets/achievments/Group 122.png">
            <img src="../assets/achievments/Group 120.png">
            <img src="../assets/achievments/Group 124.png">
            <img src="../assets/achievments/Group 125.png">
        </div>
        <div class="achievments">
            <img src="../assets/achievments/Group 126.png">
            <img src="../assets/achievments/Group 121.png">
            <img src="../assets/achievments/Group 128.png">
            <img src="../assets/achievments/Group 129.png">
            <img src="../assets/achievments/Group 130.png">
            <img src="../assets/achievments/Group 131.png">
        </div>
    </div>
`;

class Logros extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(logrosTemplate.content.cloneNode(true));
    }

    connectedCallback() {
        //this.cargarLogros(); 
    }

    cargarLogros() {
        getLogrosUsuario("roland1843lol@gmail.com").done(logros => {
            this.mostrarLogros(logros);
        }).fail(error => {
            console.error("Error al cargar los logros:", error);
        });
    }

    mostrarLogros(logros) {
        const contenedorLogros = this.shadowRoot.querySelector('.logrosContainer');
        contenedorLogros.innerHTML = '';
    
        // Mapa de nombres de logros a imágenes
        const logroAImagen = {
            "LogroNombre1": "../assets/achievments/Group 127.png",
            "LogroNombre2": "../assets/achievments/Group 123.png",
        };
    
        logros.forEach(logro => {
            const imgElement = document.createElement('img');
            imgElement.src = logroAImagen[logro.nombre];
            contenedorLogros.appendChild(imgElement);
        });
    }
    
}

customElements.define("logros-jugador", Logros);
