/**
 * Lógica del Nivel 3: La Evidencia del Explorador
 * Acceso a cámara, captura de fotografía y almacenamiento en LocalStorage.
 */

let cameraStream = null;

/**
 * Inicializa el Nivel 3
 */
function initLevel3() {

    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    const photo = document.getElementById('captured-photo');

    const startBtn = document.getElementById('start-camera-btn');
    const captureBtn = document.getElementById('capture-photo-btn');
    const continueBtn = document.getElementById('continue-level-4-btn');

    const message = document.getElementById('camera-message');

    // Evitar múltiples eventos si el usuario vuelve al nivel
    startBtn.replaceWith(startBtn.cloneNode(true));
    captureBtn.replaceWith(captureBtn.cloneNode(true));
    continueBtn.replaceWith(continueBtn.cloneNode(true));

    const btnStart = document.getElementById('start-camera-btn');
    const btnCapture = document.getElementById('capture-photo-btn');
    const btnContinue = document.getElementById('continue-level-4-btn');

    // Revisar si existe una fotografía guardada
    const savedPhoto = localStorage.getItem('escapeRoomPhoto');

    if (savedPhoto) {

        photo.src = savedPhoto;
        photo.classList.remove('d-none');

        btnContinue.classList.remove('d-none');

        message.innerHTML = `
            <div class="alert alert-success">
                Fotografía recuperada desde LocalStorage.
            </div>
        `;
    }

    /**
     * Activar cámara
     */
    btnStart.addEventListener('click', async () => {

        message.innerHTML = '';

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {

            message.innerHTML = `
                <div class="alert alert-danger">
                    Tu navegador no soporta acceso a cámara.
                </div>
            `;

            return;
        }

        try {

            cameraStream = await navigator.mediaDevices.getUserMedia({

                video: true,
                audio: false

            });

            video.srcObject = cameraStream;

            btnCapture.classList.remove('d-none');

            message.innerHTML = `
                <div class="alert alert-success">
                    Cámara activada correctamente.
                </div>
            `;

        }

        catch (error) {

        console.error(error);

        let texto = "Ocurrió un error al acceder a la cámara.";

        if (error.name === "NotAllowedError") {
        texto = "Permiso denegado por el usuario.";
    }

        if (error.name === "NotFoundError") {
        texto = "No se encontró ninguna cámara disponible.";
    }

        message.innerHTML = `
        <div class="alert alert-danger">
            ${texto}
        </div>
    `;
}

    });

        /**
     * Capturar fotografía
     */
    btnCapture.addEventListener('click', () => {

        const context = canvas.getContext('2d');

        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

        const imageData = canvas.toDataURL('image/png');

        // Guardar en LocalStorage
        localStorage.setItem('escapeRoomPhoto', imageData);

        // Mostrar fotografía
        photo.src = imageData;
        photo.classList.remove('d-none');

        // Mostrar botón para continuar
        btnContinue.classList.remove('d-none');

        message.innerHTML = `
            <div class="alert alert-success">
                Fotografía capturada y guardada correctamente.
            </div>
        `;

        // Detener cámara
        if (cameraStream) {

            cameraStream.getTracks().forEach(track => {

                track.stop();

            });

        }

        video.srcObject = null;

    });

    /**
     * Continuar al siguiente nivel
     */
    btnContinue.addEventListener('click', () => {

        completeLevel(3);

    });

}