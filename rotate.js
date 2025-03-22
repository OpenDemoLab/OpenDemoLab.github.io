document.addEventListener("DOMContentLoaded", function() {
    // Array van woorden die we willen laten rouleren
    const terms = ["organisatie", "bestuur", "MT", "stakeholders", "medewerkers", "procesverantwoordelijken"];
    let currentIndex = 0;
    const rotatingElement = document.getElementById("rotating-term");
    
    // Functie om het woord te veranderen met een fade-effect
    function changeTerm() {
        rotatingElement.style.opacity = 0;
        
        setTimeout(function() {
            currentIndex = (currentIndex + 1) % terms.length;
            rotatingElement.textContent = terms[currentIndex];
            rotatingElement.style.opacity = 1;
        }, 500); // Wacht 500ms voor de fade-out voordat we de tekst veranderen
    }
    
    // Start de roulatie, verander elke 3 seconden
    setInterval(changeTerm, 3000);
    
    // Zorg ervoor dat de CSS voor de fade-transitie aanwezig is
    rotatingElement.style.transition = "opacity 0.5s ease";
});