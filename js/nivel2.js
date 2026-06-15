/**
 * Lógica del Nivel 2: API Canvas
 */

function initLevel2() {
    const canvas = document.getElementById('radar-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // 1. Dibujar fondo (Rectángulo)
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);

    // 2. Dibujar rejilla/radar (Círculos y líneas)
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 1;

    // Círculos concéntricos
    for (let r = 50; r <= 150; r += 50) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Líneas cruzadas
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // 3. Marcar ubicación si está disponible
    const location = gameState.userData.location;
    if (location) {
        // Simular una posición basada en los decimales de las coordenadas
        // para que se vea movimiento o posición "única"
        const offsetX = (location.lon % 1) * 100;
        const offsetY = (location.lat % 1) * 100;
        
        const markX = centerX + (offsetX - 50);
        const markY = centerY - (offsetY - 50);

        // Dibujar marca (Punto brillante)
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(markX, markY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Efecto de pulso
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(markX, markY, 15, 0, Math.PI * 2);
        ctx.stroke();

        // Mostrar botón de continuar
        const nextBtn = document.getElementById('complete-level-2');
        if (nextBtn) {
            nextBtn.classList.remove('d-none');
            nextBtn.addEventListener('click', () => {
                completeLevel(2);
            });
        }
    } else {
        // Caso de prueba o si se accede directamente
        ctx.fillStyle = '#white';
        ctx.font = '16px Arial';
        ctx.fillText('Esperando coordenadas...', centerX - 80, centerY);
    }
}
