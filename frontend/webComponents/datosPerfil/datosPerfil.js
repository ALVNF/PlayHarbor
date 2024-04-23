const datosPerfilTemplate = document.createElement("template");
datosPerfilTemplate.innerHTML = `
    <link rel="stylesheet" href="../webComponents/datosPerfil/datosPerfil.css">

    <div class="profile">
        <a href="profile.html"><img src="../assets/battle_ready_warrior_icon.png" width="54" alt="Profile" id="usrImg"></a>
        <div id="userStatsContainer">
            <div class="user-info" id="userName">Alvaro</div>
            <div id="lvlInfoContainer">
                <span class="spanStats" id="userExp"><label class="lblProfileStats">Exp.</label> 1500</span>
                <span class="spanStats" id="userLvl"><label class="lblProfileStats">Lvl.</label> 25</span>
            </div>
            <hr>
            <div class="tagList" id="tagList">
                <span class="profileInfo player">Player</span>
                <span class="profileInfo admin">Administrator</span>
                <span class="profileInfo developer">Developer</span>
            </div>
        </div>
    </div>
`;

class DatosPerfil extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(datosPerfilTemplate.content.cloneNode(true));

    }

    connectedCallback() { }

    loadUserData(info){
        //console.log(`Info Usuario:`);
        //console.log(info);
        localStorage.setItem("email", info.email);
        this.setUserName(info.username);
        // this.setUserImage(info.userImage);
        this.setUserExp(info.exp);
        this.setUserLvl(info.level);
    }

    setUserName(userName){
        this.shadowRoot.getElementById("userName").innerHTML = userName;
    }

    getUserName(){
        return this.shadowRoot.getElementById("userName").innerHTML;
    }

    setUserImage(userImage){
        this.shadowRoot.getElementById("usrImg").src = userImage;
    }

    setUserExp(userExp){
        this.shadowRoot.getElementById("userExp").innerHTML = `<label class="lblProfileStats">Exp.</label>${userExp}`;
    }

    setUserLvl(userLvl){
        this.shadowRoot.getElementById("userLvl").innerHTML = `<label class="lblProfileStats">Lvl.</label>${userLvl}`;
    }

}

customElements.define("datos-perfil", DatosPerfil);