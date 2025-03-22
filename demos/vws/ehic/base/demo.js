const demoConfig = {
    totalSteps: 6 // Aangepast naar 6 stappen voor de EHIC demo met login pagina
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
        if (e.target.classList.contains('next') || e.target.parentElement.classList.contains('next')) {
            goToStep(currentStep + 1);
        } else if (e.target.classList.contains('prev') || e.target.parentElement.classList.contains('prev')) {
            goToStep(currentStep - 1);
        }
    });

      // Voeg eventlistener toe voor het flippen van de EHIC kaart
      const ehicCardFlipper = document.getElementById('ehic-card-flipper');
      if (ehicCardFlipper) {
          ehicCardFlipper.addEventListener('click', () => {
              ehicCardFlipper.classList.toggle('flipped');
          });
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

    // Verberg de 'Volgende'-knop bij de laatste stap
    const nextButton = document.querySelector(`#step-${currentStep} .next`);
    
    if (currentStep === demoConfig.totalSteps) {
        if (nextButton) {
            nextButton.style.display = 'none'; // Verberg de 'Volgende'-knop
        }
        
        // Controleer of de 'Naar voorbeelden'-knop al bestaat voordat je hem toevoegt
        const buttonContainer = document.querySelector(`#step-${currentStep} .button-container`);
        if (!document.querySelector('.go-example')) {
            // Voeg de 'Naar voorbeelden'-knop toe met Font Awesome icoon
            const exampleButton = document.createElement('button');
            exampleButton.innerHTML = '<i class="fas fa-lightbulb"></i> Naar voorbeelden';
            exampleButton.className = 'go-example standard-button';
            exampleButton.onclick = () => {
                // Gebruik window.top om naar het hoogste niveau te gaan (buiten de iframe)
                window.top.location.href = 'https://www.opendemolab.eu';
            };
            
            // Voeg de knop toe aan de button-container
            buttonContainer.appendChild(exampleButton);
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