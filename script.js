// Lista de tus fotos según tu carpeta img
const images = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.png", "6.png", "7.png"];
let currentImgIndex = 0;

// Función para cambiar las fotos automáticamente
function nextPhoto() {
    const imgElement = document.getElementById("main-photo");
    if (!imgElement) return;

    currentImgIndex = (currentImgIndex + 1) % images.length;
    
    // Efecto de desvanecimiento
    imgElement.style.opacity = "0";
    
    setTimeout(() => {
        imgElement.src = `img/${images[currentImgIndex]}`;
        imgElement.style.opacity = "1";
    }, 600); 
}

// Función para crear la lluvia de corazones
function createHeart() {
    const container = document.querySelector(".hearts-container");
    if (!container) return;

    const heart = document.createElement("span");
    heart.classList.add("heart");
    heart.textContent = ["❤️", "💖", "💗", "🌸"][Math.floor(Math.random() * 4)];
    
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = Math.random() * 10 + 15 + "px";
    heart.style.animationDuration = Math.random() * 3 + 3 + "s";

    container.appendChild(heart);
    
    setTimeout(() => heart.remove(), 6000);
}

// Ejecutar funciones
setInterval(nextPhoto, 4000); // Cambia foto cada 4 segundos
setInterval(createHeart, 500); // Crea un corazón cada medio segundo