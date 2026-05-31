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





//creator site
let currentMode = "shape";
let currentCategory = "head";
let currentOption = "";

const leftTitle = document.getElementById("leftTitle");
const rightTitle = document.getElementById("rightTitle");

const modeDefaults = {
    shape: "head",
    silhouette: "physicaltraits",
    proportion: "arms"
};
// ELEMENTS
const leftInfo = document.getElementById("leftInfo");
const rightInfo = document.getElementById("rightInfo");

// MODE INFO (still data-driven, but NOT options any more)
const modeInfo = {
    shape: "Shape controls the base structure of the head/body.",
    silhouette: "Silhouette defines the outer outline of the avatar.",
    proportion: "Proportion adjusts size relationships between body parts."
};

// MODE BUTTONS
document.querySelectorAll(".modes button").forEach(btn => {
    btn.addEventListener("click", () => {
        currentMode = btn.dataset.mode;
        updateHeadings();
        currentCategory = modeDefaults[currentMode];

        // update left info
        leftInfo.textContent = modeInfo[currentMode];

        // switch visible option group
        switchCategories();
        switchOptions();
    });
});

function updateAvatarLayer(value) {

    const layerType = currentCategory;

    const path = `assets/${layerType}-${value}.png`;

    console.log("Trying to load:", path); // 👈 IMPORTANT DEBUG

    const img = document.getElementById(`${layerType}-layer`);

    if (!img) {
        console.warn("Missing image element:", layerType);
        return;
    }

    img.src = path;
}
//category goup
document.querySelectorAll(".category-group button").forEach(btn => {

    btn.addEventListener("click", () => {

        currentCategory = btn.dataset.category;

        switchOptions();

    });

});
// SWITCH OPTION GROUPS
function switchOptions() {

    let found = false;

    document.querySelectorAll(".options").forEach(group => {

        const matchesMode = group.dataset.group === currentMode;
        const matchesCategory = group.dataset.category === currentCategory;

        if (matchesMode && matchesCategory) {
            group.classList.remove("hidden");
            found = true;
        } else {
            group.classList.add("hidden");
        }

    });

    if (!found) {
        console.warn("No matching options found for:", currentMode, currentCategory);
    }
}
console.log(currentMode, currentCategory);
// OPTION CLICK HANDLING (EVENT DELEGATION)
document.querySelectorAll(".options").forEach(group => {
    group.addEventListener("click", (e) => {
        if (e.target.classList.contains("option")) {

            const value = e.target.dataset.value;

            currentOption = value;   // ⭐ ADD THIS

            updateAvatarLayer(value);

            updateHeadings();        // ⭐ ADD THIS

        }
    });
});
function switchCategories() {

    document.querySelectorAll(".category-group").forEach(group => {

        if (group.dataset.mode === currentMode) {
            group.classList.remove("hidden");
        } else {
            group.classList.add("hidden");
        }

    });

}


function updateHeadings() {

    // LEFT PANEL (mode)
    leftTitle.textContent =
        `Why is ${formatText(currentMode)} important?`;

    // RIGHT PANEL (option-based)
    if (currentOption === "") {
        rightTitle.textContent = "What does X element do?";
    } else {
        rightTitle.textContent =
            `What does ${formatText(currentOption)} do?`;
    }

}
function formatText(text) {

    if (!text) return ""; // ⭐ prevents crash

    return text
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
}
// INIT
switchOptions();
leftInfo.textContent = modeInfo[currentMode];