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

const ripple = document.getElementById("themeRipple");
const btn = document.getElementById("themeToggle");

let darkMode = false;

btn.addEventListener("click", () => {

    // 1. GET POSITION
    const rect = btn.getBoundingClientRect();

    ripple.style.left = rect.left + rect.width / 2 + "px";
    ripple.style.top = rect.top + rect.height / 2 + "px";

    // 2. START RIPPLE
    ripple.classList.remove("active");
    void ripple.offsetWidth;
    ripple.classList.add("active");

    // 3. SWITCH THEME MID-ANIMATION
    setTimeout(() => {
        darkMode = !darkMode;

        document.body.classList.toggle("dark", darkMode);
    }, 325);

    // 4. CLEANUP
    setTimeout(() => {
        ripple.classList.remove("active");
    }, 400);
});