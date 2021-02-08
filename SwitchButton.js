const switchButtonTemplate = document.createElement("template")
switchButtonTemplate.innerHTML = 
  `
  <style>
  :host{
    display:block;
    width:34px; 
    height:22px;
    cursor: pointer;
    -webkit-touch-callout: none; 
    -webkit-user-select: none;
    -khtml-user-select: none; 
    -moz-user-select: none; 
    -ms-user-select: none; 
    user-select: none;
  }
  :host > div{
    height: 100%;
    width: 100%;
    border-radius: 14px;
    padding: 2px;
    box-sizing: border-box;
    -webkit-transition: background-color .2s linear;
    -ms-transition: background-color .2s linear;
    transition: background-color .2s linear;
  }
  :host > div::after{
    content:"";
    display:block;
    height: 18px;
    width: 18px;
    background-color: rgba(255,255,255,1) ;
    border-radius: 100%;
    box-shadow: 0px 1px 3px rgba(0,0,0,0.15);
    -webkit-transition: margin-left .2s cubic-bezier(0.175,0.885,0.32,1.275),
                        opacity .2s linear;
    -ms-transition: margin-left .2s cubic-bezier(0.175,0.885,0.32,1.275),
                    opacity .2s linear;
    transition: margin-left .2s cubic-bezier(0.175,0.885,0.32,1.275),
                opacity .2s linear;
  }
  :host([dark=true]) > div{
    background-color: rgb(72,72,74) !important;
  }  
  :host([dark=false]) > div{
    background-color: rgb(229,229,234) !important;
  }
  :host([dark=true][checked]) > div{
    background-color: rgb(48,209,88) !important;
  } 
  :host([dark=false][checked]) > div{
    background-color: rgb(59,199,89) !important;
  }  
  :host([checked]) > div::after{
    margin-left: 12px !important;
  } 
  :host([disabled]) > div{
    pointer-events: none !important;
  }
  :host([dark=true][checked][disabled]) > div{
    background-color: rgba(48,209,88,0.75) !important;
  } 
  :host([dark=false][checked][disabled]) > div{
    background-color: rgba(59,199,89,0.75) !important;
  }  
  :host([disabled]) > div::after{
    opacity:0.5 !important;
  }
  </style>
  <div></div>
  `
class switchButton extends HTMLElement{
  constructor(){
    super()
    this.shadow = this.attachShadow({mode:"closed"})
    this.shadow.appendChild(switchButtonTemplate.content.cloneNode(true))
  }

  get checked(){
    return this.hasAttribute("checked")
  }

  set checked(bool){
    if(bool) this.setAttribute("checked","")
    else this.removeAttribute("checked")
  }

  get dark(){
    return this.getAttribute("dark")
  }

  get hasDark(){
    return this.hasAttribute("dark")
  }

  set dark(bool){
    this.setAttribute("dark",bool)
  }

  get disabled(){
    return this.hasAttribute("disabled")
  }

  set disabled(bool){
    if(bool) this.setAttribute("disabled","")
    else this.removeAttribute("disabled")
  }

  static get observedAttributes(){
    return ["checked"]
  }

  attributeChangedCallback(attr,oldValue,newValue){
    switch(attr){
      case 'checked':
        const valuechange = new CustomEvent("change",{detail:{value : this.checked}})
        this.dispatchEvent(valuechange)
      break
    }
  }

  onClick = () => {
    this.checked = !this.checked
  }
  
  connectedCallback(){ 
    if(!this.hasDark) this.dark = false
    this.shadow.querySelector(":host>div").addEventListener("click",this.onClick)  
  }
}

switchButton.prototype.darkswitcher = true

customElements.define("ro-switchbutton",switchButton)