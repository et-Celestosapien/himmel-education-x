// Shared Theme Management for Himmel Education Platform

class ThemeManager {
  constructor() {
    this.themeKey = "himmel-education-theme"
    this.init()
  }

  init() {
    // Load saved theme or default to dark
    const savedTheme = this.getSavedTheme()
    this.setTheme(savedTheme)
    this.setupThemeToggleListeners()

    // Handle dynamic content
    this.updateBackgroundForDynamicContent()

    // Listen for content changes
    const observer = new MutationObserver(() => {
      this.handleContentChange()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
    })
  }

  getSavedTheme() {
    const saved = localStorage.getItem(this.themeKey)
    if (saved) {
      return saved
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light"
    }

    return "dark"
  }

  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem(this.themeKey, theme)
    this.updateThemeToggleIcons()

    // Dispatch custom event for other components that might need to react
    window.dispatchEvent(new CustomEvent("themeChanged", { detail: { theme } }))
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme")
    const newTheme = currentTheme === "dark" ? "light" : "dark"
    this.setTheme(newTheme)
  }

  getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark"
  }

  updateThemeToggleIcons() {
    const currentTheme = this.getCurrentTheme()
    const themeToggleButtons = document.querySelectorAll(
      ".theme-toggle, .theme-toggle-btn, #themeToggle, #themeToggleBtn, .icon-header-button[id*='themeToggle'], #toggleThemeBtn",
    )

    themeToggleButtons.forEach((button) => {
      const icon = button.querySelector("i")
      if (icon) {
        if (currentTheme === "dark") {
          icon.className = "fas fa-sun"
        } else {
          icon.className = "fas fa-moon"
        }
      }
    })
  }

  setupThemeToggleListeners() {
    // Find all theme toggle buttons and add event listeners
    const themeToggleButtons = document.querySelectorAll(
      ".theme-toggle, .theme-toggle-btn, #themeToggle, #themeToggleBtn, .icon-header-button[id*='themeToggle'], #toggleThemeBtn",
    )

    themeToggleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.toggleTheme()
      })
    })
  }

  // Method to add gradient text class to elements
  applyGradientText(selector) {
    const elements = document.querySelectorAll(selector)
    elements.forEach((element) => {
      element.classList.add("gradient-text")
    })
  }

  // Method to ensure all headings have gradient text
  applyGradientToHeadings() {
    this.applyGradientText("h1, h2.gradient-text, .question-title")
  }

  // Add this method to the ThemeManager class, after the applyGradientToHeadings method
  updateBackgroundForDynamicContent() {
    // Force background recalculation for dynamic content
    const body = document.body
    const html = document.documentElement

    // Calculate total content height
    const contentHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight,
    )

    // Update CSS custom property for dynamic height
    html.style.setProperty("--dynamic-height", `${contentHeight}px`)

    // Add class for dynamic content handling
    if (contentHeight > window.innerHeight * 1.5) {
      body.classList.add("dynamic-content-page")
    }
  }

  // Add this method to be called when content changes
  handleContentChange() {
    // Debounce the background update
    clearTimeout(this.backgroundUpdateTimeout)
    this.backgroundUpdateTimeout = setTimeout(() => {
      this.updateBackgroundForDynamicContent()
    }, 100)
  }
}

// Initialize theme manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.themeManager = new ThemeManager()

  // Apply gradient text to common elements
  setTimeout(() => {
    window.themeManager.applyGradientToHeadings()
  }, 100)
})

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = ThemeManager
}
