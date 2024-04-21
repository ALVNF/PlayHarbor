const ws = new WebSocket('ws://localhost:8081');

    var datos;
    console.log('Patata');
    let socketAbierto = new Promise((resolve, reject) =>{
        // Escuchar eventos de la conexión WebSocket
        ws.onopen = function() {
            console.log('\n\n\nConectado al servidor WebSocket\n\n\n');
        };
    }) 

    // Escuchar eventos de mensajes del servidor
    ws.onmessage = function(event) {
        const json = JSON.parse(event.data);
        // console.log('JSON del juego recibido:', json);
    
        if (json.type === "puntuacion" || json.type === "puntuacionFinal") {
            actualizarPuntuacion(json.data);
        }
    };

    function actualizarPuntuacion(json) {
        // Obtener el elemento HTML donde se mostrarán los datos del juego
        const datosJuegoElement = document.getElementById('datosJuego');
      
        // Crear un nuevo elemento <div> para mostrar los datos del juego
        const nuevoElemento = document.createElement('div');
        nuevoElemento.classList.add('datos-juego');
        console.log('Datos recibidos: ', json);
      
        const statsBar = document.getElementById('statsBar');
        if (statsBar && json.usr == "Alvaro") {
            // Suponiendo que los datos vienen en un formato que puede ser directamente usado por updateStats
            statsBar.updateStats([
                { name: "Usuario", value: json.usr },
                { name: json.type, value: json.valor }
            ]);
        } else {
            console.log('Elemento statsBar no encontrado');
        }
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

    //Muestra todos los datos del json
    /*function actualizarPuntuacion(json) {
        console.log('Actualizando puntuación con:', json);
    
        const statsBar = document.getElementById('statsBar');
        if (statsBar && json && json.usr == "Alvaro") {
            // Filtra y mapea las entradas JSON para excluir la propiedad 'team'
            let statsArray = Object.entries(json)
                .filter(([key, _]) => key !== "team")  // Excluir la entrada 'team'
                .map(([key, value]) => {
                    // Cambia los nombres de las claves según se especifica
                    if (key === "usr") key = "Usuario";
                    return { name: key, value: value };
                });
    
            statsBar.updateStats(statsArray);
        } else {
            console.error('Elemento statsBar no encontrado o JSON inválido');
        }
    }*/
    
    