const reusltsNav = document.getElementById("resultsNav")
const favourtiesNav = document.getElementById("favourtiesNav")
const imagesContainer = document.querySelector(".images-container")
const saveConfirmed = document.querySelector(".save-confirmed")
const loader = document.querySelector(".loader")
const bg = document.querySelector(".background")
    // NASA API
const count = 10
const apiKey = "7DKPzwWbQURwqvPQW962OXeErtrmVoNDcg5cRLmV"
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`
    // Local Storage
let favourites = {}
    // Result
let resultsArray = []
    // Add to Favourites
function saveFavourite(itemUrl) {
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favourites[item.url]) {
            favourites[item.url] = item
            saveConfirmed.classList.remove("hidden")

            setTimeout(() => {
                saveConfirmed.classList.add("hidden")
            }, 2000)
            localStorage.setItem("Favourites NASA", JSON.stringify(favourites))
        }
    })
}
// Delete from favourites
function deleteFavourite(itemUrl) {
    if (favourites[itemUrl]) {
        delete favourites[itemUrl]
        localStorage.setItem("Favourites NASA", JSON.stringify(favourites))
        updateDOM("favourites")
    }
}
// Show Content after Loading
function showContent(page) {
    window.scrollTo({ top: 0, behavior: "instant" })
    if (page == "results") {
        resultsNav.classList.remove("hidden")
        favouritesNav.classList.add("hidden")
    } else {
        favouritesNav.classList.remove("hidden")
        resultsNav.classList.add("hidden")
    }
    bg.classList.remove("hidden")
    loader.classList.add("hidden")
}

function createDOMNodes(page) {
    let currentArray =
        page === "results" ? resultsArray : Object.values(favourites)

    currentArray.forEach((result) => {
        // Card Container
        const card = document.createElement("div")
        card.classList.add("card")
            // Link
        const anchorEl = document.createElement("a")
        anchorEl.href = result.hdurl
        anchorEl.title = "View Fill Image"
        anchorEl.target = "_blank"
            // Image Element
        const imgEl = document.createElement("img")
        imgEl.classList.add("card-img-top")
        imgEl.alt = result.title
        imgEl.src = result.url
        imgEl.loading = "lazy"
        anchorEl.appendChild(imgEl)
            // Card Body
        const cardBody = document.createElement("div")
        cardBody.classList.add("card-body")
            // Card Title
        const cardTitle = document.createElement("h5")
        cardTitle.classList.add("card-title")
        cardTitle.textContent = result.title
            // Add To favourite
        const addFavourite = document.createElement("p")
        addFavourite.classList.add("add-to-favourites")
        if (page === "results") {
            const addIcon = document.createElement("i")
            addIcon.classList.add("far", "fa-heart")
            const addFavouriteText = document.createElement("span")
            addFavouriteText.classList.add("addFavouriteText")
            addFavouriteText.textContent = " Add to favourites"
            addFavourite.append(addIcon, addFavouriteText)
            addFavourite.setAttribute("onclick", `saveFavourite('${result.url}')`)
        } else {
            const addIcon = document.createElement("i")
            addIcon.classList.add("fas", "fa-trash")
            const addFavouriteText = document.createElement("span")
            addFavouriteText.classList.add("addFavouriteText")
            addFavouriteText.textContent = " Delete from favourites"
            addFavourite.append(addIcon, addFavouriteText)
            addFavourite.setAttribute("onclick", `deleteFavourite('${result.url}')`)
        }

        const cardText = document.createElement("p")
        cardText.classList.add("card-text")
        cardText.textContent = result.explanation
        const cardFooter = document.createElement("small")
        cardFooter.classList.add("text-muted")
        const date = document.createElement("strong")
        date.textContent = result.date
        const copyRight = document.createElement("span")
        copyRight.textContent = ` ${result.copyright ? result.copyright : ""}`
        cardFooter.append(date, copyRight)
        cardBody.append(cardTitle, addFavourite, cardText, cardFooter)
        card.append(anchorEl, cardBody)
        imagesContainer.append(card)
    })
}
// Update DOM
function updateDOM(page) {
    // Get Favourites
    if (localStorage.getItem("Favourites NASA")) {
        favourites = JSON.parse(localStorage.getItem("Favourites NASA"))
    }
    imagesContainer.textContent = ""
    createDOMNodes(page)
    showContent(page)
}
// Get 10 posts from NASA API
async function getPictures() {
    loader.classList.remove("hidden")
    bg.classList.add("hidden")

    try {
        const response = await fetch(apiURL)
        resultsArray = await response.json()
        updateDOM("results")
    } catch (err) {
        console.log("Error: ", err)
    }
}
getPictures()