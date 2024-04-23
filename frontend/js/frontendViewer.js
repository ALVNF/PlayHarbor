var nombreJuego = "Pong"
var nombreJuego2 = "Potato"

/*Functions for login page */
function userLogin(){
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
    // Obtener los valores del formulario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        return userCredential.user.getIdToken();
    })
    .then((idToken) => {
        localStorage.setItem('userToken', idToken);
    })
    .then(data => {
        // Redirige al usuario o maneja la respuesta del backend
        console.log(data);
        //window.location.href = 'globalChat.html';
        window.location.href = 'mainPage.html';
    })
    .catch(error => {
        const customAlert = document.getElementById('customAlert');
        customAlert.loadCustomAlert("Fallo al iniciar sesión", "Compruebe que los datos son correctos");
    });
}

/* Functions for register page */
function userRegister(){
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
            window.location.href = 'mainPage.html';
        },
        error: function(error) {

            const customAlert = document.getElementById('customAlert');
            customAlert.loadCustomAlert("Error when trying to register", error.responseJSON.error);
        }
    });
}

function chekUserLogin(){
    if(localStorage.getItem('userToken') == null){
        window.location.href = 'login.html';
    }else{
        getInfoUsuario(localStorage.getItem('userToken')).then((data) => {
            //console.log(data);
        });
    }
}


/* Functions for main page */
function loadContent(){
    chekUserLogin();
    loadFilterTags();
    loadGames();
}

function loadFilterTags(){
    getTodosLosTags().then((tags) => { 
        let gameFilter = document.getElementById("gameFilter");
        for (const tag in tags.tags) {
            gameFilter.loadTags(tags.tags[tag]);
        }

    });  

}

function loadGames(){
    getTodosLosJuegos().then((juegos) => {
        const gameList = document.getElementById("gameList");
        gameList.innerHTML = "";
        juegos.juegos.forEach(juego => {
            
            let game = document.createElement("game-card")
            game.loadGameCard(juego);
            gameList.appendChild(game);
        });
    });
}

function loadFilteredGames(selectedTag){
    getJuegosPorEtiqueta(selectedTag).then((juegos) => {   
        const gameList = document.getElementById("gameList");
        // gameList.innerHTML = "";

        juegos.juegos.forEach(juego => {
            let game = document.createElement("game-card")
            game.loadGameCard(juego);
            gameList.appendChild(game);
        });

    });
}

/* Functions for descriptionGame page */

function loadData(){
    chekUserLogin();
    loadGameComments();
    loadGameInfo();
    loadGameCover();
    loadGameImages();
}

function setJuego(){
    nombreJuego = localStorage.getItem('gameName');
    loadData();

}

function loadGameComments() {
    getComentsJuego(nombreJuego).then((comments) => {
        //console.log(comments);
        showComments(comments.comments);
    });
}

function loadGameInfo(){
    getInfoJuego(nombreJuego).then((info) => {
        //console.log(info.datos);
        document.getElementById("gameDescriptionTag").loadGameDescription(info.datos);
    });
}
function loadGameCover(){
    getImgsJuego(nombreJuego, "profile").then((cover) => {
        //console.log(cover.urls[0]);
        document.getElementById("gameDescriptionTag").setGameCover(cover.urls[0]);
    });
}

function loadGameImages(){
    getImgsJuego(nombreJuego, "samples").then((images) => {
        console.log(images.urls);
        document.getElementById("gameImages").loadGameImages(images.urls);
    });
}

function showComments(commentsList) {
    var comments = document.getElementById("reviewList");
    commentsList.forEach((comment) => {
        var commentComponent = document.createElement("comment-tag");
        commentComponent.loadComment(
            "../assets/battle_ready_warrior_icon.png",
            comment.user,
            500,
            10,
            comment.title,
            comment.date,
            comment.text,
            comment.likes,
            comment.dislikes
        )
        comments.appendChild(commentComponent);
    });
}

/* Functions for game page */

function loadGameScreen() {
    nombreJuego = localStorage.getItem('gameName');
    console.log("El juego es: "+ nombreJuego);
    getJuego(nombreJuego).then((gameUrl) => {
        console.log(gameUrl);
        $('#contenedorJuego').attr('src', gameUrl);
        var myIframe = document.getElementById('contenedorJuego');
        
        myIframe.addEventListener("load", function() {
            myIframe.contentWindow.document.body.style.overflow = "hidden";
            setTimeout(function(){
                myIframe.contentWindow.document.getElementById('unity-canvas').style.outline = "none";
                myIframe.contentWindow.document.getElementById('unity-canvas').focus();

                myIframe.contentWindow.document.getElementById('unity-footer').style.display = "none";
            }, 1000);
        });
    });
}

