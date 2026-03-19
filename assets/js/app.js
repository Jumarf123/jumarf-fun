(function (global) {
  const LOCALES = {
    en: {
      metaTitle: "Jumarf",
      metaDescription: "software projects by jumarf",
      metaImageAlt: "Dark portfolio preview for Jumarf.",
      skipLink: "Skip to content",
      navAriaLabel: "Primary navigation",
      navAbout: "About",
      navProjects: "Projects",
      navContacts: "Contacts",
      heroSubtitle: "- Deity, hero, zovCoder",
      heroProjects: "Projects",
      heroGitHubAriaLabel: "Jumarf on GitHub",
      aboutTitle: "About",
      aboutText: "I build software and tools for checking.",
      projectsTitle: "My Projects",
      contactsTitle: "Contacts",
      projectAction: "Open on GitHub",
      projectAriaPrefix: "Open",
      projectLinkSuffix: "on GitHub"
    },
    ru: {
      metaTitle: "Jumarf",
      metaDescription: "программные проекты от jumarf",
      metaImageAlt: "Тёмный превью-слайд портфолио Jumarf.",
      skipLink: "Перейти к содержимому",
      navAriaLabel: "Основная навигация",
      navAbout: "Обо мне",
      navProjects: "Проекты",
      navContacts: "Контакты",
      heroSubtitle: "- Божество, герой, zovCoder",
      heroProjects: "Проекты",
      heroGitHubAriaLabel: "Jumarf на GitHub",
      aboutTitle: "Обо мне",
      aboutText: "Делаю программы и инструменты для проверки.",
      projectsTitle: "Проекты.",
      contactsTitle: "Контакты",
      projectAction: "Открыть GitHub",
      projectAriaPrefix: "Открыть",
      projectLinkSuffix: "на GitHub"
    }
  };

  const PROJECTS = [
    {
      name: "RSS-Files",
      href: "https://github.com/Jumarf123/RSS-Files",
      summary: {
        en: "Searches for deleted files.",
        ru: "Поиск удалённых файлов."
      }
    },
    {
      name: "JliveF",
      href: "https://github.com/Jumarf123/JliveF",
      summary: {
        en: "A Windows multi-tool toolkit.",
        ru: "Windows multi-tool toolkit."
      }
    },
    {
      name: "RSS-AltsChecker",
      href: "https://github.com/Jumarf123/RSS-AltsChecker",
      summary: {
        en: "Detects and checks alt accounts.",
        ru: "Поиск и детект alt-аккаунтов."
      }
    },
    {
      name: "RSS-Analys",
      href: "https://github.com/Jumarf123/RSS-Analys",
      summary: {
        en: "Analyzes and scans TXT and DMP files.",
        ru: "Анализ и сканирование TXT и DMP файлов."
      }
    },
    {
      name: "RSS-Journal",
      href: "https://github.com/Jumarf123/RSS-Journal",
      summary: {
        en: "Views and analyzes the USN Journal.",
        ru: "Просмотр и анализ USN Journal."
      }
    },
    {
      name: "RSS-AmCache",
      href: "https://github.com/Jumarf123/RSS-AmCache",
      summary: {
        en: "Analyzes AmCache data.",
        ru: "Анализ данных AmCache."
      }
    },
    {
      name: "RSS-Registry",
      href: "https://github.com/Jumarf123/RSS-Registry",
      summary: {
        en: "Analyzes Windows registry data.",
        ru: "Анализ данных реестра Windows."
      }
    },
    {
      name: "RSS-Strings",
      href: "https://github.com/Jumarf123/RSS-Strings",
      summary: {
        en: "Searches and extracts strings.",
        ru: "Поиск и извлечение строк."
      }
    }
  ];

  function detectLocale(language) {
    return typeof language === "string" && language.toLowerCase().startsWith("ru") ? "ru" : "en";
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function setMeta(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.setAttribute("content", value);
    }
  }

  function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  }

  function renderProjects(locale) {
    const grid = document.getElementById("projects-grid");

    if (!grid) {
      return;
    }

    const { projectAction, projectAriaPrefix, projectLinkSuffix } = LOCALES[locale];

    grid.innerHTML = PROJECTS.map((project) => {
      const name = escapeHtml(project.name);
      const summary = escapeHtml(project.summary[locale]);
      const ariaLabel = escapeHtml(projectAriaPrefix + " " + project.name + " " + projectLinkSuffix);

      return [
        '<a class="project-card" href="' + project.href + '" rel="noreferrer" aria-label="' + ariaLabel + '">',
        '<h3 class="project-name">' + name + "</h3>",
        '<p class="project-summary">' + summary + "</p>",
        '<span class="project-action">' + projectAction + "</span>",
        "</a>"
      ].join("");
    }).join("");
  }

  function applyLocale(locale) {
    const copy = LOCALES[locale] || LOCALES.en;
    const nav = document.querySelector(".site-nav");
    const heroGitHub = document.getElementById("hero-github");

    document.documentElement.lang = locale;
    document.title = copy.metaTitle;

    setMeta("meta-description", copy.metaDescription);
    setMeta("meta-og-title", copy.metaTitle);
    setMeta("meta-og-description", copy.metaDescription);
    setMeta("meta-og-image-alt", copy.metaImageAlt);
    setMeta("meta-twitter-title", copy.metaTitle);
    setMeta("meta-twitter-description", copy.metaDescription);
    setMeta("meta-twitter-image-alt", copy.metaImageAlt);

    setText("skip-link", copy.skipLink);
    setText("hero-title", "Jumarf");
    setText("nav-about", copy.navAbout);
    setText("nav-projects", copy.navProjects);
    setText("nav-contacts", copy.navContacts);
    setText("hero-subtitle", copy.heroSubtitle);
    setText("hero-projects", copy.heroProjects);
    setText("about-title", copy.aboutTitle);
    setText("about-text", copy.aboutText);
    setText("projects-title", copy.projectsTitle);
    setText("contacts-title", copy.contactsTitle);

    if (nav) {
      nav.setAttribute("aria-label", copy.navAriaLabel);
    }

    if (heroGitHub) {
      heroGitHub.setAttribute("aria-label", copy.heroGitHubAriaLabel);
    }

    renderProjects(locale);
  }

  function init() {
    const locale = detectLocale(global.navigator ? global.navigator.language : "");

    applyLocale(locale);
  }

  global.sitePortfolio = {
    LOCALES,
    PROJECTS,
    detectLocale
  };

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
      init();
    }
  }
})(typeof window !== "undefined" ? window : globalThis);
