
/*function getPuntuacion(puntuacionJuego){
    console.log("Soy getPuntuacion()");
    return $.ajax({
        url: '/api/puntuacion',
        method: 'GET',
        data: {nombre: puntuacionJuego},
        success: function (data) {
            console.log(data);
            //$('#contenedorJuego').attr('src', data);
            actualizarPuntuacion(data);
        },
        error: function (error) {
            console.error('Error al realizar la solicitud:', error.statusText);
            
        }
    });
}*/

    const ws = new WebSocket('ws://localhost:8082');

    var datos;

    let socketAbierto = new Promise((resolve, reject) =>{
        // Escuchar eventos de la conexión WebSocket
        ws.onopen = function() {
            console.log('Conectado al servidor WebSocket');
        };
    }) 

    // Escuchar eventos de mensajes del servidor
    ws.onmessage = function(event) {
        const json = JSON.parse(event.data);
        console.log('JSON del juego recibido:', json);

        datos = json.puntuacion;
        
        // Procesar el JSON y actualizar puntuacion.html con los datos del juego
        actualizarPuntuacion(json);
    };

function actualizarPuntuacion(json) {
    // Obtener el elemento HTML donde se mostrarán los datos del juego
    const datosJuegoElement = document.getElementById('datosJuego');
  
    // Crear un nuevo elemento <div> para mostrar los datos del juego
    const nuevoElemento = document.createElement('div');
    nuevoElemento.classList.add('datos-juego');
    console.log('Datos recibidos: ', json);
  
    // Crear elementos <p> para mostrar el nombre de usuario y la puntuación
    const nombreUsuarioElemento = document.createElement('p');
    nombreUsuarioElemento.textContent = 'Nombre de usuario: ' + json.nombreUsuario;
    const puntuacionElemento = document.createElement('p');
    puntuacionElemento.textContent = 'Puntuación: ' + json.puntuacion;
  
    // Agregar los elementos de texto al nuevo elemento <div>
    nuevoElemento.appendChild(nombreUsuarioElemento);
    nuevoElemento.appendChild(puntuacionElemento);
  
    // Limpiar el contenido anterior
    datosJuegoElement.innerHTML = '';
  
    // Agregar el nuevo elemento al contenedor de datos del juego
    datosJuegoElement.appendChild(nuevoElemento);
  }