function returnToMain() {
    window.location.href = "./descriptionGame.html";
}

function augmentScreen(){
    var myIframe = document.getElementById('contenedorJuego');
    myIframe.contentWindow.document.getElementById('unity-fullscreen-button').click();
}


/* Function for uploadGame page */

function uploadCover(){
    const fileInput = document.getElementById('coverImg');
    fileInput.click();
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            document.getElementById('uploadLbl').style.display = "none";
            document.getElementById('imgPlaceHolder').style.display = "none";
            document.getElementById('uploadBtn').style.display = "none";
            const img = document.getElementById('imgCover');
            img.addEventListener('click', () => {
                fileInput.click();
            });
            img.style.display = "block";
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });

}

function uploadGameImages(){
    const gameImages = document.getElementById('gameImages');
    gameImages.click();
    gameImages.value = "";
    // Event listener when change the file inside de input file to show into the gallery
    gameImages.addEventListener('change',() =>{
        handleFiles(gameImages.files)

    });
}

  // Handle the files that are selected from the file selector if its an image show it into the gallery
function handleFiles(files) {
    let wrongFile = false;
    Array.from(files).forEach(file => {
        if (!file.type.match('image.*')) {
            wrongFile = true;
        }

        if (wrongFile) {
            alert('Solo se pueden añadir imágenes');
            return;
        }
        previewFile(file, document.getElementById('gallery'));

    });
}

function previewFile(file, gallery) {

    document.getElementById('gameLbl').style.display = "none";
    document.getElementById('gamePlaceHolder').style.display = "none";
    document.getElementById('multipleImgBtn').style.display = "none";
    gallery.innerHTML = "";

    const gameImages = document.getElementById('gameImages');

    let reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onloadend = function() {
        let gallaryContainer = document.createElement('div');
        let imgContainer = document.createElement('div');

        let img = document.createElement('img');

        gallaryContainer.classList.add('gallaryContainer');
        imgContainer.classList.add('imgContainer');

        imgContainer.appendChild(img);

        img.src = reader.result;
        img.id = file.name;
        gallaryContainer.appendChild(imgContainer);
        gallery.appendChild(gallaryContainer);
        gallery.addEventListener('click', () => {
            gameImages.click();
        });
        
    }
  }

function showTagSelector(){
    let tagList = document.getElementById("tagList");
    tagList.style.width = "60%";

    let tagSelector = document.createElement("tag-selector");
    tagSelector.showSelector(true);
    tagSelector.style.marginRight = "10px";
    tagList.appendChild(tagSelector);
}

function subirJuego() {
    var portada = $('#coverImg')[0].files[0];
    var author = $('#txtAuthorName').val();
    var gameName = $('#txtGameName').val();
    var tags = $('tag-selector').map(function() {
        return this.getSelectedTag();
    }).get();
    var descripcion = $('#txtDescripcion').val();
    
    var imagenes = $('#gameImages')[0].files;
    var url = $('#videoURL').val();

    var juego = $('#gameFiles')[0].files[0];
    var comentario = $('#txtComentario').val();
    
    var formData = new FormData();
    formData.append('nombre', author);
    formData.append('nombreJuego', gameName);
    formData.append('descripcion', descripcion);
    formData.append('comentario', comentario);
    formData.append('url', url);
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

/*profile page functions */

function loadProfileData(){
    loadProfileInfo();
    //loadUserGames();
    //loadUserComments();
    loadUserAchievements();
}

function loadProfileInfo(){
    getInfoUsuario(localStorage.getItem('userToken')).then((info) => {
        document.getElementById("datosPerfil").loadUserData(info);
    });
}

function loadUserAchievements(){
    //document.getElementById("datosPerfil").getUserName()
    getLogrosGenerales().then((logros) => {
        console.log(`Logros Usuario:`);
        const loggedUser = localStorage.getItem('email');
        let datos = JSON.parse(JSON.stringify(logros.data[loggedUser], null, 2));

        const achieveList = document.getElementById("achievementList");
        //console.log(datos);
        for (const game in datos) {
            for(const key in datos[game]){
                let achievement = document.createElement("achievement-card");
                achievement.loadAchievementCard(datos[game][key], key, game);
                achieveList.appendChild(achievement);
            }
        }
  
    });
}