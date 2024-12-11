
window.onload = () => alert("The home page is not yet functional, click the login button to navigate to another page")

//HAMBURGER MENU NAVIGATION
const hamburgerMenu = document.querySelector(".hamburger")
hamburgerMenu.addEventListener("click", () => {
    const hamburgerNavDiv = document.getElementById("hamburger-nav-div")
    hamburgerNavDiv.style.display = "flex"
    hamburgerNavDiv.innerHTML = `
        <button id="close-hamburger">X</button>
        <a href="">About</a>
        <a href="">User Guide</a>
        <a href="">Contacts</a>
    `

    const closeHamburger = document.querySelector("#close-hamburger")
    closeHamburger.addEventListener("click", () => {
        hamburgerNavDiv.style.display = "none"
    })
})