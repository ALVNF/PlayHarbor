
/*FUUNCION PARA RECUPERAR PUNTOS DE TODOS LOS JUGADORES, POR JUEGO Y DE PLATAFORMA*/
function getPuntos() {

    var puntosD = "plataforma"; //juegos-plataforma
    var tipoM = "torneo" //torneo-normal
    $.ajax({
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

/*ENVIAR DATOS DE FORMULARIO DE SUBIDA DE JUEGO*/
function subirJuego() {
  var nombre = $('#txtNombre').val();
  var descripcion = $('#txtDescripcion').val();
  var comentario = $('#txtComentario').val();
  var url = $('#urlInput').val();
  var plataformas = $('.plataforma:checked').map(function() {
      return $(this).val();
  }).get();

  var tags = $('.tags:checked').map(function() {
      return $(this).val();
  }).get();

  var portada = $('#imgPortada')[0].files[0];
  var imagenes = $('#imgsMuestra')[0].files;
  var juego = $('#juego')[0].files[0];

  var formData = new FormData();
  formData.append('nombre', nombre);
  formData.append('descripcion', descripcion);
  formData.append('comentario', comentario);
  formData.append('url', url);
  formData.append('plataformas', JSON.stringify(plataformas));
  formData.append('tags', JSON.stringify(tags));
  formData.append('portada', portada);
  for (var i = 0; i < imagenes.length; i++) {
      formData.append('imagenes', imagenes[i]);
  }
  formData.append('juego', juego);

  $.ajax({
      url: '/api/subirJuego',
      type: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      success: function(response) {
          console.log('Solicitud enviada correctamente.');
          // Manejar la respuesta del servidor aquí si es necesario
      },
      error: function(xhr, status, error) {
          console.error('Error al enviar la solicitud:', error);
          // Manejar el error aquí si es necesario
      }
  });
}


/*CHAT GLOBAL*/

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


/*EDITAR USR*/
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
  
/* LOGROS USUARIOS */
  function getLogrosGenerales(){
     $.ajax({
        url: '/api/logrosGenerales',
        method: 'GET',
        success: function (data) {
            console.log(data);
            //return data;
        },
        error: function (error) {
            console.error('Error al realizar la solicitud:', error.statusText);
        }
    });
}
  