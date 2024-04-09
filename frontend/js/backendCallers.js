/*Esta funcion la teneis que ejecutar nada mas paseis a la ventana donde se juega, despues de darle a "Jugar"*/
// getJuego();
function getJuego(nombreJuego) {
  return $.ajax({
    url: "/api/jugar",
    method: "GET",
    data: { nombre: nombreJuego },
    success: function (data) {
      //console.log(data);
      return data;
    },
    error: function (error) {
      console.error("Error al realizar la solicitud:", error.statusText);
    },
  });
}

  //SE DEVUELVERN TODOS LOS TAGS IMPLEMENTADA POR ROLAND.
function getTodosLosTags() {
  return $.ajax({
    url: "/api/todosLosTags",
    method: "GET",
    success: function(data) {
      //console.log("Tags recuperados:", data.tags);
      // Aquí puedes hacer algo con la lista de tags recuperados, como mostrarlos en la página
    },
    error: function(error) {
      console.error("Error al realizar la solicitud:", error.statusText);
    }
  });
}

function getInfoJuego(nombreJuego) {
  return $.ajax({
    url: "/api/infoJuego",
    method: "GET",
    data: { nombre: nombreJuego },
    success: function (data) {
      //console.log(data.datos);
    },
    error: function (error) {
      console.error("Error al realizar la solicitud:", error.statusText);
    },
  });
}

function getComentsJuego(nombreJuego) {
  return $.ajax({
    url: "/api/comentsJuego",
    method: "GET",
    data: { nombre: nombreJuego },
    success: function (data) {
      //console.log(data);
    },
    error: function (error) {
      console.error("Error al realizar la solicitud:", error.statusText);
    },
  });
}

function getImgsJuego(nombreJuego, tipo) {
  return $.ajax({
    url: "/api/imgsJuego",
    method: "GET",
    data: {
      nombre: nombreJuego,
      tipo: tipo,
    },
    success: function (data) {
      // Vacía el contenedor de la galería antes de agregar nuevas imágenes
      // const galeria = $('#galeria');
      // galeria.empty();
      // // Añade cada imagen a la galería
      // data.urls.forEach(url => {
      //     $('<img>', {src: url}).appendTo(galeria);
      // });
    },
    error: function (error) {
      console.error("Error al realizar la solicitud:", error.statusText);
    },
  });
}

function getTodosLosJuegos() {
  return $.ajax({
    url: "/api/todosLosJuegos",
    method: "GET",
    success: function (data) {
      //console.log("Juegos:", data.juegos);
      // Aquí puedes hacer algo con la lista de juegos, como mostrarlos en la página
    },
    error: function (error) {
      console.error("Error al realizar la solicitud:", error.statusText);
    },
  });
}

function getJuegosPorEtiqueta(etiqueta) {
  return $.ajax({
    url: "/api/juegosPorEtiqueta",
    method: "GET",
    data: { etiqueta: etiqueta }, // Pasa la etiqueta como parámetro en la solicitud
    success: function (data) {
      console.log("Juegos filtrados por etiqueta:", data.juegos);
      // Aquí puedes hacer algo con la lista de juegos filtrados, como mostrarlos en la página
    },
    error: function (error) {
      console.error("Error al realizar la solicitud:", error.statusText);
    },
  });
}

//Recuperar el usuario a traves del token
function getInfoUsuario(idToken) {
  // Asegúrate de que esta función devuelva una promesa
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "/api/infoUsuario",
      method: "GET",
      headers: {
        Authorization: "Bearer " + idToken,
      },
      success: function (data) {
        console.log("Datos del jugador:", data);
        resolve(data); // Resuelve la promesa con los datos
      },
      error: function (error) {
        console.error("Error al realizar la solicitud:", error.statusText);
        reject(error); // Rechaza la promesa con el error
      },
    });
  });
}

function sendMessageToFirestore(userName, messageText) {
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
      document.getElementById("messageInput").value = ""; // Limpiar el campo de entrada
    })
    .catch((error) => {
      console.error("Error al enviar el mensaje:", error);
    });
}

//obtener mensajes en orden y en tiempo real
function getMessages() {
    const db = firebase.firestore();
    const messagesRef = db.collection("globalChat").doc("messages");
  
    // Observa los cambios en tiempo real
    messagesRef.onSnapshot((doc) => {
      if (doc.exists) {
        const messagesContainer = document.getElementById('messages');
        // Limpiar los mensajes anteriores
        messagesContainer.innerHTML = '';
  
        const messagesData = doc.data();
        const messagesArray = Object.keys(messagesData)
          .filter(key => key.startsWith('message_')) // Filtra solo las claves que empiezan con 'message_'
          .map(key => ({ id: key, ...messagesData[key] })) // Transforma en array de objetos
          .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds); // Ordena los mensajes por timestamp en orden descendente
  
        // Añadir los mensajes al contenedor
        messagesArray.forEach(message => {
          const messageElement = document.createElement('div');
          const timestamp = message.timestamp ? new Date(message.timestamp.seconds * 1000).toLocaleString() : 'Enviando...';
          messageElement.textContent = `${message.name}: ${message.text} - ${timestamp}`;
          messagesContainer.prepend(messageElement); // Añade el mensaje al principio del contenedor
        });
      } else {
        console.error("El documento no existe.");
      }
    }, (error) => {
      console.error("Error al obtener mensajes:", error);
    });
  }

  function updateInfoUser(data) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: "/api/updateUserInfo",
        method: "PUT", // Cambiado a 'PUT' ya que es más adecuado para actualizaciones
        contentType: "application/json", // Asegúrate de enviar el Content-Type correcto
        data: JSON.stringify(data), // Asegúrate de convertir el objeto de datos a un string JSON
        success: function(response) {
          console.log("Información del usuario actualizada:", response);
          resolve(response); // Resuelve la promesa con la respuesta
        },
        error: function(error) {
          console.error("Error al actualizar la información del usuario:", error.statusText);
          reject(error); // Rechaza la promesa con el error
        }
      });
    });
  }

  function getPuntos() {
    var puntosD = "plataforma"; //juegos-plataforma
    var tipoM = "torneo" //torneo-normal
    return $.ajax({
      type: "GET",
      url: "/api/getPuntosJug",
      data: { 
        puntosD: puntosD,
        tipoM: tipoM
      },
      success: function(response) {
        console.log(response);
      },
      error: function(xhr, status, error) {
        console.error("Error al obtener los puntos:", error);
      }
    });
}

  function getLogrosUsuario(nombreUsuario) {
    return $.ajax({
        url: '/api/logrosGenerales', // Asegúrate de que esta URL sea correcta y esté manejando la solicitud como esperas.
        method: 'GET',
        data: { 
            nombre: nombreUsuario
        }
    }).then(response => {
        console.log(response);
        return response.data; // Asegúrate de ajustar esto según el formato exacto de tu respuesta.
    }).fail(error => {
        console.error("Error al obtener los logros:", error);
    });
}


  