const demoConfig = {
    totalSteps: 5 // We now have 5 steps for this demo
};

let currentStep = 1; // Keep track of current step

// Make sure the right sections are shown when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const totalSteps = demoConfig.totalSteps;

    // Hide all steps above the total number
    for (let i = totalSteps + 1; i <= 8; i++) {
        const stepElement = document.getElementById(`step-${i}`);
        if (stepElement) {  
            stepElement.style.display = 'none';
        }
    }

    // Show the first step
    showStep(currentStep);

    // Add event listeners for 'Next' and 'Back' buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('next') || e.target.parentElement.classList.contains('next')) {
            goToStep(currentStep + 1);
        } else if (e.target.classList.contains('prev') || e.target.parentElement.classList.contains('prev')) {
            goToStep(currentStep - 1);
        }
    });

    // Add icons to buttons (already added in HTML but keep this for compatibility)
    document.querySelectorAll('.next').forEach(button => {
        if (!button.innerHTML.includes('fa-arrow-right')) {
            button.innerHTML = 'Volgende stap <i class="fas fa-arrow-right"></i>';
        }
    });
    document.querySelectorAll('.prev').forEach(button => {
        if (!button.innerHTML.includes('fa-arrow-left')) {
            button.innerHTML = '<i class="fas fa-arrow-left"></i> Vorige stap';
        }
    });
});

function goToStep(step) {
    if (step > 0 && step <= demoConfig.totalSteps) {
        currentStep = step;
        showStep(currentStep);
    }
}

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.step').forEach((section) => {
        section.classList.remove('active');
        section.style.display = 'none';
    });

    // Show the correct step
    const stepToShow = document.getElementById(`step-${step}`);
    if (stepToShow) {
        stepToShow.classList.add('active');
        stepToShow.style.display = 'block';
    }

    // Adjust button logic
    toggleButtons();
}

function toggleButtons() {
    // Hide the 'Back' button on the first step
    const prevButton = document.querySelector(`#step-${currentStep} .prev`);
    if (currentStep === 1 && prevButton) {
        prevButton.style.display = 'none';
    } else if (prevButton) {
        prevButton.style.display = 'inline-flex';
    }

    // Hide the 'Next' button on the last step and add extra buttons
    const nextButton = document.querySelector(`#step-${currentStep} .next`);
    const buttonContainer = document.querySelector(`#step-${currentStep} .button-container`);

    if (currentStep === demoConfig.totalSteps) {
        if (nextButton) {
            nextButton.style.display = 'none';
        }

        // Check if buttons already exist before adding them
        if (!document.querySelector('.go-example') && !document.querySelector('.go-home')) {
            // Add the 'Go to examples' button with Font Awesome icon
            const exampleButton = document.createElement('button');
            exampleButton.innerHTML = '<i class="fas fa-lightbulb"></i> Naar voorbeelden';
            exampleButton.className = 'go-example';
            exampleButton.onclick = () => {
                // Use window.top to go to the highest level (outside the iframe)
                window.top.location.href = 'https://www.opendemolab.eu/demos';
            };

            // Add the 'Back to main website' button with Font Awesome icon
            const homeButton = document.createElement('button');
            homeButton.innerHTML = '<i class="fas fa-home"></i> Terug naar hoofdwebsite';
            homeButton.className = 'go-home';
            homeButton.onclick = () => {
                // Use window.top to go to the highest level (outside the iframe)
                window.top.location.href = 'https://www.opendemolab.eu';
            };

            // Add the buttons to the button container
            buttonContainer.appendChild(exampleButton);
            buttonContainer.appendChild(homeButton);
        }
    } else if (nextButton) {
        nextButton.style.display = 'inline-flex';
    }
}

// Check if the page has been visited using the browser's back button
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        // If the page was loaded from cache, force a reload
        window.location.reload();
    }
});