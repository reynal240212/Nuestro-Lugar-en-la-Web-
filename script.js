document.addEventListener('DOMContentLoaded', () => {
    const heartsContainer = document.querySelector('.hearts-container');

    // Función para crear corazones
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        
        // Configuración aleatoria
        const size = Math.random() * 15 + 10 + 'px';
        const left = Math.random() * 100 + 'vw';
        const duration = Math.random() * 3 + 2 + 's';
        const opacity = Math.random() * 0.5 + 0.5;

        // Estilo del corazón
        heart.innerText = '❤️';
        heart.style.left = left;
        heart.style.fontSize = size;
        heart.style.animationDuration = duration;
        heart.style.opacity = opacity;
        heart.style.position = 'absolute';
        heart.style.top = '-50px';

        heartsContainer.appendChild(heart);

        // Limpiar el DOM eliminando el corazón después de que caiga
        setTimeout(() => {
            heart.remove();
        }, 5000);
    }

    // Generar corazones cada 300ms
    setInterval(createHeart, 300);

    // Efecto de Navbar activo al scrollear
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.color = link.getAttribute('href').includes(current) 
                ? '#ff4b7d' 
                : '#333';
        });
    });
});