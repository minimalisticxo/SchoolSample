
/* =========================================
   THE STUDY PARK
   Website interactions and animations
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // =======================================
  // 1. LOADING SCREEN
  // =======================================

  const loader = document.querySelector(".loader");

  document.body.classList.add("loading");

  function hideLoader() {
    if (!loader) {
      document.body.classList.remove("loading");
      return;
    }

    loader.classList.add("done");
    document.body.classList.remove("loading");

    // Remove the loader from interaction after
    // its fade-out animation has completed.
    window.setTimeout(() => {
      loader.style.display = "none";
    }, 750);
  }

  // Show the complete loading screen briefly.
  window.addEventListener("load", () => {
    window.setTimeout(hideLoader, 1100);
  });

  // Fallback in case the page's load event has
  // already fired or an image takes too long.
  window.setTimeout(hideLoader, 3500);


  // =======================================
  // 2. MOBILE NAVIGATION
  // =======================================

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  function closeMenu() {
    if (!menuToggle || !nav) return;

    nav.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && nav) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");

      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    // Close the menu after selecting a section.
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close the menu when clicking outside it.
    document.addEventListener("click", (event) => {
      if (
        nav.classList.contains("open") &&
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    // Keep the navigation in the correct state
    // when switching between mobile and desktop.
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 650) {
        closeMenu();
      }
    });
  }


  // =======================================
  // 3. SCROLL REVEAL ANIMATIONS
  // =======================================

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element, index) => {
      // A subtle stagger creates a more natural feel.
      element.style.transitionDelay =
        `${Math.min(index % 4, 3) * 90}ms`;

      revealObserver.observe(element);
    });
  } else {
    // Fallback for older browsers.
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }


  // =======================================
  // 4. CURRENT YEAR IN FOOTER
  // =======================================

  const yearElement = document.querySelector("[data-year]");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  // =======================================
  // 5. SMOOTH ANCHOR NAVIGATION
  // =======================================

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "start"
      });

      // Update the URL without an abrupt jump.
      if (history.replaceState) {
        history.replaceState(null, "", targetId);
      }
    });
  });


  // =======================================
  // 6. IMAGE FALLBACKS
  // =======================================

  document.querySelectorAll("img[data-fallback]").forEach((img) => {
    img.addEventListener("error", () => {
      const fallback = img.dataset.fallback;

      if (fallback && img.src !== new URL(fallback, location.href).href) {
        img.src = fallback;
      }
    });
  });


  // =======================================
  // 7. BACK TO TOP
  // =======================================

  document.querySelectorAll(".back-top").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth"
      });
    });
  });


  console.log("THE STUDY PARK website is ready.");
});
