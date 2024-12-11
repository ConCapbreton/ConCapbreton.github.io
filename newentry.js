//Consider cutting name / comment fields for display with a "See more option" to allow the input of longer names
//need to update HTML with hints on how to complete fields and then 

let mushroomsArray
let mushroomInstancesArray = []

const newEntrySaveBtn = document.getElementById("newentry-save-btn")
const newEntryMessage = document.getElementById("new-entry-message")
const newEntryTitle = document.getElementById("new-entry-title")
const mainDiv = document.querySelector(".main-div")
const newEntryForm = document.querySelector(".new-entry-form")
newEntryMessage.style.display = "none"

//INPUTS
const nameInput = document.getElementById("name")
//IN THE ABSENCE OF A BACKEND FOR THIS PROJECT ONLY THE FILE NAME IS UPLOADED (ADDING A DISPLAYING PHOTOS WILL BE UPDATED LATER)
const fileInput = document.getElementById("file-input")
const speciesInput = document.getElementById("species")
const latitudeInput = document.getElementById("latitude")
const longitudeInput = document.getElementById("longitude")
const dateInput = document.getElementById("date")
const timeInput = document.getElementById("time")
const commentInput = document.getElementById("text-area")
// const imgInput = document.getElementById("newentry-image") will be needed once image upload possible

//ADD A MUSHROOM
newEntryForm.addEventListener("submit", () => {
    let filename 
    let longLatRegex = /^[0-9]{6}$/
    let timeRegex = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/
    let submitForm = true 
    newEntryMessage.style.display = "block"
    newEntryMessage.style.marginBottom = "1rem"
    
    
    //file check - images only (length < 50) (not required)
    if (fileInput.value.length === 0) {
        filename = "Click edit to upload an image."
    } else if (fileInput.value.length > 50) {
        newEntryMessage.innerText = "The file name should be less than 50 characters."
        submitForm = false 
        return
    } else {
        filename = fileInput.value
    } 
    
    //character limit name - 20 (required)
    if (nameInput.value.length === 0 || nameInput.value.length > 20) {   
        newEntryMessage.innerText = "Please enter a name for your mushroom that is less than 20 characters."
        submitForm = false   
        return 
    } 

    //species (require)
    if (speciesInput.value === "Scientific name") {
        newEntryMessage.innerText = "Please select a species (or select \"Other\" if unknown)."
        submitForm = false
        return 
    }

    //Lat / Long checks (6 numeric digits) - required
    if (!longLatRegex.test(latitudeInput.value) || !longLatRegex.test(longitudeInput.value)) {
        newEntryMessage.innerText = "Please input latitide and longitude values of six digits containing only [0 - 9]"
        submitForm = false
        return
    }

    //date - format - required
    if (!isDateValid(dateInput.value)) {
        newEntryMessage.innerText = "Please input a valid date when you found your mushroom."
        submitForm = false
        return
    }

    //time - check format
    if (timeInput.value.length !== 0 && !timeRegex.test(timeInput.value)) {
        newEntryMessage.innerText = "Please enter a valid time or leave this field empty."
        submitForm = false 
        return
    }

    //comment check (50 characters)
    if (commentInput.value.length > 50) {
        newEntryMessage.innerText = "Please enter a comment for your mushroom that is less than 50 characters."
        submitForm = false 
        return
    }
    
    if (submitForm === true) {
        let sortedArray = mushroomInstancesArray.sort((a, b) => a.id - b.id)
        let id = sortedArray.length === 0 ? 0 : sortedArray[sortedArray.length - 1].id + 1
        let newMushroom = new Mushroom(id, nameInput.value, filename, speciesInput.value, latitudeInput.value, longitudeInput.value, dateInput.value, timeInput.value, commentInput.value) 
        mushroomInstancesArray.push(newMushroom)
        localStorage.clear()
        localStorage.setItem("mushroomArray", JSON.stringify(mushroomInstancesArray))

        mainDiv.style.display = "block"
        newEntryForm.remove()
        newEntrySaveBtn.remove()
        newEntryTitle.style.margin = "1rem 0 1rem 0"
        newEntryMessage.innerHTML = `
            <p>${newMushroom.name} has been added to your foraged mushrooms!</p>
            <br>
            <a href="./newentry.html">Click here to add another mushroom.</a>
            <br>
            <br>
            <a href="./foraged.html">Click here to navigate to your foraged mushrooms.</a>
        `
    }
})

const isDateValid = (date) => {
    return !isNaN(new Date(date));
}

//GET MUSHROOMS, FORMAT AND SAVE TO LOCAL
window.onload = () => getMushrooms()

const getMushrooms = async () => {
    newEntryMessage.style.display = "block"
    newEntryMessage.innerText = "LOADING..."

    if (localStorage.getItem("mushroomArray")) {
        let mushroomInstancesArrayJson = localStorage.getItem("mushroomArray")
        mushroomInstancesArray = JSON.parse(mushroomInstancesArrayJson)
        newEntryMessage.innerText = ""
        newEntryMessage.style.display = "none"
    } else {
        try {
            let mushroomsJson = await fetch("./mushrooms.json")
            let mushroomsObj = await mushroomsJson.json()
            mushroomsArray = mushroomsObj.mushrooms
            createMushroomsInstances(mushroomsArray)
            localStorage.setItem("mushroomArray", JSON.stringify(mushroomInstancesArray))
            newEntryMessage.innerText = ""
            newEntryMessage.style.display = "none"
        } catch (error) {
            newEntryMessage.innerText = `There was an error: ${error.message}. \nTry reloading the page.`  
        } 
    }
}

const createMushroomsInstances = (array) => {
    array.forEach((element) => {
        let newMushroom = new Mushroom(element.id, element.name, element.file, element.species, element.latitude, element.longitude, element.date, element.time, element.comment) 
        mushroomInstancesArray.push(newMushroom)
    })
} 

class Mushroom {
    constructor(id, name, file, species, latitude, longitude, date, time, comment) {
        this.id = id,
        this.name = name,
        this.file = file,
        this.species = species,
        this.latitude = latitude,
        this.longitude = longitude,
        this.date = date,
        this.time = time,
        this.comment = comment
    }
}

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