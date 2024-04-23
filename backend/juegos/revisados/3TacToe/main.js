var bandera = false; //Indica si el juego a iniciado, por default es false, para que no se pueda colocar si está sin iniciar
var turno = 0; //Determina el turno
var tab = new Array(); //Array de botones
var puntuacionJugador1 = 0;
var puntuacionJugador2 = 0;

const ws = new WebSocket("ws://localhost:8082");
console.log("Soy el juego");
let socketAbierto = new Promise((resolve, reject) => {
  // Escuchar eventos de la conexión WebSocket
  ws.onopen = function () {
    console.log("\n\n\nJuego Conectado al servidor WebSocket\n\n\n");
    ws.send(JSON.stringify({ data: "getClasificacion" }));
    ws.send(JSON.stringify({type: "juego", data: "3TacToe"}));
  };
});

window.onload = async function () {
  var iniciar = document.getElementById("iniciar");
  iniciar.addEventListener("click", comenzar);
  document.getElementById("b0").addEventListener("click", colocar);
  document.getElementById("b1").addEventListener("click", colocar);
  document.getElementById("b2").addEventListener("click", colocar);
  document.getElementById("b3").addEventListener("click", colocar);
  document.getElementById("b4").addEventListener("click", colocar);
  document.getElementById("b5").addEventListener("click", colocar);
  document.getElementById("b6").addEventListener("click", colocar);
  document.getElementById("b7").addEventListener("click", colocar);
  document.getElementById("b8").addEventListener("click", colocar);
};

function comenzar() {
  bandera = true;
  var jugador1 = document.getElementById("jugador1");
  var jugador2 = document.getElementById("jugador2");
  if (jugador1.value == "") {
    //Se comprueba si los campos de nombre están vacios o no
    alert("Falta el nombre del Jugador 1!!");
    jugador1.focus();
  }
  if (jugador2.value == "") {
    alert("Falta el nombre del Jugador 2!!");
    jugador2.focus();
  } else {
    tab[0] = document.getElementById("b0"); //Se asocia un botón a cada campo del array
    tab[1] = document.getElementById("b1");
    tab[2] = document.getElementById("b2");
    tab[3] = document.getElementById("b3");
    tab[4] = document.getElementById("b4");
    tab[5] = document.getElementById("b5");
    tab[6] = document.getElementById("b6");
    tab[7] = document.getElementById("b7");
    tab[8] = document.getElementById("b8");
    for (var i = 0; i < 9; i++) {
        tab[i].value = ""; // Asegúrate de que los botones estén vacíos
        tab[i].className = ""; // Restablece la clase si es necesario
    }
    turno = 1;
    document.getElementById("turnoJugador").innerHTML =
      "Adelante " + jugador1.value;
  }
}

/*Función que permite colocar la señal de cada jugador, al hacerlo el boton que se selecciona adquiere la clase botonJugador por lo que la letra se muestra del color que de especifica en el css. Si el juego a empezado (si bandera es true) comprueba si el turnno es 1 y si el boton que se pulsa está vacio, si lo está se pone una X y se le asigna la clase botonJugador la var turno cambia a 2 y se indica en el label que le toca al jugador 2 con el que se hará el mismo proceso que con el 1*/
function colocar() {
    var boton = this;
    if (bandera === true) {
      if (turno === 1 && boton.value === "") {
        boton.value = "X";
        boton.className = "botonJugador";
        enviarPuntuacion('Alvaro', 'Manuel', 'Turno', 0);
        turno = 2;
        document.getElementById("turnoJugador").innerHTML = "Adelante " + jugador2.value;
      } else if (turno === 2 && boton.value === "") {
        boton.value = "O";
        boton.className = "botonJugador";
        enviarPuntuacion('Alvaro', 'Alvaro', 'Turno', 0);
        turno = 1;
        document.getElementById("turnoJugador").innerHTML = "Adelante " + jugador1.value;
      }
      revisar(); 
    }
  }
  

function revisar() {
    // Suponiendo que 'tab' es un array que representa tu tablero de 3x3
    var ganador = null;
  
    // Combinaciones ganadoras
    var combinacionesGanadoras = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
      [0, 4, 8], [2, 4, 6]             // Diagonales
    ];
  
    // Verificar cada combinación ganadora
    combinacionesGanadoras.forEach((combo) => {
      if (tab[combo[0]].value === tab[combo[1]].value && 
          tab[combo[1]].value === tab[combo[2]].value && 
          tab[combo[0]].value !== "") {
        // Si hay coincidencia, tenemos un ganador
        ganador = tab[combo[0]].value;
      }
    });
  
    // Actualizar la puntuación y enviarla
    if (ganador) {
      if (ganador === 'X') { // Asumiendo que 'X' es el Jugador 1
        puntuacionJugador1++; // Incrementa la puntuación para el jugador 1
        alert("Felicidades Jugador 1!");
        enviarPuntuacion('Alvaro', puntuacionJugador1, 'Partidas Ganadas X', '0');
        enviarPuntuacionFinal('Alvaro', puntuacionJugador1, 'Partidas Ganadas X', '0');
        enviarPuntuacion('Alvaro', puntuacionJugador2, 'Partidas Ganadas O', '0');
        enviarPuntuacionFinal('Alvaro', puntuacionJugador2, 'Partidas Ganadas O', '0');
        enviarPuntuacion('Alvaro', "Alvaro", 'Turno', '0');
        comenzar();
      } else if (ganador === 'O') { // Asumiendo que 'O' es el Jugador 2
        puntuacionJugador2++; // Incrementa la puntuación para el jugador 2
        alert("Felicidades Jugador 2!");
        enviarPuntuacion('Alvaro', puntuacionJugador1, 'Partidas Ganadas X', '1');
        enviarPuntuacionFinal('Alvaro', puntuacionJugador1, 'Partidas Ganadas X', '1');
        enviarPuntuacion('Alvaro', puntuacionJugador2, 'Partidas Ganadas O', '1');
        enviarPuntuacionFinal('Alvaro', puntuacionJugador2, 'Partidas Ganadas O', '1');
        enviarPuntuacion('Alvaro', "Alvaro", 'Turno', '0');
        comenzar();
      }
      // Reiniciar el juego o manejar el fin del juego aquí
    } else {
      // Aquí podrías manejar un empate si es necesario
      if (tab.every(boton => boton.value !== "")) {
        alert("Es un empate!");
        // Manejar empate
      }
    }
  }
  
  function enviarPuntuacion(jugador, valor, tipo, equipo) {
    const datosPuntuacion = {
      usr: jugador,
      valor: valor.toString(), // Convertimos el valor a string
      type: tipo,
      team: equipo
    };
  
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "puntuacion", data: datosPuntuacion }));
    } else {
      console.log('WebSocket no está abierto.');
    }
  }
  function enviarPuntuacionFinal(jugador, valor, tipo, equipo) {
    const datosPuntuacion = {
      usr: jugador,
      valor: valor.toString(), // Convertimos el valor a string
      type: tipo,
      team: equipo
    };
  
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "puntuacionFinal", data: datosPuntuacion }));
    } else {
      console.log('WebSocket no está abierto.');
    }
  }
