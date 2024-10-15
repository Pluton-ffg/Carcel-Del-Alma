document.addEventListener('DOMContentLoaded', function() {
    // Datos de mangas, series y películas
    const mangas = Array.from({ length: 42 }, (_, i) => ({
        titulo: `Volumen ${i + 1}`,
        imagen: `Mangas/Portadas-Mangas/Volumen-${i + 1}.jpg`,
        link: `Mangas/Red-Volumenes/ver-volumen.html?volumen=${i + 1}`
    }));

    const series = [
        "El Espadachín Negro", "La Banda del Halcón", "Primer Golpe", "Mano de Dios", 
        "Un Hombre Soñado Para Ser un Dios", "Zodd el Inmortal", "El Ejército del Conde Julius", 
        "Conquista del Castillo", "El Hombre que Dirige el Espada", "Noble Caballero", 
        "La Batalla de Doldrey", "La Frontera del Agua", "El Eco del Lamento", "Luz", 
        "Horrores", "Las Revelaciones del Amanecer", "Condenación", "¡Súper Fuerte!", 
        "La Noche de las Mil Estrellas", "La Noche del Festín de Mil Muertes", "Suceso Extraño", 
        "Dudas del Fin", "La Noche de la Eclosión", "El Eclipse", "Al Final del Deseo"
    ].map((titulo, i) => ({
        titulo: titulo,
        imagen: `Series/Portadas-1997/${titulo}.jpg`
    }));

    const peliculas = [
        { titulo: "La Edad de Oro I", imagen: "Peliculas/Portadas-Peliculas/Pelicula-1.jpg" },
        { titulo: "La Edad de Oro II", imagen: "Peliculas/Portadas-Peliculas/Pelicula-2.jpg" },
        { titulo: "La Edad de Oro III", imagen: "Peliculas/Portadas-Peliculas/Pelicula-3.jpg" }
    ];

    // Función para renderizar portadas
    function renderizarPortadas(contenedor, datos, esMangas = false) {
        datos.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('caja-portada');
            div.innerHTML = `
                ${esMangas ? `<a href="${item.link}">` : ''}
                    <img src="${item.imagen}" alt="${item.titulo}">
                    <div class="nombre-volumen">${item.titulo}</div>
                ${esMangas ? '</a>' : ''}
            `;
            contenedor.appendChild(div);
        });
    }

    // Renderizar portadas
    renderizarPortadas(document.getElementById('lista-mangas'), mangas, true);
    renderizarPortadas(document.getElementById('lista-series'), series);
    renderizarPortadas(document.getElementById('lista-peliculas'), peliculas);

    // Función para manejar el desplazamiento
    function manejarDesplazamiento(contenedor) {
        let isDragging = false;
        let startX;
        let scrollLeft;
        let startTime;
        let clickThreshold = 200; // milisegundos

        contenedor.addEventListener('mousedown', (e) => {
            startTime = new Date().getTime();
            isDragging = true;
            contenedor.style.cursor = 'grabbing';
            startX = e.pageX - contenedor.offsetLeft;
            scrollLeft = contenedor.scrollLeft;
        });

        contenedor.addEventListener('mouseleave', () => {
            isDragging = false;
            contenedor.style.cursor = 'grab';
        });

        contenedor.addEventListener('mouseup', (e) => {
            let endTime = new Date().getTime();
            let timeDiff = endTime - startTime;
            
            if (timeDiff < clickThreshold) {
                // Es un clic, no un arrastre
                let target = e.target.closest('a');
                if (target) {
                    window.location.href = target.href;
                }
            }
            
            isDragging = false;
            contenedor.style.cursor = 'grab';
        });

        contenedor.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - contenedor.offsetLeft;
            const walk = (x - startX) * 2;
            contenedor.scrollLeft = scrollLeft - walk;
        });

        // Desplazamiento con MAYÚS + rueda del ratón
        contenedor.addEventListener('wheel', (e) => {
            if (e.shiftKey) {
                e.preventDefault();
                contenedor.scrollLeft += e.deltaY;
            }
        });

        // Botones de navegación
        const prevButton = contenedor.parentElement.querySelector('.nav-button.prev');
        const nextButton = contenedor.parentElement.querySelector('.nav-button.next');

        prevButton.addEventListener('click', () => {
            deslizarSuavemente(contenedor, -300);
        });

        nextButton.addEventListener('click', () => {
            deslizarSuavemente(contenedor, 300);
        });
    }

    // Función para deslizamiento suave
    function deslizarSuavemente(elemento, distancia) {
        const inicio = elemento.scrollLeft;
        const cambio = distancia;
        const duracion = 300; // milisegundos
        let tiempoInicio = null;

        function animacion(tiempoActual) {
            if (tiempoInicio === null) tiempoInicio = tiempoActual;
            const tiempoTranscurrido = tiempoActual - tiempoInicio;
            const progreso = Math.min(tiempoTranscurrido / duracion, 1);
            
            elemento.scrollLeft = inicio + cambio * easeInOutCubic(progreso);

            if (progreso < 1) {
                requestAnimationFrame(animacion);
            }
        }

        requestAnimationFrame(animacion);
    }

    //este coso hace que la animacion sea mas suave
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    //esto hace que el deslizamiento ande para todas las secciones
    manejarDesplazamiento(document.querySelector('.portadas-manga'));
    manejarDesplazamiento(document.querySelector('.portadas-series'));
    manejarDesplazamiento(document.querySelector('.portadas-peliculas'));
});
