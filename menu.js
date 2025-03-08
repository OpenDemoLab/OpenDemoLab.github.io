// JavaScript voor het hamburger menu
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const fullscreenMenu = document.querySelector('.fullscreen-menu');
    const nav = document.querySelector('nav');
    
    hamburger.addEventListener('click', function() {
        // Toggle hamburger active class
        this.classList.toggle('active');
        
        // Toggle menu visibility
        fullscreenMenu.classList.toggle('active');
        
        // Toggle nav achtergrond
        nav.classList.toggle('menu-open');
        
        // Voorkom scrollen van de achtergrond wanneer menu open is
        document.body.style.overflow = this.classList.contains('active') ? 'hidden' : '';
    });
    
    // Sluit menu wanneer op een link wordt geklikt
    const menuLinks = document.querySelectorAll('.menu-links a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            fullscreenMenu.classList.remove('active');
            nav.classList.remove('menu-open');
            document.body.style.overflow = '';
        });
    });
});
