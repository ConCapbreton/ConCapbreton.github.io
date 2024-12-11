let mushroomsArray
let mushroomInstancesArray = []

//EDIT ELEMENTS
const newEntryForm = document.querySelector(".new-entry-form")
const newEntryDivExterieur = document.querySelector(".new-entry-div-exterieur")
const newEntryDiv = document.querySelector(".new-entry-div")
const filenameP = document.getElementById("filename-p")
//IN THE ABSENCE OF A BACKEND FOR THIS PROJECT ONLY THE FILE NAME IS UPLOADED (ADDING A DISPLAYING PHOTOS WILL BE UPDATED LATER)
const fileInput = document.getElementById("file-input")
const nameInput = document.getElementById("name")
const speciesInput = document.getElementById("species")
const latitudeInput = document.getElementById("latitude")
const longitudeInput = document.getElementById("longitude")
const dateInput = document.getElementById("date")
const timeInput = document.getElementById("time")
const commentInput = document.getElementById("text-area")
// const imgInput = document.getElementById("newentry-image") will be needed once image upload possible

//DELETE ELEMENTS 
const foragedDiv = document.querySelector(".foraged-div")
const foragedDivTwo = document.querySelector(".foraged-div-two")
const filenamePDelete = document.getElementById("filename-p-delete")
const nameInputDelete = document.getElementById("name-delete")
const speciesInputDelete = document.getElementById("species-delete")
const latitudeInputDelete = document.getElementById("latitude-delete")
const longitudeInputDelete = document.getElementById("longitude-delete")
const dateInputDelete = document.getElementById("date-delete")
const timeInputDelete = document.getElementById("time-delete")
const commentInputDelete = document.getElementById("text-area-delete")
const deleteBtn = document.querySelector(".delete-btn")

//ELEMENTS COMMON TO BOTH
const mainDiv = document.querySelector(".main-div")
const editDeleteTitle = document.getElementById("edit-delete-title")
const editDeleteMessage = document.getElementById("edit-delete-message")

function loadPage() {
    let urlCurrent = window.location.search
    const getUrl = new URLSearchParams(urlCurrent)
    let id = Number (getUrl.get("id"))
    let page = getUrl.get("page")
    let mushroomIndex = mushroomInstancesArray.findIndex((element) => element.id === id)

    if (page === "edit") {
        editMushroom(mushroomInstancesArray[mushroomIndex])
    } else {
        deleteMushroom(mushroomInstancesArray[mushroomIndex])
    }
}

//DISPLAY MUSHROOM TO EDIT
const editMushroom = (mushroom) => {
   // hide the delete containers
   foragedDiv.style.display = "none"
    editDeleteTitle.innerText = "Edit"
    displayMushroom(mushroom)
}

//form submit event listener for Edit mushoom
newEntryForm.addEventListener("submit", (event) => {
    event.preventDefault()
    
    let formSubmit = true 
    let longLatRegex = /^[0-9]{6}$/
    let timeRegex = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/

    editDeleteMessage.style.display = "block"
    editDeleteMessage.style.marginBottom = "1rem"

    //file check - images only (length < 50) (not required)
    if (fileInput.value.length > 50) {
        editDeleteMessage.innerText = "The file name should be less than 50 characters."
        formSubmit = false 
        return
    } 
    //character limit name - 20 (required)
    if (nameInput.value.length === 0 || nameInput.value.length > 20) {   
        editDeleteMessage.innerText = "Please enter a name for your mushroom that is less than 20 characters."
        formSubmit = false   
        return 
    } 
    //species (require)
    if (speciesInput.value === "Scientific name") {
        editDeleteMessage.innerText = "Please select a species (or select \"Other\" if unknown)."
        formSubmit = false
        return 
    }
    //Lat / Long checks (6 numeric digits) - required
    if (!longLatRegex.test(latitudeInput.value) || !longLatRegex.test(longitudeInput.value)) {
        editDeleteMessage.innerText = "Please input latitide and longitude values of six digits containing only [0 - 9]"
        formSubmit = false
        return
    }
    //date - format - required
    if (!isDateValid(dateInput.value)) {
        editDeleteMessage.innerText = "Please input a valid date for when you found your mushroom."
        formSubmit = false
        return
    }
    //time - check format
    if (timeInput.value.length !== 0 && !timeRegex.test(timeInput.value)) {
        editDeleteMessage.innerText = "Please enter a valid time or leave this field empty."
        formSubmit = false 
        return
    }
    //comment check (50 characters)
    if (commentInput.value.length > 50) {
        editDeleteMessage.innerText = "Please enter a comment for your mushroom that is less than 50 characters."
        formSubmit = false 
        return
    }

    if (formSubmit === true) {
        let urlCurrent = window.location.search
        const getUrl = new URLSearchParams(urlCurrent)
        let id = Number (getUrl.get("id"))
        let filteredArray = mushroomInstancesArray.filter(element => element.id !== id) 
        let mushroomIndex = mushroomInstancesArray.findIndex(element => element.id === id)
        let fileInputValue = fileInput.value === "" ? mushroomInstancesArray[mushroomIndex].file : fileInput.value
        let newMushroom = new Mushroom(id, nameInput.value, fileInputValue, speciesInput.value, latitudeInput.value, longitudeInput.value, dateInput.value, timeInput.value, commentInput.value) 
        filteredArray.push(newMushroom)
        //better to sort by date here?
        filteredArray.sort((a, b) => a.id - b.id)
        localStorage.clear()
        localStorage.setItem("mushroomArray", JSON.stringify(filteredArray))

        mainDiv.style.display = "block"
        editDeleteTitle.style.margin = "1rem auto 1rem auto" 
        newEntryForm.remove()
        editDeleteMessage.innerHTML = `
            <p>Changes have been saved to ${newMushroom.name}!</p>
            <br>
            <a href="./foraged.html">Click here to return to your foraged mushrooms.</a>
        `
    }
})

