/* =========================================================
   THE STUDY PARK
   CINEMATIC WALKTHROUGH ENGINE
========================================================= */

"use strict";


/* =========================================================
   ELEMENTS
========================================================= */

const loader = document.getElementById("loader");
const progressFill = document.getElementById("progressFill");
const currentScene = document.getElementById("currentScene");

const scenes = Array.from(
    document.querySelectorAll(".walk-scene")
);

const glassCards = Array.from(
    document.querySelectorAll(".glass-card")
);


/* =========================================================
   SETTINGS
========================================================= */

const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isTouchDevice =
    window.matchMedia("(pointer: coarse)").matches;


/* =========================================================
   LOADING SCREEN
========================================================= */

window.addEventListener("load", () => {

    const minimumLoaderTime = 2600;

    setTimeout(() => {

        if (loader) {
            loader.classList.add("is-hidden");
        }

    }, minimumLoaderTime);

});


/* =========================================================
   SCROLL STATE
========================================================= */

let scrollY = window.scrollY;

let viewportHeight = window.innerHeight;

let documentHeight =
    document.documentElement.scrollHeight - viewportHeight;

let ticking = false;


/* =========================================================
   UPDATE DIMENSIONS
========================================================= */

function updateDimensions() {

    viewportHeight = window.innerHeight;

    documentHeight =
        document.documentElement.scrollHeight -
        viewportHeight;

}


/* =========================================================
   NORMALIZED SCROLL
========================================================= */

function getScrollProgress() {

    if (documentHeight <= 0) {
        return 0;
    }

    return Math.min(
        Math.max(scrollY / documentHeight, 0),
        1
    );

}


/* =========================================================
   SCENE PROGRESS
========================================================= */

function getSceneProgress(scene) {

    const rect = scene.getBoundingClientRect();

    const sceneHeight = rect.height;

    const distance =
        viewportHeight - rect.top;

    const progress =
        distance / (viewportHeight + sceneHeight);

    return Math.min(
        Math.max(progress, 0),
        1
    );

}


/* =========================================================
   CURRENT SCENE
========================================================= */

function updateCurrentScene() {

    let activeIndex = 0;

    let smallestDistance = Infinity;

    scenes.forEach((scene, index) => {

        const rect = scene.getBoundingClientRect();

        const sceneCenter =
            rect.top + rect.height / 2;

        const distance =
            Math.abs(
                viewportHeight / 2 -
                sceneCenter
            );

        if (distance < smallestDistance) {

            smallestDistance = distance;
            activeIndex = index;

        }

    });

    const sceneNumber =
        String(activeIndex + 1).padStart(2, "0");

    if (currentScene) {
        currentScene.textContent = sceneNumber;
    }

}


/* =========================================================
   GLOBAL PROGRESS
========================================================= */

function updateGlobalProgress() {

    const progress =
        getScrollProgress() * 100;

    if (progressFill) {
        progressFill.style.width =
            `${progress}%`;
    }

}


/* =========================================================
   GLASS CARD ANIMATION
========================================================= */

function updateGlassCards() {

    glassCards.forEach(card => {

        const parentScene =
            card.closest(".walk-scene");

        if (!parentScene) {
            return;
        }

        const rect =
            parentScene.getBoundingClientRect();

        const sceneHeight =
            parentScene.offsetHeight;

        const viewportCenter =
            viewportHeight * 0.5;

        const sceneCenter =
            rect.top + sceneHeight / 2;

        const distanceFromCenter =
            Math.abs(
                viewportCenter -
                sceneCenter
            );

        const visibilityRange =
            viewportHeight * 0.7;

        const visible =
            distanceFromCenter <
            visibilityRange;

        if (visible) {

            card.classList.add("is-visible");

        } else {

            card.classList.remove("is-visible");

        }

    });

}


/* =========================================================
   SCENE PARALLAX
========================================================= */

function updateSceneParallax() {

    if (prefersReducedMotion) {
        return;
    }

    scenes.forEach(scene => {

        const image =
            scene.querySelector(".scene-image");

        if (!image) {
            return;
        }

        const rect =
            scene.getBoundingClientRect();

        const sceneProgress =
            getSceneProgress(scene);

        const offset =
            (sceneProgress - 0.5) * 40;

        image.style.transform =
            `scale(1.06) translate3d(0, ${offset}px, 0)`;

    });

}


/* =========================================================
   HERO MOTION
========================================================= */

function updateHero() {

    const hero =
        document.querySelector(".scene-gate");

    if (!hero) {
        return;
    }

    const heroTitle =
        hero.querySelector(".hero-title");

    const heroDescription =
        hero.querySelector(".hero-description");

    const eyebrow =
        hero.querySelector(".eyebrow");

    const scrollIndicator =
        hero.querySelector(".scroll-indicator");

    const rect =
        hero.getBoundingClientRect();

    const progress =
        Math.min(
            Math.max(
                -rect.top / viewportHeight,
                0
            ),
            1
        );

    if (heroTitle) {

        heroTitle.style.transform =
            `translate3d(0, ${progress * -90}px, 0)`;

        heroTitle.style.opacity =
            `${1 - progress * 1.25}`;

    }

    if (heroDescription) {

        heroDescription.style.transform =
            `translate3d(0, ${progress * -45}px, 0)`;

        heroDescription.style.opacity =
            `${1 - progress * 1.5}`;

    }

    if (eyebrow) {

        eyebrow.style.opacity =
            `${1 - progress * 1.5}`;

    }

    if (scrollIndicator) {

        scrollIndicator.style.opacity =
            `${1 - progress * 2}`;

    }

}


