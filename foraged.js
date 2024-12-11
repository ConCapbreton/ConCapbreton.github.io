//FOR THE FUTURE YOU MIGHT CONSIDER PAGINATION OF THE FORAGED MUSHROOMS

let mushroomsArray
let mushroomInstancesArray = []

const firstMushroom = document.getElementById("first-mushroom")
const foragedMushroom = document.getElementById("foraged-mushrooms")
const mainDiv = document.querySelector(".main-div")
const foragedMessage = document.getElementById("foraged-message")
foragedMessage.style.display = "none"

const displayMushrooms = () => {
    if (mushroomInstancesArray.length === 0) {
        foragedMessage.style.display = "block"
        foragedMessage.innerText = "You have no mushrooms to display"
        return
    }
    
    firstMushroom.innerHTML = displayOne(mushroomInstancesArray[0])

    for (let i = 1; i < mushroomInstancesArray.length; i++) {
        foragedMushroom.innerHTML += displayOne(mushroomInstancesArray[i])
    }
}

const displayOne = (mushroom) => {
    return (`
        <div class="foraged-div">
            <div class="foraged-image-div">
                <svg id="svg-pic" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-image-fill" viewBox="0 0 16 16">
                    <path d="M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2zm1 9v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062zm5-6.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
                </svg>
                <!-- <img src="" alt="Uploaded picture" id="newentry-image"> THIS IMG ELEMENT WILL BE NEEDED ONCE THE BACKEND IS IN PLACE AND FILES CAN BE UPLOADED-->
                <p>${mushroom.file}</p>    
            </div>
            <div class="foraged-div-two">
                <p class="column-one">Name:</p>
                <p class="column-two">${mushroom.name}</p>
                <p class="column-one">Species:</p>
                <p class="column-two">${mushroom.species}</p>
                <p class="column-one">Latitude:</p>
                <p class="column-two">${mushroom.latitude}</p>
                <p class="column-one">Longitude:</p>
                <p class="column-two">${mushroom.longitude}</p>
                <p class="column-one">Date:</p>
                <p class="column-two">${mushroom.date}</p>
                <p class="column-one" >Time:</p>
                <p class="column-two">${mushroom.time}</p>
                <p class="column-one">Comments:</p>
                <p class="column-two">${mushroom.comment}</p>
            </div>
            <div class="foraged-btn-div">
                <button class="edit-btn" id="${mushroom.id}-edit" value=${mushroom.id}><a href="./editDelete.html?page=edit&id=${mushroom.id}">Edit</a></button>
                <button class="delete-btn" id="${mushroom.id}-delete" value=${mushroom.id}><a href="./editDelete.html?page=delete&id=${mushroom.id}">Delete</button>
            </div>
        </div>
    `)
}

// FOR SMALL SCREEN FILTER BTN FUNCTION 

const filterBtn = document.getElementById("filter-btn")

filterBtn.addEventListener("click", () => {
    const filterDiv = document.getElementById("filter-div")
    filterDiv.style.display = filterDiv.style.display === "grid" ? "none" : "grid" 
})

//FILTER FUNCTION

let nameSpeciesInput = document.getElementById("name-or-species")
let startDateInput = document.getElementById("start-date")
let endDateInput = document.getElementById("end-date")

const searchFunction = () => {
    foragedMessage.innerText = ""
    
    // if inputs is empty and dates are not in the correct format display full list and return out of the function
    if (nameSpeciesInput.value === '' && !isDateValid(startDateInput.value) && !isDateValid(endDateInput.value)) {
        firstMushroom.innerHTML = ""
        foragedMushroom.innerHTML = ""
        displayMushrooms()
        return
    }

    //Otherwise display the filtered mushrooms
    let searchArray = []
    firstMushroom.innerHTML = ""
    foragedMushroom.innerHTML = ""

    if (nameSpeciesInput.value !== "") {
        console.log("You are in the name or species")
        mushroomInstancesArray.forEach(element => {
            let nameOrSpeciesSearch = nameSpeciesInput.value.toLowerCase()
            let elementName = element.name.toLowerCase()
            let elementSpecies = element.species.toLowerCase()

            if (elementName.includes(nameOrSpeciesSearch) || elementSpecies.includes(nameOrSpeciesSearch)) {
                searchArray.push(element)
            }
        })
    } 
    
    if (isDateValid(startDateInput.value)) {
        let tempSearchArray 
        tempSearchArray = nameSpeciesInput.value === "" ? mushroomInstancesArray : searchArray     
        
        //REMOVE MUSHROOMS IN SEARCH ARRAY BEFORE THE INPUT DATE
        let startInputDate = new Date(startDateInput.value);
        
        let startDateArray = []
        tempSearchArray.forEach(element => {
            let elementDate = new Date(element.date)
            if (startInputDate < elementDate) {startDateArray.push(element)}
        })
        
        searchArray = startDateArray        
        
    }
    
    if (isDateValid(endDateInput.value)) {
        let tempSearchArray 
        tempSearchArray = nameSpeciesInput.value === "" && !isDateValid(startDateInput.value) ? mushroomInstancesArray : searchArray     
        let endInputDate = new Date(endDateInput.value);
        
        let endDateArray = []
        tempSearchArray.forEach(element => {
            let elementDate = new Date(element.date)
            if (endInputDate > elementDate) {endDateArray.push(element)}
        })
        searchArray = endDateArray
    }
    
    if (searchArray.length === 0) {
        foragedMessage.style.display = "block"
        foragedMessage.innerText = "None of your mushrooms meet these search criteria."
        return
    } else {
        for (let i = 0; i < searchArray.length; i++) {
            foragedMushroom.innerHTML += displayOne(searchArray[i])
        }
    }

}

const isDateValid = (date) => {
    return !isNaN(new Date(date));
  }

//GET MUSHROOMS 
window.onload = () => getMushrooms()

const getMushrooms = async () => {
    foragedMessage.style.display = "block"
    foragedMessage.innerText = "LOADING..."

    if (localStorage.getItem("mushroomArray")) {
        let mushroomInstancesArrayJson = localStorage.getItem("mushroomArray")
        mushroomInstancesArray = JSON.parse(mushroomInstancesArrayJson)
        foragedMessage.style.display = "none"
    } else {
        try {
            let mushroomsJson = await fetch("./mushrooms.json")
            let mushroomsObj = await mushroomsJson.json()
            mushroomsArray = mushroomsObj.mushrooms
            createMushroomsInstances(mushroomsArray)
            localStorage.setItem("mushroomArray", JSON.stringify(mushroomInstancesArray))
            foragedMessage.style.display = "none"
        } catch (error) {
            foragedMessage.innerText = `There was an error: ${error.message}. \nTry reloading the page.`
        } 
    }
    displayMushrooms()
}

const createMushroomsInstances = (array) => {
    array.forEach((element) => {
        let newMushroom = new Mushroom(element.id, element.name, element.file, element.species, element.latitude, element.longitude, element.date, element.time, element.comment) 
        mushroomInstancesArray.push(newMushroom)
    })

    displayMushrooms()
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