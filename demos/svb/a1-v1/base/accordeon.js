// Accordeon functionaliteit voor accordeon headers
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', function () {
    // Toggle 'aria-expanded' en 'aria-hidden'
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !expanded);

    const content = document.getElementById(this.getAttribute('aria-controls'));
    if (content) {
      content.classList.toggle('expanded');
      content.setAttribute('aria-hidden', expanded ? 'true' : 'false');
    }

    // Toggle rotatie van chevron-icoon
    const chevronIcon = this.querySelector('i');
    if (chevronIcon) {
      chevronIcon.classList.toggle('rotate');
    }
  });

  // Toetsenbordtoegankelijkheid: gebruik Enter of Spatie om de accordeon te openen/sluiten
  header.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.click();
    }
  });
});
