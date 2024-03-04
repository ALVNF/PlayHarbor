const commentTagTemplate = document.createElement("template");
commentTagTemplate.innerHTML = `
    <link rel="stylesheet" href="../webComponents/commentTag/commentTag.css">

    <div class="mainContainer">

        <div class="leftSide">
            <div class="profile">
                <a href="perfil.html"><img src="../assets/battle_ready_warrior_icon.png" width="54" alt="Profile" id="usrImg"></a>
                <div id="userStatsContainer">
                    <div class="user-info" id="userName">Valhalla Records</div>
                    <span class="spanStats" id="userExp"><label class="lblProfileStats">Exp.</label> 1500</span>
                    <span class="spanStats" id="userLvl"><label class="lblProfileStats">Lvl.</label> 25</span>
                </div>
            </div>

            <div class="achievmentsContainer">
                <h3 class="achievmentsTitle">Achievements</h3>
                <div class="achievments" id="achievmentsList">
                    <img src="../assets/achievments/achievment_1.png" alt="achievment 1" class="achievment">
                </div>
            </div>
        </div>

        <div class="rightSide">
            <div class="comment">
                <h3 id="commentTitle">Best Game Everrrr!!!</h3>
                <h4 id="commentDate">Commented on February 24 2024</h4>
                <p id="commentText">Nier: Automata is not just a game; it's a work of art. From its captivating narrative to its flawless gameplay mechanics, every aspect of this masterpiece is crafted with care and attention to detail. For anyone seeking a gaming experience that transcends the ordinary and delves into the realms of the extraordinary, Nier: Automata is an absolute must-play.</p>
                <hr>
                <div class="commentStats">
                    <label>Was this review useful?</label>
                    <span class="spanLikes" id="likes">150<img src="../assets/icons/like.svg" id="likeSVG"></span>
                    <span class="spanLikes" id="dislikes">25<img src="../assets/icons/like.svg" id="dislikeSVG"></span>
                </div>
            </div>
    </div>

`;

class CommentTag extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(commentTagTemplate.content.cloneNode(true));
  }

    connectedCallback() {

    }

    loadComment(userImg, userName, userExp, userLvl, commentTitle, commentDate, commentText, likes, dislikes) {
        this.setUserImg(userImg);
        this.setUserName(userName);
        this.setUserExp(userExp);
        this.setUserLvl(userLvl);
        this.setCommentTitle(commentTitle);
        this.setCommentDate(commentDate);
        this.setCommentText(commentText);
        this.setLikes(likes);
        this.setDislikes(dislikes);
    }

    setUserImg(value) {
        this.shadowRoot.querySelector("#usrImg").src = value;
    }

    setUserName(value) {
        this.shadowRoot.querySelector("#userName").innerText = value;
    }

    setUserExp(value) {
        this.shadowRoot.querySelector("#userExp").innerHTML = `<label class="lblProfileStats">Exp.</label> ${value}`;
    }

    setUserLvl(value) {
        this.shadowRoot.querySelector("#userLvl").innerHTML = `<label class="lblProfileStats">Lvl.</label> ${value}`;
    }

    setCommentTitle(value) {
        this.shadowRoot.querySelector("#commentTitle").innerText = value;
    }

    setCommentDate(value) {
        this.shadowRoot.querySelector("#commentDate").innerText = value;
    }

    setCommentText(value) {
        this.shadowRoot.querySelector("#commentText").innerText = value;
    }

    setLikes(value) {
        this.shadowRoot.querySelector("#likes").innerHTML = `${value}<img src="../assets/icons/like.svg" id="likeSVG">`;
    }

    setDislikes(value) {
        this.shadowRoot.querySelector("#dislikes").innerHTML = `${value}<img src="../assets/icons/like.svg" id="dislikeSVG">`;
    }


}

customElements.define("comment-tag", CommentTag);