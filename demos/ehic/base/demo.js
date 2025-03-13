const demoConfig = {
    totalSteps: 6 // Aangepast naar 6 stappen voor de EHIC demo
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

    // Iconen worden nu in HTML gedefinieerd
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

    // Verberg