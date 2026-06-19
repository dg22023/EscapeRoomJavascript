/**
 * Lógica principal del Escape Room
 */

const gameState = {
    currentLevel: 0,
    levelsCompleted: {
        0: true, // Inicio siempre disponible
        1: false,
        2: false,
        3: false,
        4: false,
        5: false
    },
    userData: {
        location: null
    }
};

/**
 * Cambia la visibilidad de los contenedores de nivel
 * @param {number} levelId - ID del nivel al que se desea navegar
 */
function navigateToLevel(levelId) {
    // Validar si el nivel anterior fue superado
    if (levelId > 0 && !gameState.levelsCompleted[levelId - 1]) {
        console.warn(`Nivel ${levelId} bloqueado. Debes completar el nivel ${levelId - 1} primero.`);
        return;
    }

    // Ocultar todos los niveles
    document.querySelectorAll('.level-container').forEach(container => {
        container.classList.add('d-none');
    });

    // Mostrar el nivel seleccionado
    const targetLevel = document.getElementById(`level-${levelId}`);
    if (targetLevel) {
        targetLevel.classList.remove('d-none');
        gameState.currentLevel = levelId;
        
        // Inicializar lógica específica del nivel si existe
        if (levelId === 1) initLevel1();
        if (levelId === 2) initLevel2();
        if (levelId === 4) initLevel4();
    }
}

/**
 * Marca un nivel como completado y permite avanzar
 * @param {number} levelId 
 */
function completeLevel(levelId) {
    gameState.levelsCompleted[levelId] = true;
    console.log(`Nivel ${levelId} completado.`);
    
    // Auto-navegar al siguiente nivel
    navigateToLevel(levelId + 1);
}

// Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => navigateToLevel(1));
    }
});