const isDateValid = (date) => {
    return !isNaN(new Date(date));
}

//DISPLAY MUSHRROM TO DELETE
const deleteMushroom = (mushroom) => {
    //hide edit containers
    newEntryForm.style.display = "none"
    editDeleteTitle.innerText = "Confirm delete?"
    displayMushroomDelete(mushroom) 
}

//EVENT LISTENER FOR DELETING A MUSHROOM
deleteBtn.addEventListener("click", () => {
    let urlCurrent = window.location.search
    const getUrl = new URLSearchParams(urlCurrent)
    let id = Number(getUrl.get("id"))

    let deletedMushroom = mushroomInstancesArray.filter(element => element.id === id) 
    mainDiv.style.display = "block"
    editDeleteTitle.style.margin = "1rem auto 1rem auto" 
    foragedDiv.remove()
    editDeleteMessage.style.display = "block"
    editDeleteMessage.innerHTML = `
        <p>${deletedMushroom[0].name} has been deleted!</p>
        <br>
        <a href="./foraged.html">Click here to return to your foraged mushrooms.</a>
    `
    let filteredArray = mushroomInstancesArray.filter(element => element.id !== id) 
    localStorage.clear()
    localStorage.setItem("mushroomArray", JSON.stringify(filteredArray))
})

//DISPLAY A MUSHROOM TO EDIT
const displayMushroom = (mushroom) => {
    filenameP.innerText = mushroom.file
    nameInput.value = mushroom.name
    speciesInput.value = mushroom.species 
    latitudeInput.value = mushroom.latitude
    longitudeInput.value = mushroom.longitude
    dateInput.value = mushroom.date
    timeInput.value = mushroom.time
    commentInput.value = mushroom.comment
}

//DISPLAY A MUSHROOM TO DELETE
const displayMushroomDelete = (mushroom) => {
    filenamePDelete.innerText = mushroom.file
    nameInputDelete.innerText = mushroom.name
    speciesInputDelete.innerText = mushroom.species 
    latitudeInputDelete.innerText = mushroom.latitude
    longitudeInputDelete.innerText = mushroom.longitude
    dateInputDelete.innerText = mushroom.date
    timeInputDelete.innerText = mushroom.time
    commentInputDelete.innerText = mushroom.comment
}

//GET MUSHROOMS, FORMAT AND SAVE TO LOCAL
window.onload = () => getMushrooms()

const getMushrooms = async () => {
    editDeleteMessage.style.display = "block"
    editDeleteMessage.innerText = "LOADING..."

    if (localStorage.getItem("mushroomArray")) {
        let mushroomInstancesArrayJson = localStorage.getItem("mushroomArray")
        mushroomInstancesArray = JSON.parse(mushroomInstancesArrayJson)
        editDeleteMessage.style.display = "none"
    } else {
        try {
            let mushroomsJson = await fetch("./mushrooms.json")
            let mushroomsObj = await mushroomsJson.json()
            mushroomsArray = mushroomsObj.mushrooms
            createMushroomsInstances(mushroomsArray)
            localStorage.setItem("mushroomArray", JSON.stringify(mushroomInstancesArray))
            editDeleteMessage.style.display = "none"
        } catch (error) {
            editDeleteMessage.innerText = `There was an error: ${error.message}. \nTry reloading the page.`  
        } 
    }
    loadPage() 
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