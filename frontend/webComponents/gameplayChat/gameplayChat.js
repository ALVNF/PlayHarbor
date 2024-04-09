const gameplayChatTemplate = document.createElement("template");
gameplayChatTemplate.innerHTML = `
    <link rel="stylesheet" href="../webComponents/gameplayChat/gameplayChatStyle.css">
    <div class="right-column">
        <h1>In Game Chat</h1>
        <hr>
        <div class="chatContainer">
            <div class="chatList" id="chatList">
            </div>

            <footer>
                <input type="text" id="message-input" placeholder="Escribe tu mensaje aquí">
                <button id="send-button"><img src="../assets/icons/send.svg" alt="Enviar"></button>
            </footer>
        </div>
    </div>
`;

class GameplayChat extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(gameplayChatTemplate.content.cloneNode(true));

    }

    connectedCallback() {
        // Obtener referencias a los elementos del DOM
        this.messageInput = this.shadowRoot.getElementById('message-input');
        this.sendButton = this.shadowRoot.getElementById('send-button');
        this.userData = null;

        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Evento de clic en el botón de enviar
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });

        const firebaseConfig = {
            apiKey: "AIzaSyCmVB9J5ICe5d16VISb4lKr0We5k_ia5ro",
            authDomain: "duck-team.firebaseapp.com",
            projectId: "duck-team",
            storageBucket: "duck-team.appspot.com",
            messagingSenderId: "664071538049",
            appId: "1:664071538049:web:74a6d9c4fd9583a5c99480",
            measurementId: "G-25G2RDGQ3D",
        };
          
        // Inicializa Firebase
        firebase.initializeApp(firebaseConfig);

        //envio de mensajes y obtencion de los mismos
        this.shadowRoot.addEventListener('DOMContentLoaded', this.loadGlobalChat());
    }

    loadGlobalChat() {
        // Obtiene el token del almacenamiento local
        var idToken = localStorage.getItem("userToken");
    
        // Inicializa Firestore
        const db = firebase.firestore();
        
        if (idToken) {
            getInfoUsuario(idToken)
            .then((userData) => {
                // Inicia el listener de mensajes
                this.getMessages(); // Llama a getMessages aquí para iniciar el listener
                this.userData = userData;
            })
            .catch(function (error) {
                console.error("Error al recuperar la información del usuario:" + error);
                //window.location.href = "/pages/login.html"; // Asegúrate de que esta ruta es correcta
            });
        
        } else {
            console.error("No se encontró el token de autenticación.");
            window.location.href = "/pages/login.html"; // Asegúrate de que esta ruta es correcta
        }
    }

    //obtener mensajes en orden y en tiempo real
    getMessages() {
        const db = firebase.firestore();
        const messagesRef = db.collection("globalChat").doc("messages");
    
        // Observa los cambios en tiempo real
        messagesRef.onSnapshot((doc) => {
            if (doc.exists) {
                const messagesContainer = this.shadowRoot.getElementById('chatList');
                // Limpiar los mensajes anteriores
                messagesContainer.innerHTML = '';
        
                const messagesData = doc.data();
                const messagesArray = Object.keys(messagesData)
                .filter(key => key.startsWith('message_')) // Filtra solo las claves que empiezan con 'message_'
                .map(key => ({ id: key, ...messagesData[key] })) // Transforma en array de objetos
                .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds); // Ordena los mensajes por timestamp en orden descendente
        
                // Añadir los mensajes al contenedor
                messagesArray.forEach(message => {
                    this.addMessage(message, messagesContainer);
                });
                messagesContainer.scrollTop = messagesContainer.scrollHeight;

            } else {
                console.error("El documento no existe.");
            }
        }, (error) => {
            console.error("Error al obtener mensajes:", error);
        });
    }

    // Método para agregar un nuevo mensaje al chat
    addMessage(message, messagesContainer) {
        const messageElement = document.createElement('div');
        const timestamp = message.timestamp ? new Date(message.timestamp.seconds * 1000).toLocaleString(navigator.language, {hour: '2-digit', minute:'2-digit'}) : 'Enviando...';

        messageElement.innerHTML = `<span class="messageTime">${timestamp}- </span><span class="username">${message.name}:</span> <span class="message-content"> ${message.text} </span>`;
        messagesContainer.prepend(messageElement); // Añade el mensaje al principio del contenedor
    }

    // Método para enviar un mensaje
    sendMessage() {
        const messageText = this.messageInput.value;

        if (messageText.trim() === "") {
            console.log("No se puede enviar un mensaje vacío.");
            return;
        }

        // Llama a la función `sendMessageToFirestore` definida en backendCallers.js
        // Asegúrate de que tienes el nombre de usuario disponible en este scope
        this.sendMessageToFirestore(this.userData.name, messageText);
    }

    sendMessageToFirestore(userName, messageText) {
        if (!messageText.trim()) return; // No enviar mensajes vacíos
      
        // Referencia a la colección 'globalChat' y al documento 'messages' en Firestore
        const messagesRef = firebase
          .firestore()
          .collection("globalChat")
          .doc("messages");
      
        // Agregar un nuevo mensaje a la colección 'messages'
        messagesRef
          .update({
            // Usamos Date.now() para generar un ID único para el mensaje
            [`message_${Date.now()}`]: {
              name: userName,
              text: messageText,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(), // Usar el timestamp del servidor para la hora del mensaje
            },
          })
          .then(() => {
            console.log("Mensaje enviado correctamente");
            this.messageInput.value = ""; // Limpiar el campo de entrada
          })
          .catch((error) => {
            console.error("Error al enviar el mensaje:", error);
          });
      }
      

}

customElements.define("gameplay-chat", GameplayChat);

