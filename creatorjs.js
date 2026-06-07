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
let currentBodyModel = "empty-default";
let currentHeadModel = "start-image";
const clothingMap = {
    shirts: {
        "wide-crop-top": true,
        "loose-wrap-shirt": true
    },
    pants: {
        "wide-pants": true,
        "wide-shorts": true
    }
};

/* =========================
   ELEMENTS
========================= */
const leftTitle = document.getElementById("leftTitle");
const rightTitle = document.getElementById("rightTitle");
const leftInfo = document.getElementById("leftInfo");
const rightInfo = document.getElementById("rightInfo");
const headLinkedLayers = [
    "head-layer",
    "physicaltraits-layer"
];

const bodyLinkedLayers = [
    "body-layer",
    "clothes-layer"
];
/* =========================
   CONFIG
========================= */
const optionDescriptions = {
    "pointed-ears": "Sharp, animal-like ears that enhance expressive silhouette.",
    "human-ears": "Standard human ear shape with neutral proportions.",
    "canine/cat-ears": "Animal-inspired ears that change overall character style.",
    "grazer-ears": "Broad, soft ear shapes inspired by grazing animals.",

    "bob-hair": "Short, rounded haircut framing the face.",
    "slick-back": "Hair pulled tightly back for a clean silhouette.",
    "half-updo": "Hair partially tied back while keeping volume.",
    "messy-bun": "Loose bun with irregular strands for a casual look.",
    "long-loose-hair": "Extended hair length with natural flow."
};
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
function updateHeadings(activeProp = null) {

    leftTitle.textContent =
        `Why is ${formatText(currentMode)} important?`;

    /* =========================
       PROPORTION MODE (FIXED)
    ========================= */
    if (currentMode === "proportion") {

        const propName = activeProp
            ? formatText(activeProp)
            : "proportions";

        rightTitle.textContent =
            `Adjusting ${formatText(currentCategory)} ${propName}`;

        rightInfo.textContent =
            `Use the sliders to adjust ${propName} of the ${currentCategory}.`;


        return;
    }

    /* =========================
       NORMAL MODES
    ========================= */
    rightTitle.textContent = currentOption
        ? `What does ${formatText(currentOption)} do?`
        : "What does this element do?";

    rightInfo.textContent = currentOption
        ? (optionDescriptions?.[currentOption] || "No description available.")
        : "Click an option to see details here.";
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

        const option = e.target.closest(".option");
        if (!option || !group.contains(option)) return;

        group.querySelectorAll(".option")
            .forEach(o => o.classList.remove("active"));

        option.classList.add("active");

        currentOption = option.dataset.value;
        savedOptions[currentCategory] = currentOption;

        updateAvatarLayer(currentOption);

        updateHeadings();
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
function resolveClothingFit(category, value) {

    const bodyShape = currentBodyModel; // round / square / tall

    // only apply fitting for clothing categories
    if (!clothingMap[category]) {
        return value;
    }

    const path = `assets/${category}/${value}-${bodyShape}.png`;

    return path;
}
/* =========================
   AVATAR UPDATE
========================= */
function updateAvatarLayer(value) {
    const layerType = currentCategory;
    const img = document.getElementById(`${layerType}-layer`);

    if (!img) return;

    const shape = currentBodyModel; // round / square / tall-Rectangle

    const path = `assets/${layerType}/${layerType}-${value}-${shape}.png`;

    console.log("LOADING:", path);

    img.onerror = () => {
        console.warn("Missing image, falling back:", path);

        // fallback to non-shaped version
        img.src = `assets/${layerType}/${layerType}-${value}.png`;
    };

    img.src = path;

    // track state
    if (layerType === "body") currentBodyModel = value;
    if (layerType === "head") currentHeadModel = value;
}

function updateSilhouetteFit() {

    const clothesLayer = document.getElementById("clothes-layer");
    const traitsLayer = document.getElementById("physicaltraits-layer");

    // BODY-based fitting
    if (clothesLayer) {

        if (currentBodyModel === "round") {
            clothesLayer.dataset.fit = "soft";
        }

        if (currentBodyModel === "square") {
            clothesLayer.dataset.fit = "sharp";
        }

        if (currentBodyModel === "tall-Rectangle") {
            clothesLayer.dataset.fit = "tall";
        }
    }

    // HEAD-based fitting
    if (traitsLayer) {

        if (currentHeadModel === "round") {
            traitsLayer.dataset.fit = "soft";
        }

        if (currentHeadModel === "square") {
            traitsLayer.dataset.fit = "sharp";
        }

        if (currentHeadModel === "tall-Rectangle") {
            traitsLayer.dataset.fit = "tall";
        }
    }
}
/* =========================
   PROPORTIONS
========================= */

function getBodyScale() {
    return {
        w: proportions.body.width,
        h: proportions.body.height
    };
}
function applyAvatarTransforms() {

    const body = document.getElementById("body-layer");
    const head = document.getElementById("head-layer");
    const traits = document.getElementById("physicaltraits-layer");

    const shirts = document.getElementById("shirts-layer");
    const pants = document.getElementById("pants-layer");
    const overclothes = document.getElementById("overclothes-layer");

    const bodyW = proportions.body.width;
    const bodyH = proportions.body.height;

    const headW = proportions.head.width;
    const headH = proportions.head.height;

    // ======================
    // MASTER BODY SCALE
    // ======================
    const bodyTransform = `translateX(-50%) scale(${bodyW}, ${bodyH})`;

    if (body) body.style.transform = bodyTransform;

    // 👇 EVERYTHING CLOTHING COPIES BODY EXACTLY
    if (shirts) shirts.style.transform = bodyTransform;
    if (pants) pants.style.transform = bodyTransform;
    if (overclothes) overclothes.style.transform = bodyTransform;

    // ======================
    // HEAD (separate rig)
    // ======================
    if (head) {
        head.style.transform =
            `translateX(-50%) scale(${headW}, ${headH})`;
    }

    if (traits) {
        traits.style.transform =
            `translateX(-50%) scale(${headW}, ${headH})`;
    }
}
document.querySelectorAll('input[type="range"]').forEach(slider => {
    slider.addEventListener("input", (e) => {

        const prop = e.target.dataset.prop;
        const value = parseFloat(e.target.value);

        proportions[currentCategory][prop] = value;

        applyAvatarTransforms();
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