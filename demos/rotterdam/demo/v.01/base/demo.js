const demoConfig = {
    totalSteps: 8 // Definieer hier het aantal stappen voor deze demo
};

let currentStep = 1; // Houd de huidige stap bij

// Zorg ervoor dat de juiste secties worden getoond wanneer de DOM geladen is
document.addEventListener('DOMContentLoaded', () => {
    const totalSteps = demoConfig.totalSteps;

    // Verberg alle stappen boven het totale aantal
    for (let i = totalSteps + 1; i <= 8; i++) {
        const stepElement = document.getElementById(`step-${i}`);
        if (stepElement) {  
            stepElement.style.display = 'none';
        }
    }

    // Toon de eerste stap
    showStep(currentStep);

    // Voeg eventlisteners toe aan de knoppen voor 'Volgende' en 'Terug'
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('next')) {
            goToStep(currentStep + 1);
        } else if (e.target.classList.contains('prev')) {
            goToStep(currentStep - 1);
        }
    });

    // Voeg iconen en tekst aan de knoppen
    document.querySelectorAll('.next').forEach(button => {
        button.innerHTML = 'Volgende stap <i class="fas fa-arrow-right"></i>';
    });
    document.querySelectorAll('.prev').forEach(button => {
        button.innerHTML = '<i class="fas fa-arrow-left"></i> Vorige stap';
    });
    
// Voeg event listener toe voor de wallet link
    const walletLink = document.querySelector('a[href="#wallet-login"]');
    if (walletLink) {
        walletLink.addEventListener('click', function(e) {
            e.preventDefault(); // Voorkom navigatie naar het anker
            goToStep(3); // Ga direct naar stap 3
        });
    }
    
// Event listener voor de Bijstandsuitkering link
const bijstandLinks = document.querySelectorAll('.burgerportaal-option-link');
bijstandLinks.forEach(link => {
    if (link.textContent.trim() === 'Bijstandsuitkering') {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Voorkom standaard navigatie
            goToStep(5); // Ga direct naar stap 5
        });
    }
});

    // NIEUWE CODE: Handle the custom navigation in the Einde Demo screen
    const eindeDemo = document.querySelector('.einde-demo-screen');
    
    if (eindeDemo) {
        // Previous button in Einde Demo screen
        const prevButton = eindeDemo.querySelector('.einde-demo-button.primary');
        if (prevButton) {
            prevButton.addEventListener('click', function(e) {
                e.preventDefault();
                goToStep(currentStep - 1);
            });
        }
        
        // Examples button
        const examplesButton = eindeDemo.querySelector('.einde-demo-button:nth-child(2)');
        if (examplesButton) {
            examplesButton.addEventListener('click', function(e) {
                e.preventDefault();
                // Use window.top to navigate to the highest level (outside iframe)
                window.top.location.href = 'https://www.opendemolab.eu/demos';
            });
        }
        
        // Home button
        const homeButton = eindeDemo.querySelector('.einde-demo-button:nth-child(3)');
        if (homeButton) {
            homeButton.addEventListener('click', function(e) {
                e.preventDefault();
                // Use window.top to navigate to the highest level (outside iframe)
                window.top.location.href = 'https://www.opendemolab.eu';
            });
        }
    }
});

function goToStep(step) {
    if (step > 0 && step <= demoConfig.totalSteps) {
        currentStep = step;
        showStep(currentStep);
    }
}

function showStep(step) {
    // Verberg alle stappen
    document.querySelectorAll('.step').forEach((section) => {
        section.classList.remove('active');
        section.style.display = 'none'; // Verberg alle secties
    });

    // Toon de juiste stap
    const stepToShow = document.getElementById(`step-${step}`);
    if (stepToShow) {
        stepToShow.classList.add('active');
        stepToShow.style.display = 'block'; // Toon alleen de actieve sectie
    }

    // Pas de knoppenlogica aan
    toggleButtons();
}

