// Geavanceerde JavaScript voor smooth scrolling met snelheidscontrole
document.addEventListener('DOMContentLoaded', function() {
    // Selecteer alle links met hashes (anchor links)
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    // Voeg event listeners toe aan elk van deze links
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault(); // Voorkom standaard gedrag
            
            // Krijg het doel-element door de hash uit de href te extraheren
            const targetId = this.getAttribute('href');
            
            // Controleer of het doel-element bestaat
            if (targetId === '#') return; // Skip als het gewoon een # is
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Bereken de afstand tot het doelelement
                const startPosition = window.pageYOffset;
                const targetPosition = targetElement.getBoundingClientRect().top + startPosition;
                
                // Definieer scroll parameters
                const duration = 800; // ms, pas dit aan om de scroll snelheid te wijzigen
                let startTime = null;
                
                // Easing functie - maakt de scroll soepeler
                function easeInOutQuad(t, b, c, d) {
                    t /= d/2;
                    if (t < 1) return c/2*t*t + b;
                    t--;
                    return -c/2 * (t*(t-2) - 1) + b;
                }
                
                // Animatiefunctie
                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const scrollY = easeInOutQuad(
                        Math.min(timeElapsed, duration),
                        startPosition,
                        targetPosition - startPosition,
                        duration
                    );
                    
                    window.scrollTo(0, scrollY);
                    
                    if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                    }
                }
                
                // Start de animatie
                requestAnimationFrame(animation);
            }
        });
    });
});