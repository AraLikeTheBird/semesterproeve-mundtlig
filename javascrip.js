console.log("JS LOADED");
    /*burger button*/
    const burger = document.querySelector(".burgertoggle");
    const nav = document.querySelector(".navlinks");
    burger.addEventListener("click", () => {
        nav.classList.toggle("active");
    });

    //quick scroll


const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
    if (document.documentElement.scrollTop > 200) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
});

scrollBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

    // scroll to top on click
    scrollBtn.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
