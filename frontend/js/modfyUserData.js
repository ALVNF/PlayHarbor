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
        document.getElementById("nameInput").value = userData.name;
        document.getElementById("surnameInput").value = userData.surname;
        document.getElementById("emailInput").value = userData.email;
        document.getElementById("usernameInput").value = userData.username;
      })
      .catch(function (error) {
        console.error("Error al recuperar la información del usuario:", error);
        window.location.href = "/pages/login.html"; // Asegúrate de que esta ruta es correcta
      });
  } else {
    console.error("No se encontró el token de autenticación.");
    window.location.href = "/pages/login.html"; // Asegúrate de que esta ruta es correcta
  }

  // Añade un listener al botón de actualizar perfil
  document
    .getElementById("updateProfileButton")
    .addEventListener("click", function () {
      const updatedUserData = {
        name: document.getElementById("nameInput").value,
        surname: document.getElementById("surnameInput").value,
        email: document.getElementById("emailInput").value,
        username: document.getElementById("usernameInput").value,
      };

      // Llama a la función de actualización
      updateInfoUser(updatedUserData)
        .then(() => {
          console.log("Información del usuario actualizada con éxito.");
          // Aquí puedes manejar lo que sucede después de una actualización exitosa
        })
        .catch((error) => {
          console.error(
            "Error al actualizar la información del usuario:",
            error
          );
        });
    });
});
