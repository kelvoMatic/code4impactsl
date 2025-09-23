// Basic site interactions
(function () {
  function $(sel, root = document) {
    return root.querySelector(sel);
  }
  function setYear() {
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.getElementById("primary-menu");
    if (!toggle || !menu) return;
    function setOpen(isOpen) {
      menu.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    }
    toggle.addEventListener("click", function () {
      var open = menu.classList.contains("open");
      setOpen(!open);
    });
    document.addEventListener("click", function (e) {
      if (!menu.classList.contains("open")) return;
      if (!menu.contains(e.target) && !toggle.contains(e.target))
        setOpen(false);
    });
  }

  function hydrateHomeFromFocus(data) {
    var highlights = document.getElementById("hero-highlights");
    if (!highlights) return;
    var focusItems =
      (data && data.en && data.en.focus && data.en.focus.items) || [];
    var items = [];
    if (focusItems.length) {
      items = focusItems.slice(0, 4).map(function (it) {
        return it.title;
      });
    } else if (!highlights.children.length) {
      items = [
        "Inclusive tech education",
        "Real-world community projects",
        "Youth and women empowerment",
        "Open-source and collaboration",
      ];
    }
    if (!items.length) return;
    highlights.innerHTML = "";
    items.forEach(function (text) {
      var li = document.createElement("li");
      var icon = document.createElement("i");
      icon.className = "fa-solid fa-circle-check";
      li.appendChild(icon);
      li.appendChild(document.createTextNode(" " + text));
      highlights.appendChild(li);
    });
  }

  async function loadSiteData() {
    try {
      var res = await fetch("assets/data/site-data.json", {
        cache: "no-store",
      });
      return await res.json();
    } catch (e) {
      console.error("Failed to load site data", e);
      return null;
    }
  }

  function renderFocusAreas(data) {
    var grid = document.getElementById("focus-grid");
    if (!grid) return;
    var items = (data && data.en && data.en.focus && data.en.focus.items) || [];
    if (!items.length) return;
    grid.innerHTML = "";
    items.forEach(function (item) {
      var card = document.createElement("div");
      card.className = "feature-card";
      var title = document.createElement("h3");
      title.textContent = item.title;
      var tagline = document.createElement("div");
      tagline.className = "feature-tagline";
      tagline.textContent = item.tagline || "";

      // Add Read More button
      var readMoreBtn = document.createElement("a");

      // Create specific links for each focus area
      var focusUrl = "#"; // default fallback
      if (item.title.includes("Digital Literacy")) {
        focusUrl = "digital-literacy.html";
      } else if (item.title.includes("Youth Skills")) {
        focusUrl = "youth-skills.html";
      } else if (item.title.includes("CivicTech")) {
        focusUrl = "civictech.html";
      } else if (item.title.includes("Sustainable Development")) {
        focusUrl = "tech-sustainable-development.html";
      }

      readMoreBtn.href = focusUrl;
      readMoreBtn.className = "btn btn-primary read-more-btn";
      readMoreBtn.textContent = "Read More";
      readMoreBtn.setAttribute("aria-label", "Learn more about " + item.title);

      card.appendChild(title);
      if (item.tagline) card.appendChild(tagline);
      card.appendChild(readMoreBtn);
      grid.appendChild(card);
    });
  }

  function renderMission(data) {
    var el = document.getElementById("mission");
    if (!el) return;
    var text =
      (data &&
        data.en &&
        data.en.about &&
        data.en.about.mission &&
        data.en.about.mission.body) ||
      "";
    if (!text) return;
    el.textContent = text;
  }

  function renderVision(data) {
    var el = document.getElementById("vision");
    if (!el) return;
    var text =
      (data &&
        data.en &&
        data.en.about &&
        data.en.about.vision &&
        data.en.about.vision.body) ||
      "";
    if (!text) return;
    el.textContent = text;
  }

  function renderValues(data) {
    var list = document.getElementById("values");
    if (!list) return;
    var items =
      (data &&
        data.en &&
        data.en.about &&
        data.en.about.values &&
        data.en.about.values.items) ||
      [];
    if (!items.length) return;
    list.innerHTML = "";
    items.forEach(function (v) {
      var li = document.createElement("li");
      var p = document.createElement("p");
      p.textContent = v.title;
      li.appendChild(p);
      list.appendChild(li);
    });
  }

  function renderHistory(data) {
    var el = document.getElementById("history");
    if (!el) return;
    var parts =
      (data &&
        data.en &&
        data.en.about &&
        data.en.about.history &&
        data.en.about.history.body) ||
      [];
    if (!Array.isArray(parts) || !parts.length) return;
    el.innerHTML = "";
    parts.forEach(function (p) {
      var para = document.createElement("p");
      para.textContent = p;
      el.appendChild(para);
    });
  }

  function renderTeam(data) {
    var grid = document.getElementById("team-grid");
    if (!grid) return;
    var items =
      (data &&
        data.en &&
        data.en.about &&
        data.en.about.team &&
        data.en.about.team.items) ||
      [];
    if (!items.length) return;
    grid.innerHTML = "";
    items.forEach(function (m) {
      var card = document.createElement("div");
      card.className = "team-card";
      var img = document.createElement("img");
      img.src =
        m.image ||
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1200&auto=format&fit=crop";
      img.alt = m.name || "Team member";
      var info = document.createElement("div");
      info.className = "info";
      var name = document.createElement("div");
      name.className = "name";
      name.textContent = m.name || "";
      var role = document.createElement("div");
      role.className = "role";
      role.textContent = m.role || "";
      info.appendChild(name);
      info.appendChild(role);
      card.appendChild(img);
      card.appendChild(info);
      grid.appendChild(card);
    });
  }

  function renderInvolved(data) {
    var v = document.getElementById("volunteer-copy");
    var p = document.getElementById("partner-copy");
    var d = document.getElementById("donate-copy");
    var involved = (data && data.en && data.en.involved) || null;
    if (v && involved && involved.volunteer && involved.volunteer.body)
      v.textContent = involved.volunteer.body;
    if (p && involved && involved.partner && involved.partner.body)
      p.textContent = involved.partner.body;
    if (d && involved && involved.donate && involved.donate.body)
      d.textContent = involved.donate.body;
  }

  function renderDonateMethods(data) {
    var container = document.getElementById("donate-methods");
    if (!container) return;
    var donate =
      (data && data.en && data.en.involved && data.en.involved.donate) || null;
    if (!donate || !donate.methods) return;
    container.innerHTML = "";

    var methods = donate.methods;

    if (methods.flutterwave && methods.flutterwave.amountOptions) {
      methods.flutterwave.amountOptions.forEach(function (amt) {
        var btn = document.createElement("button");
        btn.className = "btn btn-primary donate-btn";
        btn.textContent = "$" + amt;
        btn.addEventListener("click", function () {
          alert(
            "Proceed to donate $" + amt + " via Flutterwave (setup required)."
          );
        });
        container.appendChild(btn);
      });
    }

    function addCopyRow(label, value, logoUrl) {
      var row = document.createElement("div");
      row.style.display = "inline-flex";
      row.style.alignItems = "center";
      row.style.gap = "8px";
      row.style.cursor = "pointer";
      row.setAttribute("role", "button");
      row.setAttribute("tabindex", "0");
      var span = document.createElement("span");
      span.className = "donate-info";
      if (logoUrl) {
        var logo = document.createElement("img");
        logo.src = logoUrl;
        logo.alt = label + " logo";
        logo.className = "donate-logo";
        span.appendChild(logo);
      } else if (label === "Bank Transfer") {
        var icon = document.createElement("i");
        icon.className = "fa-solid fa-building-columns donate-icon";
        span.appendChild(icon);
      }
      var strong = document.createElement("strong");
      strong.textContent = label + ": ";
      span.appendChild(strong);

      function doCopy() {
        navigator.clipboard.writeText(value).then(function () {
          var prev = strong.textContent;
          strong.textContent = label + ": Copied! ";
          setTimeout(function () {
            strong.textContent = prev;
          }, 1200);
        });
      }

      row.addEventListener("click", doCopy);
      row.addEventListener("keypress", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          doCopy();
        }
      });

      row.appendChild(span);
      container.appendChild(row);
    }

    if (methods.orangeMoney) {
      addCopyRow(
        "Orange Money",
        methods.orangeMoney.phone +
          " (" +
          methods.orangeMoney.accountName +
          ")",
        methods.orangeMoney.logo
      );
    }
    if (methods.afriMoney) {
      addCopyRow(
        "Afrimoney",
        methods.afriMoney.phone + " (" + methods.afriMoney.accountName + ")",
        methods.afriMoney.logo
      );
    }
    if (methods.bankTransfer) {
      var bt = methods.bankTransfer;
      var bankPayload =
        bt.bankName +
        " | " +
        bt.accountName +
        " | " +
        bt.accountNumber +
        (bt.branch ? " | " + bt.branch : "") +
        (bt.swift ? " | SWIFT: " + bt.swift : "") +
        (bt.currency ? " | " + bt.currency : "");
      addCopyRow("Bank Transfer", bankPayload, null);
    }
  }

  function renderBlogGrid(data) {
    var grid = document.getElementById("blog-grid");
    if (!grid) return;
    var items = (data && data.en && data.en.blog && data.en.blog.items) || [];
    if (!items.length) return;

    var currentFilter = "all";
    var filters = document.querySelectorAll(".filter");

    function renderItems(filter) {
      grid.innerHTML = "";
      var filteredItems =
        filter === "all"
          ? items
          : items.filter(function (item) {
              return item.category === filter;
            });

      filteredItems.forEach(function (item) {
        var card = document.createElement("div");
        card.className = "card";
        var img = document.createElement("img");
        img.src =
          item.image ||
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop";
        img.alt = item.title;
        var content = document.createElement("div");
        content.className = "content";
        var title = document.createElement("h3");
        title.textContent = item.title;
        var excerpt = document.createElement("p");
        excerpt.textContent = item.excerpt || "";
        var meta = document.createElement("div");
        meta.className = "meta";
        var date = document.createElement("span");
        date.textContent = item.date || "";
        var category = document.createElement("span");
        category.textContent = item.category || "";

        // Add Read More button
        var readMoreBtn = document.createElement("a");

        // Create specific links for each blog post
        var postUrl = "blog.html"; // default fallback
        if (item.title.includes("Code4Kids")) {
          postUrl = "code4kids-blog.html";
        } else if (item.title.includes("AI Awareness")) {
          postUrl = "ai-training-blog.html";
        }

        readMoreBtn.href = postUrl;
        readMoreBtn.className = "btn btn-primary read-more-btn";
        readMoreBtn.textContent = "Read More";
        readMoreBtn.setAttribute(
          "aria-label",
          "Read full article: " + item.title
        );

        content.appendChild(title);
        content.appendChild(excerpt);
        content.appendChild(readMoreBtn);
        meta.appendChild(date);
        meta.appendChild(category);
        card.appendChild(img);
        card.appendChild(content);
        card.appendChild(meta);
        grid.appendChild(card);
      });
    }

    // Set up filter click handlers
    filters.forEach(function (filter) {
      filter.addEventListener("click", function () {
        var filterValue = this.getAttribute("data-filter");
        if (filterValue === currentFilter) return;

        // Update active state
        filters.forEach(function (f) {
          f.classList.remove("active");
          f.setAttribute("aria-selected", "false");
        });
        this.classList.add("active");
        this.setAttribute("aria-selected", "true");

        currentFilter = filterValue;
        renderItems(filterValue);
      });
    });

    // Initial render
    renderItems("all");
  }

  document.addEventListener("DOMContentLoaded", async function () {
    setYear();
    initNav();
    initDarkMode();
    var data = await loadSiteData();
    hydrateHomeFromFocus(data);
    renderFocusAreas(data);
    renderMission(data);
    renderVision(data);
    renderValues(data);
    renderHistory(data);
    renderTeam(data);
    renderInvolved(data);
    renderDonateMethods(data);
    renderBlogGrid(data);
    setupScrollToTop();
  });

  // Dark Mode functionality
  function initDarkMode() {
    const darkModeToggle = document.getElementById("dark-mode-toggle");

    if (!darkModeToggle) return;

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
    updateDarkModeIcon(currentTheme);

    // Toggle theme when button is clicked
    darkModeToggle.addEventListener("click", function () {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      updateDarkModeIcon(newTheme);

      // Announce theme change for screen readers
      announceThemeChange(newTheme);
    });

    // Keyboard support
    darkModeToggle.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  }

  function updateDarkModeIcon(theme) {
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    if (!darkModeToggle) return;

    const icon = darkModeToggle.querySelector("i");
    if (theme === "dark") {
      icon.className = "fa-solid fa-sun";
      darkModeToggle.setAttribute("aria-label", "Switch to light mode");
    } else {
      icon.className = "fa-solid fa-moon";
      darkModeToggle.setAttribute("aria-label", "Switch to dark mode");
    }
  }

  function announceThemeChange(theme) {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = `Switched to ${theme} mode`;

    document.body.appendChild(announcement);

    // Remove announcement after it's been read
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Scroll to Top functionality
  function setupScrollToTop() {
    const scrollBtn = document.getElementById("scroll-to-top");

    if (!scrollBtn) return;

    // Show button when user scrolls down
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 300) {
        scrollBtn.classList.add("show");
      } else {
        scrollBtn.classList.remove("show");
      }
    });

    // Scroll to top when button is clicked
    scrollBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      // Focus management for accessibility
      document.getElementById("main").focus();
    });

    // Keyboard support
    scrollBtn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  }
})();
