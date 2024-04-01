$(document).ready(function() {
    $('#registerForm').on('submit', function(e) {
      e.preventDefault(); // Evita el comportamiento predeterminado de envío del formulario
  
      // Recolecta los datos del formulario
      var userData = {
        username: $('#username').val(),
        email: $('#email').val(),
        password: $('#password').val()
      };
  
      // Envía los datos al servidor utilizando AJAX
      $.ajax({
        url: '/api/r',
        method: 'POST', 
        contentType: 'application/json',
        data: JSON.stringify(userData), // Convierte los datos del formulario a JSON
        success: function(data) {
          console.log(data);
          $('#response').text('Usuario registrado con éxito: ' + JSON.stringify(data));
        },
        error: function(error) {
          console.error('Error al realizar la solicitud:', error.statusText);
          $('#response').text('Error al registrar el usuario.');
        }
      });
    });
  });