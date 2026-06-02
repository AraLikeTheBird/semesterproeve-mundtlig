console.log("JS LOADED");

/* =========================
   BURGER MENU
========================= */
const burger = document.querySelector(".burgertoggle");
const nav = document.querySelector(".navlinks");

burger.addEventListener("click", () => {
    nav.classList.toggle("active");
});

/* =========================
   SCROLL BUTTON
========================= */
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
window.debugState = debugState;
function debugState(label = "") {
    console.log("========== DEBUG STATE:", label, "==========");

    console.log({
        currentMode,
        currentCategory,
        currentOption,
        savedOptions
    });

    const visibleGroup = document.querySelector(
        `.options[data-group="${currentMode}"][data-category="${currentCategory}"]`
    );

    console.log("VISIBLE GROUP:", visibleGroup);

    if (visibleGroup) {
        console.log("OPTIONS:");
        visibleGroup.querySelectorAll(".option").forEach(opt => {
            console.log({
                value: opt.dataset.value,
                isActive: opt.classList.contains("active"),
                text: opt.textContent.trim()
            });
        });
    }

    console.log("=====================================");
}
/* =========================
   STATE
========================= */
let currentMode = "shape";
let currentCategory = "head";
let currentOption = "";
let savedOptions = {};
let silhouetteActive = false;

let proportions = {
    body: { width: 1, height: 1 },
    head: { width: 1, height: 1 }
};

/* =========================
   ELEMENTS
========================= */
const leftTitle = document.getElementById("leftTitle");
const rightTitle = document.getElementById("rightTitle");
const leftInfo = document.getElementById("leftInfo");

/* =========================
   CONFIG
========================= */
const modeDefaults = {
    shape: "head",
    silhouette: "physicaltraits",
    proportion: "head"
};

const modeInfo = {
    shape: "Shape controls the base structure of the head/body.",
    silhouette: "Silhouette defines the outer outline of the avatar.",
    proportion: "Proportion adjusts size relationships between body parts."
};

/* =========================
   RESET HELPERS
========================= */
function resetOptions() {
    document.querySelectorAll(".option")
        .forEach(o => o.classList.remove("active"));

    currentOption = "";
}

function resetCategories() {
    document.querySelectorAll(".category-group button").forEach(b => b.classList.remove("active"));
}

/* =========================
   TEXT FORMAT
========================= */
function formatText(text) {
    if (!text) return "";
    return text
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
}

/* =========================
   HEADINGS
========================= */
function updateHeadings() {
    leftTitle.textContent = `Why is ${formatText(currentMode)} important?`;

    rightTitle.textContent = currentOption
        ? `What does ${formatText(currentOption)} do?`
        : "What does X element do?";
}

/* =========================
   DEFAULT OPTION
========================= */
function setDefaultOption() {

    const optionGroups = document.querySelectorAll(".options");

    const optionGroup = Array.from(optionGroups).find(g =>
        g.dataset.group === currentMode &&
        g.dataset.category === currentCategory
    );

    if (!optionGroup) return;

    const options = optionGroup.querySelectorAll(".option");
    if (!options.length) return;

    resetOptions();

    const saved = savedOptions[currentCategory];

    let activeOption =
        saved
            ? optionGroup.querySelector(`[data-value="${saved}"]`)
            : null;

    if (!activeOption) {
        activeOption = options[0];
    }

    activeOption.classList.add("active");
    currentOption = activeOption.dataset.value;

    updateAvatarLayer(currentOption);
}

/* =========================
   DEFAULT SELECTIONS
========================= */
function setDefaultSelections() {

    resetOptions();
    resetCategories();

    currentCategory = modeDefaults[currentMode];

    const defaultCategoryBtn = document.querySelector(
        `.category-group[data-mode="${currentMode}"] button[data-category="${currentCategory}"]`
    );

    if (defaultCategoryBtn) {
        defaultCategoryBtn.classList.add("active");
    }

    switchCategories();
    switchOptions();

    requestAnimationFrame(() => {
        setDefaultOption();
        updateHeadings();
    });
}

/* =========================
   MODE BUTTONS
========================= */
document.querySelectorAll(".modes button").forEach(btn => {
    btn.addEventListener("click", () => {

        document.querySelectorAll(".modes button")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        currentMode = btn.dataset.mode;
        currentCategory = modeDefaults[currentMode];
        debugState("MODE SWITCH");

        leftInfo.textContent = modeInfo[currentMode];

        setDefaultSelections();
        updateHeadings();
    });
});

