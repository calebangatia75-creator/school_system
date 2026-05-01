document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const announcementBar = document.getElementById("announcement-bar");
  const dismissAnnouncement = document.getElementById("dismiss-announcement");
  const announcementKey = "cbc_announce_dismissed_at";

  const getCookie = (name) => {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));
    return match ? match.split("=")[1] : null;
  };

  const setCookie = (name, value, days) => {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value}; max-age=${maxAge}; path=/`;
  };

  const hideAnnouncement = () => {
    if (announcementBar) {
      announcementBar.classList.add("hidden");
    }
    if (header) {
      header.classList.remove("top-12");
      header.classList.add("top-0");
    }
  };

  if (getCookie(announcementKey) === "true") {
    hideAnnouncement();
  }

  if (dismissAnnouncement) {
    dismissAnnouncement.addEventListener("click", () => {
      setCookie(announcementKey, "true", 1);
      hideAnnouncement();
    });
  }

  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      const isOpen = !mobileMenu.classList.contains("hidden");
      mobileMenu.classList.toggle("hidden");
      mobileMenuBtn.setAttribute("aria-expanded", (!isOpen).toString());
    });
  }

  const eventToggleButtons = document.querySelectorAll(".event-toggle-btn");
  const eventsList = document.getElementById("events-list");
  const eventsCalendar = document.getElementById("events-calendar");
  eventToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.getAttribute("data-view");
      eventToggleButtons.forEach((btn) => {
        btn.setAttribute("aria-pressed", "false");
        btn.classList.remove("bg-navy", "text-white");
        btn.classList.add("border", "border-navy", "text-navy");
      });
      button.setAttribute("aria-pressed", "true");
      button.classList.add("bg-navy", "text-white");
      button.classList.remove("border", "border-navy", "text-navy");

      if (eventsList && eventsCalendar) {
        if (view === "calendar") {
          eventsList.classList.add("hidden");
          eventsCalendar.classList.remove("hidden");
        } else {
          eventsList.classList.remove("hidden");
          eventsCalendar.classList.add("hidden");
        }
      }
    });
  });

  const counters = document.querySelectorAll(".stat-number");
  const animateCounter = (element) => {
    const target = Number(element.getAttribute("data-target")) || 0;
    const prefix = element.getAttribute("data-prefix") || "";
    const suffix = element.getAttribute("data-suffix") || "";
    const duration = 1200;
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(progress * target);
      const formatted = current.toLocaleString();
      element.innerHTML = `${prefix}<span class="accent">${formatted}</span>${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  if (counters.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((counter) => observer.observe(counter));
  }

  const pathwayPanel = document.getElementById("pathway-panel-content");
  const pathwayTemplates = document.getElementById("pathway-templates");
  const milestoneButtons = document.querySelectorAll(".milestone-btn");

  const loadPathwayPanel = (level) => {
    if (!pathwayPanel || !pathwayTemplates) return;
    const template = pathwayTemplates.querySelector(`[data-panel="${level}"]`);
    if (template) {
      pathwayPanel.innerHTML = template.innerHTML;
    }
    milestoneButtons.forEach((btn) => {
      const isActive = btn.getAttribute("data-level") === level;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-expanded", isActive ? "true" : "false");
    });
  };

  if (pathwayPanel && pathwayTemplates) {
    loadPathwayPanel("pp");
  }

  milestoneButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const level = btn.getAttribute("data-level");
      if (level) {
        loadPathwayPanel(level);
      }
    });
  });

  const loggedIn = localStorage.getItem("cbc_logged_in") === "true";
  const currentLevel = localStorage.getItem("cbc_level") || "lower";
  document.querySelectorAll(".progress-marker").forEach((marker) => {
    marker.style.display = "none";
  });
  if (loggedIn) {
    const activeMilestone = document.querySelector(
      `.milestone-btn[data-level="${currentLevel}"]`
    );
    if (activeMilestone) {
      const marker = activeMilestone.querySelector(".progress-marker");
      if (marker) marker.style.display = "inline-flex";
    }
    const accordionMarker = document.querySelector(
      `.accordion-item[data-level="${currentLevel}"] .accordion-marker`
    );
    if (accordionMarker) {
      accordionMarker.classList.remove("hidden");
    }
  }

  const accordionToggles = document.querySelectorAll(".accordion-toggle");
  accordionToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const panel = toggle.nextElementSibling;
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (panel) {
        panel.classList.toggle("hidden");
      }
      const icon = toggle.querySelector(".accordion-icon");
      if (icon) {
        icon.textContent = expanded ? "+" : "-";
      }
    });
  });

  const footerYear = document.getElementById("footer-year");
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
});
