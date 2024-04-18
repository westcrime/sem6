const func = async () => {
    const response = await window.versions.ping()
    const information = document.getElementById('info')
    information.innerText = `Response from main.js - ${response}`;
}
  
func()