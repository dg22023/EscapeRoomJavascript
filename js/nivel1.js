/**
 * Lógica del Nivel 1: Geolocalización
 */

function initLevel1() {
    const getLocationBtn = document.getElementById('get-location-btn');
    const resultDiv = document.getElementById('location-result');

    if (!getLocationBtn) return;

    getLocationBtn.addEventListener('click', () => {
        resultDiv.innerHTML = '<div class="spinner-border text-light" role="status"><span class="visually-hidden">Cargando...</span></div>';
        
        if (!navigator.geolocation) {
            showError("Tu navegador no soporta geolocalización.");
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                // Guardar en el estado global
                gameState.userData.location = { lat, lon };
                
                resultDiv.innerHTML = `
                    <div class="alert alert-success">
                        <strong>¡Ubicación detectada!</strong><br>
                        Latitud: ${lat.toFixed(6)}<br>
                        Longitud: ${lon.toFixed(6)}
                    </div>
                    <button id="next-level-1" class="btn btn-primary">Continuar al Nivel 2</button>
                `;

                document.getElementById('next-level-1').addEventListener('click', () => {
                    completeLevel(1);
                });
            },
            (error) => {
                let message = "Error desconocido.";
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        message = "Permiso denegado por el usuario.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = "La ubicación no está disponible.";
                        break;
                    case error.TIMEOUT:
                        message = "Se agotó el tiempo de espera.";
                        break;
                }
                showError(message);
            },
            options
        );
    });
}

function showError(message) {
    const resultDiv = document.getElementById('location-result');
    resultDiv.innerHTML = `
        <div class="alert alert-danger">
            <strong>Error:</strong> ${message}
        </div>
    `;
}
