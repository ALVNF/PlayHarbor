const custoAlertTemplate = document.createElement("template");
custoAlertTemplate.innerHTML = `
  <link rel="stylesheet" href="../webComponents/customAlert/customAlert.css">
    <div id="dialogoverlay"></div>
    <div id="dialogbox" class="slit-in-vertical">
        <div>
            <div id="dialogboxhead"></div>
            <div id="dialogboxbody"></div>
            <div id="dialogboxfoot"></div>
        </div>
    </div>

`;

class CustomAlert extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(custoAlertTemplate.content.cloneNode(true));
  }

    connectedCallback() {
        this.dialogoverlay = this.shadowRoot.getElementById('dialogoverlay');
        this.dialogbox = this.shadowRoot.getElementById('dialogbox');
 

    }
    
    loadCustomAlert(title, message){
        let winH = window.innerHeight;
        this.dialogoverlay.style.height = winH+"px";
        this.dialogbox.style.top = "100px";
        this.showHideAlert(true);

        if(typeof title === 'undefined') {
            this.shadowRoot.getElementById('dialogboxhead').style.display = 'none';
        } else {
            this.shadowRoot.getElementById('dialogboxhead').innerHTML = '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> '+ title;
        }

        this.shadowRoot.getElementById('dialogboxbody').innerHTML = message;
        this.shadowRoot.getElementById('dialogboxfoot').innerHTML = '<button class="pure-material-button-contained active" id="okBtn">OK</button>';
        this.shadowRoot.getElementById('okBtn').addEventListener('click', () => {
            this.showHideAlert(false)
        });
    }

    showHideAlert(shouldShow){
        if(shouldShow){
            this.dialogoverlay.style.display = "block";
            this.dialogbox.style.display = "block";
        }else{
            this.dialogbox.style.display = "none";
            this.dialogoverlay.style.display = "none";
        }
    }
 

}


customElements.define("custom-alert", CustomAlert);