/* =========================================================
   ENTERING CAMPUS
========================================================= */

function updateEnteringScene() {

    const scene =
        document.querySelector(".scene-enter");

    if (!scene) {
        return;
    }

    const card =
        scene.querySelector(".glass-card");

    const rect =
        scene.getBoundingClientRect();

    const progress =
        Math.min(
            Math.max(
                (viewportHeight - rect.top) /
                (viewportHeight + rect.height),
                0
            ),
            1
        );

    if (card) {

        const movement =
            (0.5 - progress) * 80;

        card.style.transform =
            `translate3d(0, ${movement}px, 0)`;

    }

}


/* =========================================================
   MOUSE PARALLAX
========================================================= */

let mouseX = 0;
let mouseY = 0;

let targetMouseX = 0;
let targetMouseY = 0;


if (!isTouchDevice && !prefersReducedMotion) {

    window.addEventListener(
        "mousemove",
        event => {

            targetMouseX =
                (event.clientX / window.innerWidth - 0.5);

            targetMouseY =
                (event.clientY / window.innerHeight - 0.5);

        },
        { passive: true }
    );

}


function updateMouseParallax() {

    if (
        isTouchDevice ||
        prefersReducedMotion
    ) {
        return;
    }

    mouseX +=
        (targetMouseX - mouseX) * 0.05;

    mouseY +=
        (targetMouseY - mouseY) * 0.05;

    const cards =
        document.querySelectorAll(".glass-card");

    cards.forEach(card => {

        const x =
            mouseX * 7;

        const y =
            mouseY * 7;

        if (
            card.classList.contains("is-visible")
        ) {

            card.style.marginLeft =
                `${x}px`;

            card.style.marginTop =
                `${y}px`;

        }

    });

}


/* =========================================================
   MAIN ANIMATION LOOP
========================================================= */

function update() {

    scrollY = window.scrollY;

    updateGlobalProgress();
    updateCurrentScene();

    updateGlassCards();
    updateSceneParallax();

    updateHero();
    updateEnteringScene();

    updateMouseParallax();

    ticking = false;

}


/* =========================================================
   SCROLL LISTENER
========================================================= */

window.addEventListener(
    "scroll",
    () => {

        if (!ticking) {

            window.requestAnimationFrame(
                update
            );

            ticking = true;

        }

    },
    { passive: true }
);


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        updateDimensions();

        window.requestAnimationFrame(
            update
        );

    },
    { passive: true }
);


/* =========================================================
   INITIALIZE
========================================================= */

updateDimensions();

update();


/* =========================================================
   OPTIONAL IMAGE LOADING
========================================================= */

/*
    Later, when the principal gives you photos,
    you can add them here.

    Example:

    setSceneImage(
        ".scene-gate .scene-image",
        "assets/images/01-gate.jpg"
    );
*/

function setSceneImage(selector, imagePath) {

    const element =
        document.querySelector(selector);

    if (!element) {
        return;
    }

    const image =
        new Image();

    image.onload = () => {

        element.style.backgroundImage =
            `url("${imagePath}")`;

        element.classList.add(
            "has-image"
        );

    };

    image.src = imagePath;

}


/* =========================================================
   FUTURE IMAGE MAP
========================================================= */

/*
setSceneImage(
    ".scene-gate .scene-image",
    "assets/images/01-gate.jpg"
);

setSceneImage(
    ".scene-enter .scene-image",
    "assets/images/02-entering.jpg"
);

setSceneImage(
    ".scene-assembly .scene-image",
    "assets/images/03-assembly.jpg"
);

setSceneImage(
    ".scene-office-walk .scene-image",
    "assets/images/04-office-walk.jpg"
);

setSceneImage(
    ".scene-office .scene-image",
    "assets/images/05-office.jpg"
);

setSceneImage(
    ".scene-stairs .scene-image",
    "assets/images/06-stairs.jpg"
);

setSceneImage(
    ".scene-second-floor .scene-image",
    "assets/images/07-second-floor.jpg"
);

setSceneImage(
    ".scene-corridor .scene-image",
    "assets/images/08-corridor.jpg"
);

setSceneImage(
    ".scene-classrooms .scene-image",
    "assets/images/09-classroom.jpg"
);

setSceneImage(
    ".scene-chemistry .scene-image",
    "assets/images/11-chemistry.jpg"
);

setSceneImage(
    ".scene-computer .scene-image",
    "assets/images/12-computer-lab.jpg"
);
*/


/* =========================================================
   MENU BUTTON MICRO INTERACTION
========================================================= */

const menuButton =
    document.querySelector(".menu-button");

if (menuButton) {

    menuButton.addEventListener(
        "click",
        () => {

            menuButton.classList.toggle(
                "active"
            );

        }
    );

}


/* =========================================================
   KEYBOARD ACCESSIBILITY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            if (menuButton) {

                menuButton.classList.remove(
                    "active"
                );

            }

        }

    }
);