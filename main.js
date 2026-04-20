/* section's  */
const sec1 = document.querySelector(".sec1");
const sec2 = document.querySelector(".sec2");
const sec3 = document.querySelector(".sec3");
const sec4 = document.querySelector(".sec4");

/* input's  */
const input = document.getElementById("input-email");
const searchInput = document.getElementById("search");

/* div*/
const divCard = document.querySelector(".here");

/* button's  */
const sign_btn = document.getElementById("sign-in");
const skip_btn = document.querySelector(".skip");

/* sec-icon  */
const home_sec = document.querySelector(".home");
const favorite_sec = document.querySelector(".favorite");

/* api  */
const api = "https://api.themoviedb.org/3/movie/popular?api_key=9bcbc45abf6ade087e9836c07de1005a";
const photoUrl = "https://image.tmdb.org/t/p/w500";

// --- وظيفة مساعدة للتحقق من المفضلة ---
function isFavorite(id) {
    const favs = JSON.parse(localStorage.getItem("myFavorites")) || [];
    return favs.includes(id.toString());
}



function showTrindingPage() {
    skip_btn.addEventListener("click", () => {
        sec1.classList.add("d-none");
        sec2.classList.remove("d-none");
    });
}
showTrindingPage();


async function trindingFilm() {
    let respons = await fetch(api);
    let jsoneResponse = await respons.json();
    let movie = jsoneResponse.results[0];

    if (movie) {
        sec2.innerHTML = `
        <div>
            <button class="exit-btn fw-bolder" title="exit">X</button>
        </div>
        <div class="container d-flex justify-content-center align-items-center">
            <div class="trend d-flex align-items-center gap-3 p-3 position-relative">
                <img src="${photoUrl}${movie.poster_path}" style="width:200px" alt="poster">
                <i class="${isFavorite(movie.id) ? 'fa-solid' : 'fa-regular'} fa-heart position-absolute fav-icon" data-id="${movie.id}" style="right: 20px; top: 20px; color: red; font-size: 25px; cursor: pointer;"></i>
                <div class="d-flex flex-column">
                    <h5 class="mb-1">${movie.title}</h5>
                    <div class="d-flex gap-2 text-muted small">
                        <span>•</span>
                        <span>${movie.release_date.split("-")[0]}</span> 
                        <span>•</span>
                        <span>${movie.vote_average.toFixed(2)} Rating</span>
                    </div>
                </div>
            </div>
        </div>`;

        document.querySelector(".exit-btn").addEventListener("click", () => {
            sec2.classList.add("d-none");
            sec3.classList.remove("d-none");
        });
    }
}
trindingFilm();


async function allmoves() {
    let movie = await fetch(api);
    let moveresult = await movie.json();
    displayMovies(moveresult.results);
}

function displayMovies(moviesList) {
    divCard.innerHTML = moviesList.map((m) => {
        return `
        <div class="col-12 col-md-3 movie-card" data-id="${m.id}" style="cursor:pointer"> 
            <div class="card text-white h-100 position-relative">
                <img src="${m.poster_path ? photoUrl + m.poster_path : './style/image/images.jpeg'}" alt="poster">
                <i class="${isFavorite(m.id) ? 'fa-solid' : 'fa-regular'} fa-heart position-absolute fav-icon" data-id="${m.id}" style="right: 15px; top: 15px; color: red; font-size: 20px;"></i>
                <h5 class="p-2">${m.title}</h5>
                <div class="d-flex">
                    <p class="p-2">${m.vote_average.toFixed(2)}</p>
                    <p class="p-2">.</p>
                    <p class="p-2">${m.release_date ? m.release_date.split("-")[0] : 'N/A'}</p>
                </div>
            </div>
        </div>`;
    }).join("");
}
allmoves();


async function showDetails(id) {
    const detailsUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=9bcbc45abf6ade087e9836c07de1005a`;
    try {
        let response = await fetch(detailsUrl);
        let m = await response.json();

        if (m.id) {
            sec3.classList.add("d-none");
            sec4.classList.remove("d-none");
            document.querySelector(".cover").src = m.backdrop_path ? photoUrl + m.backdrop_path : "./style/image/images.jpeg";
            document.querySelector(".personalPhoto").src = photoUrl + m.poster_path;
            document.querySelector(".ddddd").innerHTML = `
                <div class="d-flex flex-row text-align-end"><p class="text-white p">Release Date</p><p class="text-white test">: ${m.release_date}</p></div>
                <div class="d-flex flex-row text-align-end"><p class="text-white p">Rating</p><p class="text-white test">: ${m.vote_average.toFixed(1)} / 10</p></div>
                <div class="d-flex flex-row text-align-end"><p class="text-white p">filmName</p><p class="text-white test">: ${m.title}</p></div>
                <div class="d-flex flex-row text-align-end "><p class="text-white p">Overview</p><p class="text-white small text-end" style="line-height: 1.6;">: ${m.overview}</p></div>
            `;
            window.scrollTo(0, 0);
        }
    } catch (error) { console.error(error); }
}




divCard.addEventListener("click", (e) => {
    const favIcon = e.target.closest(".fav-icon");
    const card = e.target.closest(".movie-card");

    if (favIcon) {
       
        const movieId = favIcon.getAttribute("data-id");
        let favs = JSON.parse(localStorage.getItem("myFavorites")) || [];

        if (favs.includes(movieId)) {
            favs = favs.filter(id => id !== movieId);
            favIcon.classList.replace("fa-solid", "fa-regular");
        } else {
            favs.push(movieId);
            favIcon.classList.replace("fa-regular", "fa-solid");
        }
        localStorage.setItem("myFavorites", JSON.stringify(favs));
    } else if (card) {
        showDetails(card.getAttribute("data-id"));
    }
});

searchInput.addEventListener("input", async () => {
    let word = searchInput.value.trim();
    if (word !== "") {
        const searchApi = `https://api.themoviedb.org/3/search/movie?api_key=9bcbc45abf6ade087e9836c07de1005a&query=${word}`;
        let response = await fetch(searchApi);
        let data = await response.json();
        displayMovies(data.results);
    } else {
        allmoves();
    }
});


favorite_sec.addEventListener("click", async () => {
    const favIds = JSON.parse(localStorage.getItem("myFavorites")) || [];
    home_sec.classList.remove("act");
    favorite_sec.classList.add("act");
    sec4.classList.add("d-none");
    sec3.classList.remove("d-none");

    if (favIds.length === 0) {
        divCard.innerHTML = `<h2 class="text-white text-center mt-5">مفيش أفلام في المفضلة يا رايس </h2>`;
        return;
    }

    divCard.innerHTML = `<div class="spinner-border text-danger" role="status"></div>`;
    
    let favMoviesData = [];
    for (const id of favIds) {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=9bcbc45abf6ade087e9836c07de1005a`);
        const data = await res.json();
        favMoviesData.push(data);
    }
    displayMovies(favMoviesData);
});


home_sec.addEventListener("click", () => {
    favorite_sec.classList.remove("act");
    home_sec.classList.add("act");
    sec4.classList.add("d-none");
    sec3.classList.remove("d-none");
    allmoves();
});
