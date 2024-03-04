var nombreJuego = "Pong"
var nombreJuego2 = "Potato"

function loadData(){
    loadGameComments();
    loadGameInfo();
    loadGameCover();
    loadGameImages();
}

function loadGame(){
    loadGameScreen();
}

function loadGameScreen() {
    getJuego(nombreJuego).then((gameUrl) => {
        console.log(gameUrl);
        $('#contenedorJuego').attr('src', gameUrl);
        var myIframe = document.getElementById('contenedorJuego');
        
        myIframe.addEventListener("load", function() {
            myIframe.contentWindow.document.body.style.overflow = "hidden";
            setTimeout(function(){
                console.log("Executed after 1 second");
                console.log();
                myIframe.contentWindow.document.getElementById('unity-footer').style.display = "none";
            }, 1000);
        });
    });
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