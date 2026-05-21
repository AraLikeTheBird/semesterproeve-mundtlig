    /*burger button*/
    const burger = document.querySelector(".burgertoggle");
    const nav = document.querySelector(".navlinks");
    burger.addEventListener("click", () => {
        nav.classList.toggle("active");
    });