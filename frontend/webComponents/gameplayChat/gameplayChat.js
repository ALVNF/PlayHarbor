const gameplayChatTemplate = document.createElement("template");
gameplayChatTemplate.innerHTML = `
    <link rel="stylesheet" href="../webComponents/gameplayChat/gameplayChatStyle.css">
    <div class="right-column">
        <h1>In Game Chat</h1>
        <hr>
        <div class="chatContainer">
            <div class="chatList">
                <div class="chat">
                    <span class="username">MayLonala:</span>
                    <span class="message-content">¡Hola! ¿Cómo estás?</span>
                </div>
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

        // Evento de clic en el botón de enviar
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
    }

    // Método para agregar un nuevo mensaje al chat
    addMessage(username, messageContent) {
        const chatContainer = this.shadowRoot.querySelector('.chatList');

        const chatMessage = document.createElement('div');
        chatMessage.classList.add('chat');

        const usernameSpan = document.createElement('span');
        usernameSpan.classList.add('username');
        usernameSpan.textContent = username + ': ';
        chatMessage.appendChild(usernameSpan);

        const messageContentSpan = document.createElement('span');
        messageContentSpan.classList.add('message-content');
        messageContentSpan.textContent = messageContent;
        chatMessage.appendChild(messageContentSpan);

        chatContainer.appendChild(chatMessage);
    }

    // Método para enviar un mensaje
    sendMessage() {
        const message = this.messageInput.value.trim(); // Obtener el valor del mensaje y eliminar espacios en blanco

        if (message !== '') {
            this.addMessage('You', message); // Agregar el mensaje al chat con el nombre de usuario 'You'
            this.messageInput.value = ''; // Limpiar el campo de entrada después de enviar el mensaje
        }
    }
}

customElements.define("gameplay-chat", GameplayChat);

