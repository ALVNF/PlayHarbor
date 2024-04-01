// firebaseConfig.js
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
document.addEventListener("DOMContentLoaded", function () {
  // Obtiene el token del almacenamiento local
  var idToken = localStorage.getItem("userToken");

  // Inicializa Firestore
  const db = firebase.firestore();

  if (idToken) {
    getInfoUsuario(idToken)
      .then(function (userData) {
        // Actualiza el DOM con el nombre del usuario
        document.getElementById("userName").textContent = userData.name;

        // Inicia el listener de mensajes
        getMessages(); // Llama a getMessages aquí para iniciar el listener

        // Configura el envío de mensajes
        document
          .getElementById("sendButton")
          .addEventListener("click", function () {
            const messageInput = document.getElementById("messageInput");
            const messageText = messageInput.value;

            if (messageText.trim() === "") {
              console.log("No se puede enviar un mensaje vacío.");
              return;
            }

            // Llama a la función `sendMessageToFirestore` definida en backendCallers.js
            // Asegúrate de que tienes el nombre de usuario disponible en este scope
            sendMessageToFirestore(userData.name, messageText);
          });
      })
      .catch(function (error) {
        console.error("Error al recuperar la información del usuario:", error);
        window.location.href = "/pages/login.html"; // Asegúrate de que esta ruta es correcta
      });

      

  } else {
    console.error("No se encontró el token de autenticación.");
    window.location.href = "/pages/login.html"; // Asegúrate de que esta ruta es correcta
  }
});

document.getElementById("editProfileButton").addEventListener("click", function () {
  // Redireccionar al usuario a la página de inicio de sesión
  window.location.href = "/pages/modifyUserData.html"; // Asegúrate de que esta ruta es correcta
});

document.getElementById("logoutButton").addEventListener("click", function () {
  // Borrar el token almacenado localmente
  localStorage.removeItem("userToken");

  // Cerrar la sesión en Firebase
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("Sesión cerrada");

      // Redireccionar al usuario a la página de inicio de sesión
      window.location.href = "/pages/login.html"; // Asegúrate de que esta ruta es correcta
    })
    .catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
});
