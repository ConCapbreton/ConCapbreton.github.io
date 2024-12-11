//maybe look at open street map to add this functionality (https://www.openstreetmap.org/#map=6/46.45/-0.53)

window.onload = () => alert("The map page is not yet functional, you can navigate to another page using the navigation bar or hamburger menu")

//HAMBURGER MENU NAVIGATION
const hamburgerMenu = document.querySelector(".hamburger")
hamburgerMenu.addEventListener("click", () => {
    const hamburgerNavDiv = document.getElementById("hamburger-nav-div")
    hamburgerNavDiv.style.display = "flex"
    hamburgerNavDiv.innerHTML = `
        <button id="close-hamburger">X</button>
        <a href="./newentry.html">New Entry</a>
        <a href="./foraged.html">Foraged</a>
        <a href="./map.html">Map</a>
        <a href="">Contacts</a>
    `

    const closeHamburger = document.querySelector("#close-hamburger")
    closeHamburger.addEventListener("click", () => {
        hamburgerNavDiv.style.display = "none"
    })
})