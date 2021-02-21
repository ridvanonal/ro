const checkBoxTemplate = document.createElement("template")
checkBoxTemplate.innerHTML = 
  `
  <style>
  :host{
    height:16px;
    width:16px;
    display:block;
    margin:5px;
    cursor:pointer;
    -webkit-touch-callout: none; 
    -webkit-user-select: none;
    -khtml-user-select: none; 
    -moz-user-select: none; 
    -ms-user-select: none; 
    user-select: none;
  }
  :host > div {
    height:100%;
    width:100%;
    border-radius:5px;
    box-sizing:border-box;
    border-width:1px;
    border-style:solid;
    display:flex;
    align-items:center;
    justify-content:center;
  }
  :host([dark=false]) > div{
    background-color: rgb(242,242,247);
    border-color: rgba(174,174,178,1);
  }
  :host([dark=true]) > div{
    background-color: rgb(28,28,30);
    border-color: rgba(99,99,102,1);
  }  
  :host([checked][dark=false]) > div{
    background-color:rgb(0,122,255) !important;
    border-color: transparent !important;
  }
  :host([checked][dark=true]) > div{
    background-color:rgb(10,132,255) !important;
    border-color: transparent !important;
  }
  :host > div > svg{
    height: 14px;
    width: 14px;
  }
  :host > div > svg > line{
    stroke-width: 2;
    stroke-linecap: round;
    stroke:transparent;
  }
  :host([checked]) > div > svg > line{
    stroke: white;
  }
  :host([disabled]){
    opacity:0.5;
    pointer-events: none !important;
  }
  </style>
  <div>
  <svg>
    <line x1="25%" y1="58%" x2="40%" y2="73%"></line>
    <line x1="40%" y1="73%" x2="75%" y2="28%"></line>
  </svg>
  </div>
  `
class checkBox extends HTMLElement{
  
  constructor(){
    super()
    this.shadow = this.attachShadow({mode:"closed"})
    this.shadow.appendChild(checkBoxTemplate.content.cloneNode(true))
  }

  get checked(){
    return this.hasAttribute("checked")
  }

  set checked(bool){
    if(bool) this.setAttribute("checked","")
    else this.removeAttribute("checked")
  }

  get value(){
    return this.getAttribute("value")
  }
  
  get hasValue(){
    return this.hasAttribute("value")
  }

  set value(bool){
    this.setAttribute("value",bool)
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

  get group(){
    return this.getAttribute("group")
  }

  get hasGroup(){
    this.hasAttribute("group")
  }

  set group(groupName){
    this.setAttribute("group",groupName)
  }

  get leader(){
    return this.hasAttribute("leader")
  }

  set leader(bool){
    if(bool) this.setAttribute("leader","")
    else this.removeAttribute("leader")
  }

  static get observedAttributes(){
    return ["checked"]
  }

  attributeChangedCallback(attr,oldValue,newValue){
    switch(attr){
      case 'checked':
        const valuechange = new CustomEvent("change",{detail:{checked : this.checked,value : this.value,group : this.group}})
        this.dispatchEvent(valuechange)
      break
    }
  }

  onClick = () => {
    this.checked = !this.checked

    if(checkBoxProperties.group(this.group).leader)
      if (checkBoxProperties.group(this.group).uncheckeds.length == 0) checkBoxProperties.group(this.group).leader.checked = true
      else checkBoxProperties.group(this.group).leader.checked = false    
  }
  
  connectedCallback(){ 
    if(!this.hasDark) this.dark = false
    this.shadow.querySelector(":host>div").addEventListener("click",this.onClick)

    if(!this.group) this.leader = false
    if(this.disabled) this.leader = false
    if(this.leader)
      if (checkBoxProperties.group(this.group).leader) this.leader = false
      else Object.assign(checkBoxProperties.groupLeaders,{[this.group] : this})
    
    if(this.leader) this.shadow.querySelector(":host>div").addEventListener("click",()=>{checkBoxProperties.toggleAll(this)})
  }
}

checkBox.prototype.darkswitcher = true
customElements.define("ro-checkbox",checkBox)

class checkBoxProperties{
  static allDocumentGroups(){
    return[...new Set(Array.from(document.querySelectorAll("ro-checkbox")).map(item=>item.group))]
  }
  static group(groupName){
    return {
      members : Array.from(document.querySelectorAll(`ro-checkbox[group=${groupName}]`)),
      length : Array.from(document.querySelectorAll(`ro-checkbox[group=${groupName}]`)).length,
      availables : Array.from(document.querySelectorAll(`ro-checkbox[group=${groupName}]`)).filter(item=>item.disabled == false),
      checkeds : Array.from(document.querySelectorAll(`ro-checkbox[group=${groupName}]`)).filter(item=>item.leader == false && item.disabled == false && item.checked == true),
      uncheckeds : Array.from(document.querySelectorAll(`ro-checkbox[group=${groupName}]`)).filter(item=>item.leader == false && item.disabled == false && item.checked == false),
      values : Array.from(document.querySelectorAll(`ro-checkbox[group=${groupName}]`)).filter(item=>item.leader == false && item.disabled == false && item.checked == true).map(item=>item.value),
      leader : checkBoxProperties.groupLeaders[groupName]
    }
  }
  static checkAll(groupName){
    checkBoxProperties.group(groupName).availables.forEach(item=>item.checked = true)
  }
  static uncheckAll(groupName){
    checkBoxProperties.group(groupName).availables.forEach(item=>item.checked = false)
  }
  static reverseAll(groupName){
    checkBoxProperties.group(groupName).availables.forEach(item=>item.checked = !item.checked)
  }
  static toggleAll(element){
    if(!element.checked) checkBoxProperties.checkAll(element.group)
    else checkBoxProperties.uncheckAll(element.group)
  }
  static groupLeaders
}

Object.defineProperty(checkBoxProperties,"groupLeaders",{value : new Object(),writable : false})
