/*Esta funcion la teneis que ejecutar nada mas paseis a la ventana donde se juega, despues de darle a "Jugar"*/
// getJuego();
function getJuego(nombreJuego){
    return $.ajax({
        url: '/api/jugar',
        method: 'GET',
        data: {nombre: nombreJuego},
        success: function (data) {
            //console.log(data);
            return data;
        },
        error: function (error) {
            console.error('Error al realizar la solicitud:', error.statusText);
        }
    });
}

function getInfoJuego(nombreJuego){
    return $.ajax({
        url: '/api/infoJuego',
        method: 'GET',
        data: {nombre: nombreJuego},
        success: function (data) {
            //console.log(data.datos);
        },
        error: function (error) {
            console.error('Error al realizar la solicitud:', error.statusText);
        }
    });
}

function getComentsJuego(nombreJuego){
    return $.ajax({
        url: '/api/comentsJuego',
        method: 'GET',
        data: {nombre: nombreJuego},
        success: function (data) {
            //console.log(data);

        },
        error: function (error) {
            console.error('Error al realizar la solicitud:', error.statusText);
        }
    });
    
}

function getImgsJuego(nombreJuego, tipo) {
    return $.ajax({
        url: '/api/imgsJuego',
        method: 'GET',
        data: {
            nombre: nombreJuego,
            tipo: tipo
        },
        success: function(data) {
            // Vacía el contenedor de la galería antes de agregar nuevas imágenes
            // const galeria = $('#galeria');
            // galeria.empty();
            // // Añade cada imagen a la galería
            // data.urls.forEach(url => {
            //     $('<img>', {src: url}).appendTo(galeria);
            // });
            
        },
        error: function(error) {
            console.error('Error al realizar la solicitud:', error.statusText);
        }
    });
}



function getTodosLosJuegos() {
    return $.ajax({
        url: '/api/todosLosJuegos',
        method: 'GET',
        success: function(data) {
            console.log('Juegos:', data.juegos);
            // Aquí puedes hacer algo con la lista de juegos, como mostrarlos en la página
        },
        error: function(error) {
            console.error('Error al realizar la solicitud:', error.statusText);
        }
    });
}

function getJuegosPorEtiqueta(etiqueta) {
    return $.ajax({
        url: '/api/juegosPorEtiqueta',
        method: 'GET',
        data: { etiqueta: etiqueta }, // Pasa la etiqueta como parámetro en la solicitud
        success: function(data) {
            console.log('Juegos filtrados por etiqueta:', data.juegos);
            // Aquí puedes hacer algo con la lista de juegos filtrados, como mostrarlos en la página
        },
        error: function(error) {
            console.error('Error al realizar la solicitud:', error.statusText);
        }
    });

    
}