/* =========================
   CATEGORY BUTTONS
========================= */
document.querySelectorAll(".category-group button").forEach(btn => {
    btn.addEventListener("click", () => {

        const category = btn.dataset.category;

        // 🔥 SILHOUETTE TOGGLE (FIXED)
        if (category === "silhouette-mode") {

            silhouetteActive = !silhouetteActive;

            document
                .getElementById("avatarPreview")
                .classList.toggle("silhouette-mode", silhouetteActive);

            btn.classList.toggle("active", silhouetteActive);

            return;
        }

        // NORMAL CATEGORY FLOW
        currentCategory = category;

        document.querySelectorAll(".category-group button")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        resetOptions();
        switchOptions();
    });
});

/* =========================
   OPTIONS
========================= */
document.querySelectorAll(".options").forEach(group => {
    group.addEventListener("click", (e) => {

        if (!e.target.classList.contains("option")) return;

        // clear current UI in group
        group.querySelectorAll(".option")
            .forEach(o => o.classList.remove("active"));

        // set new active
        e.target.classList.add("active");

        // update state
        currentOption = e.target.dataset.value;
        savedOptions[currentCategory] = currentOption;

        updateAvatarLayer(currentOption);
    });
});
function switchOptions() {

    document.querySelectorAll(".options").forEach(group => {

        const show =
            group.dataset.group === currentMode &&
            group.dataset.category === currentCategory;

        group.classList.toggle("hidden", !show);
    });

    // 🔥 CRITICAL FIX: wait for DOM to update before highlighting
    requestAnimationFrame(() => {
        setDefaultOption();
    });
}
/* =========================
   AVATAR UPDATE
========================= */
function updateAvatarLayer(value) {

    const layerType = currentCategory;
    const img = document.getElementById(`${layerType}-layer`);

    if (!img) return;

    img.src = `assets/${layerType}-${value}.png`;
}

/* =========================
   PROPORTIONS
========================= */
document.querySelectorAll('input[type="range"]').forEach(slider => {
    slider.addEventListener("input", (e) => {

        const prop = e.target.dataset.prop;
        const value = parseFloat(e.target.value);

        proportions[currentCategory][prop] = value;

        document.getElementById("body-layer").style.transform =
            `scale(${proportions.body.width}, ${proportions.body.height})`;

        document.getElementById("head-layer").style.transform =
            `scale(${proportions.head.width}, ${proportions.head.height})`;
    });
});

/* =========================
   VIEW SWITCHING
========================= */
function switchCategories() {

    document.querySelectorAll(".category-group").forEach(group => {
        group.classList.toggle("hidden", group.dataset.mode !== currentMode);
    });

    /* 🔧 FIX: ensure correct category button is active on load */
    document.querySelectorAll(".category-group button")
        .forEach(b => b.classList.remove("active"));

    const defaultCategoryBtn = document.querySelector(
        `.category-group[data-mode="${currentMode}"] button[data-category="${currentCategory}"]`
    );

    if (defaultCategoryBtn) {
        defaultCategoryBtn.classList.add("active");
    }
}

function setDefaultOption() {

    const optionGroup = Array.from(document.querySelectorAll(".options"))
        .find(g =>
            g.dataset.group === currentMode &&
            g.dataset.category === currentCategory
        );

    if (!optionGroup) return;

    const options = optionGroup.querySelectorAll(".option");
    if (!options.length) return;

    const saved = savedOptions[currentCategory];

    let activeOption =
        saved
            ? optionGroup.querySelector(`[data-value="${saved}"]`)
            : null;

    if (!activeOption) {
        activeOption = options[0];
    }

    // 🔥 clear ONLY inside correct group
    optionGroup.querySelectorAll(".option")
        .forEach(o => o.classList.remove("active"));

    activeOption.classList.add("active");

    currentOption = activeOption.dataset.value;

    updateAvatarLayer(currentOption);
}

/* =========================
   INIT
========================= */
function initUI() {

    currentMode = "shape";
    currentCategory = modeDefaults.shape;

    document.querySelectorAll(".modes button").forEach(b => {
        b.classList.toggle("active", b.dataset.mode === "shape");
    });

    leftInfo.textContent = modeInfo.shape;

    switchCategories();
    switchOptions();

    setDefaultOption();
    updateHeadings();
}

initUI();