function toggleButtons() {
    // Verberg de 'Terug'-knop bij de eerste stap
    const prevButton = document.querySelector(`#step-${currentStep} .prev`);
    if (currentStep === 1 && prevButton) {
        prevButton.style.display = 'none';
    } else if (prevButton) {
        prevButton.style.display = 'inline-block';
    }

    // Verberg de 'Volgende'-knop bij de laatste stap en voeg extra knoppen toe
    const nextButton = document.querySelector(`#step-${currentStep} .next`);
    const buttonContainer = document.querySelector(`#step-${currentStep} .button-container`);

    if (currentStep === demoConfig.totalSteps) {
        if (nextButton) {
            nextButton.style.display = 'none'; // Verberg de 'Volgende'-knop
        }

        if (!document.querySelector('.go-example') && !document.querySelector('.go-home') && buttonContainer) {
            // Voeg de 'Sluiten tabblad'-knop toe met Font Awesome icoon
            const exampleButton = document.createElement('button');
            exampleButton.innerHTML = '<i class="fas fa-lightbulb"></i> Naar voorbeelden';
            exampleButton.className = 'go-example';
            exampleButton.onclick = () => {
                // Gebruik window.top om naar het hoogste niveau te gaan (buiten de iframe)
                window.top.location.href = 'https://www.opendemolab.eu/demos';
            };
            
            // Voeg de 'Terug naar hoofdwebsite'-knop toe met Font Awesome icoon
            const homeButton = document.createElement('button');
            homeButton.innerHTML = '<i class="fas fa-home"></i> Terug naar hoofdwebsite';
            homeButton.className = 'go-home';
            homeButton.onclick = () => {
                // Gebruik window.top om naar het hoogste niveau te gaan (buiten de iframe)
                window.top.location.href = 'https://www.opendemolab.eu';
            };
            
            // Voeg de knoppen toe aan de button-container
            buttonContainer.appendChild(exampleButton);
            buttonContainer.appendChild(homeButton);
        }

    } else if (nextButton) {
        nextButton.style.display = 'inline-block'; // Toon de 'Volgende'-knop indien niet op de laatste stap
    }
}

// Controleer of de pagina via de terugknop van de browser is bezocht
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        // Als de pagina uit de cache is geladen, forceer dan een herlaad
        window.location.reload();
    }
});




// Houdt bij of de gegevens al zijn opgehaald
let dataAlreadyFetched = false;

// Event listener voor de "Haal gegevens op" knop
const ophaalButton = document.querySelector('.bijstandsaanvraag-btn-primary[style*="background-color: #006400"]');
if (ophaalButton) {
    ophaalButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Als de gegevens al zijn opgehaald, doe niets
        if (dataAlreadyFetched || this.classList.contains('disabled-button')) {
            return;
        }
        
        // Voeg het laad-icoon toe en schakel de knop uit
        this.classList.add('disabled-button');
        const loadingIcon = document.createElement('span');
        loadingIcon.className = 'loading-icon';
        this.appendChild(loadingIcon);
        
        // Zoek de container van de knop om een bericht toe te voegen
        const section = this.closest('.bijstandsaanvraag-section');
        
        // Maak het succes bericht element maar voeg het nog niet toe
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'De gegevens zijn opgehaald, u kunt door naar de volgende stap.';
        
        // Start de timer voor 3 seconden
        setTimeout(() => {
            // Voeg het succes bericht toe
            section.appendChild(successMessage);
            
            // Verwijder het laad-icoon
            loadingIcon.remove();
            
            // Verander de tekst van de knop
            this.textContent = "Gegevens opgehaald";
            
            // Maak het bericht zichtbaar (voor fade-in effect)
            setTimeout(() => {
                successMessage.classList.add('visible');
                
                // Markeer dat de gegevens zijn opgehaald
                dataAlreadyFetched = true;
            }, 50);
        }, 3000);
    });
}

// Zorg dat we de staat resetten als we tussen stappen navigeren
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('next') || e.target.classList.contains('prev')) {
        // Als we naar een andere stap gaan, controleer of we moeten onthouden dat de gegevens zijn opgehaald
        if (currentStep === 5 && e.target.classList.contains('next')) {
            // Als we vanuit stap 5 naar voren gaan, onthoud dat de gegevens zijn opgehaald
            dataAlreadyFetched = true;
        }
    }
});

// Voeg ook een functie toe om de staat te controleren bij het laden van stap 5
function checkDataFetchedState() {
    if (currentStep === 5 && dataAlreadyFetched) {
        // Als we terugkeren naar stap 5 en de gegevens zijn al opgehaald
        const ophaalButton = document.querySelector('.bijstandsaanvraag-btn-primary[style*="background-color: #006400"]');
        if (ophaalButton) {
            ophaalButton.classList.add('disabled-button');
            ophaalButton.textContent = "Gegevens opgehaald";
            
            // Toon het succes bericht opnieuw
            const section = ophaalButton.closest('.bijstandsaanvraag-section');
            if (section && !section.querySelector('.success-message')) {
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message visible';
                successMessage.textContent = 'De gegevens zijn opgehaald, u kunt door naar de volgende stap.';
                section.appendChild(successMessage);
            }
        }
    }
}

// Aanpassing van de bestaande showStep functie
const originalShowStep = showStep;
showStep = function(step) {
    originalShowStep(step);
    // Na het tonen van de stap, controleer de status
    checkDataFetchedState();
};