'use client'

import { useEffect } from 'react'

export default function InjectedContentBlocker() {
  useEffect(() => {
    // Function to hide unwanted injected content
    const hideInjectedContent = () => {
      // First, ensure all legitimate sign-in buttons are visible
      const legitimateSignInButtons = document.querySelectorAll('a[href*="/login"] button, button[data-signin="true"]')
      legitimateSignInButtons.forEach(button => {
        const htmlButton = button as HTMLElement
        htmlButton.style.display = 'inline-flex'
        htmlButton.style.visibility = 'visible'
        htmlButton.style.opacity = '1'
        htmlButton.style.pointerEvents = 'auto'
      })

      // Hide elements with specific class names
      const unwantedSelectors = [
        '[class*="careerflow"]',
        '[class*="Signintoviewdetails"]',
        '[class*="youAreOneStepAwayFrom"]',
        '[class*="floating"]',
        '[class*="overlay"]',
        '[class*="popup"]',
        '[class*="modal"]',
        'div[style*="position: fixed"][style*="bottom"]'
      ]

      unwantedSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        elements.forEach(element => {
          const htmlElement = element as HTMLElement
          htmlElement.style.display = 'none'
          htmlElement.style.visibility = 'hidden'
          htmlElement.style.opacity = '0'
          htmlElement.style.pointerEvents = 'none'
          htmlElement.classList.add('hide-injected-elements')
        })
      })

      // Only hide buttons that are clearly from unwanted sources
      const unwantedButtons = document.querySelectorAll('button[class*="careerflow"], button[class*="Signintoviewdetails"], button[class*="youAreOneStepAwayFrom"]')
      unwantedButtons.forEach(button => {
        const htmlButton = button as HTMLElement
        htmlButton.style.display = 'none'
        htmlButton.style.visibility = 'hidden'
        htmlButton.style.opacity = '0'
        htmlButton.style.pointerEvents = 'none'
        htmlButton.classList.add('hide-injected-elements')
      })
    }

    // Run immediately
    hideInjectedContent()

    // Set up a MutationObserver to watch for dynamically added content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element
              
              // Check if the added element matches our unwanted selectors
              const unwantedSelectors = [
                '[class*="careerflow"]',
                '[class*="Signintoviewdetails"]',
                '[class*="youAreOneStepAwayFrom"]',
                '[class*="floating"]',
                '[class*="overlay"]',
                '[class*="popup"]',
                '[class*="modal"]'
              ]

              unwantedSelectors.forEach(selector => {
                if (element.matches(selector)) {
                  const htmlElement = element as HTMLElement
                  htmlElement.style.display = 'none'
                  htmlElement.style.visibility = 'hidden'
                  htmlElement.style.opacity = '0'
                  htmlElement.style.pointerEvents = 'none'
                  htmlElement.classList.add('hide-injected-elements')
                }
              })

              // Check for buttons from unwanted sources
              const unwantedButtons = element.querySelectorAll('button[class*="careerflow"], button[class*="Signintoviewdetails"], button[class*="youAreOneStepAwayFrom"]')
              unwantedButtons.forEach(button => {
                const htmlButton = button as HTMLElement
                htmlButton.style.display = 'none'
                htmlButton.style.visibility = 'hidden'
                htmlButton.style.opacity = '0'
                htmlButton.style.pointerEvents = 'none'
                htmlButton.classList.add('hide-injected-elements')
              })
            }
          })
        }
      })
    })

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // Run periodically to catch any missed elements
    const interval = setInterval(hideInjectedContent, 1000)

    // Cleanup
    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])

  return null // This component doesn't render anything
}
