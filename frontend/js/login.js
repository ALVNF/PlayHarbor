// Configuración de Firebase (reemplaza esto con tu propia configuración de Firebase)
var firebaseConfig = {
    apiKey: "AIzaSyCmVB9J5ICe5d16VISb4lKr0We5k_ia5ro",
    authDomain: "duck-team.firebaseapp.com",
    projectId: "duck-team",
    storageBucket: "duck-team.appspot.com",
    messagingSenderId: "664071538049",
    appId: "1:664071538049:web:74a6d9c4fd9583a5c99480",
    measurementId: "G-25G2RDGQ3D"
  };
  
// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Referencia al formulario de inicio de sesión en el DOM
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Obtener los valores del formulario
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Redirección al perfil del usuario
    window.location.href = 'globalChat.html'; // Asegúrate de que esta ruta apunte a tu archivo `profile.html`.
  })
  .catch((error) => {
    // Manejo de errores de inicio de sesión
    console.error('Error', error);
    alert('Error al iniciar sesión: ' + error.message);
  });
});