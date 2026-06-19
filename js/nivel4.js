/**
 * nivel4.js
 * Controlador principal del Nivel 4 – "El Núcleo de Procesamiento".
 *
 * Responsabilidades:
 *  1. Generar 20,000 datos simulados de sensores (temperatura y humedad).
 *  2. Enviarlos a un Web Worker para procesamiento asíncrono.
 *  3. Actualizar la barra de progreso de Bootstrap mientras el Worker trabaja.
 *  4. Mostrar las estadísticas finales en un card al terminar.
 *  5. Habilitar la transición al Nivel 5 una vez completado.
 */

/**
 * Genera un array de `cantidad` objetos con valores aleatorios de
 * temperatura (0–50 °C) y humedad (0–100 %).
 *
 * @param {number} cantidad - Número de registros a generar.
 * @returns {{ temperatura: number, humedad: number }[]}
 */
function generarDatosSensores(cantidad) {
    const datos = [];
    for (let i = 0; i < cantidad; i++) {
        datos.push({
            temperatura: parseFloat((Math.random() * 50).toFixed(4)),   // 0 – 50 °C
            humedad:     parseFloat((Math.random() * 100).toFixed(4))   // 0 – 100 %
        });
    }
    return datos;
}

/**
 * Punto de entrada del nivel. Llamado desde main.js → navigateToLevel(4).
 */
function initLevel4() {
    // --- Referencias a elementos del DOM ---
    const btnProcesar    = document.getElementById('nivel4-btn-procesar');
    const contenedorProg = document.getElementById('nivel4-progreso-contenedor');
    const barraProgreso  = document.getElementById('nivel4-barra');
    const textoProgreso  = document.getElementById('nivel4-texto-progreso');
    const contenedorRes  = document.getElementById('nivel4-resultado-contenedor');
    const btnSiguiente   = document.getElementById('nivel4-btn-siguiente');

    // Reiniciar estado visual (por si el usuario regresa al nivel)
    contenedorProg.classList.add('d-none');
    contenedorRes.classList.add('d-none');
    btnSiguiente.classList.add('d-none');
    setProgreso(barraProgreso, textoProgreso, 0);

    // --- Listener del botón "Iniciar Procesamiento" ---
    btnProcesar.addEventListener('click', function handler() {
        // Evitar doble clic
        btnProcesar.disabled = true;
        btnProcesar.textContent = 'Procesando…';

        // Mostrar barra de progreso y ocultar resultados previos
        contenedorProg.classList.remove('d-none');
        contenedorRes.classList.add('d-none');
        btnSiguiente.classList.add('d-none');
        setProgreso(barraProgreso, textoProgreso, 0);

        // 1. Generar datos en el hilo principal
        const TOTAL_DATOS = 20000;
        const datos = generarDatosSensores(TOTAL_DATOS);

        // 2. Crear Web Worker y transferir datos
        const worker = new Worker('js/workerNivel4.js');
        worker.postMessage(datos);

        // 3. Escuchar mensajes del Worker
        worker.onmessage = function (e) {
            const msg = e.data;

            if (msg.tipo === 'progreso') {
                setProgreso(barraProgreso, textoProgreso, msg.valor);
            }

            if (msg.tipo === 'resultado') {
                // Asegurar que la barra llegue al 100 %
                setProgreso(barraProgreso, textoProgreso, 100);

                // Mostrar estadísticas
                mostrarResultados(msg, contenedorRes);

                // Habilitar botón de avance
                btnSiguiente.classList.remove('d-none');

                // Limpiar worker
                worker.terminate();

                // Restaurar botón de inicio
                btnProcesar.disabled = false;
                btnProcesar.textContent = 'Reprocesar Datos';
            }
        };

        worker.onerror = function (err) {
            console.error('Error en el Web Worker:', err);
            btnProcesar.disabled = false;
            btnProcesar.textContent = 'Reintentar';
            worker.terminate();
        };
    });

    // --- Botón para avanzar al Nivel 5 ---
    btnSiguiente.addEventListener('click', function () {
        completeLevel(4);
    });
}

/**
 * Actualiza la barra de progreso de Bootstrap y su etiqueta.
 *
 * @param {HTMLElement} barra   - El elemento .progress-bar
 * @param {HTMLElement} texto   - El elemento que muestra el porcentaje en texto
 * @param {number}      valor   - Porcentaje (0–100)
 */
function setProgreso(barra, texto, valor) {
    barra.style.width     = valor + '%';
    barra.setAttribute('aria-valuenow', valor);
    barra.textContent     = valor + '%';
    if (texto) texto.textContent = `Procesando datos… ${valor}%`;
}

/**
 * Renderiza los resultados dentro del contenedor de resultados.
 *
 * @param {{ temperatura: object, humedad: object, totalProcesados: number }} resultado
 * @param {HTMLElement} contenedor
 */
function mostrarResultados(resultado, contenedor) {
    const { temperatura, humedad, totalProcesados } = resultado;

    contenedor.innerHTML = `
        <p class="mb-3">
            Procesamiento completado &mdash; ${totalProcesados.toLocaleString()} registros analizados.
        </p>

        <!-- Tarjeta de Temperatura -->
        <div class="card bg-secondary text-white mb-3 text-start">
            <div class="card-header fw-bold">Sensor de Temperatura (&deg;C)</div>
            <div class="card-body">
                <div class="row text-center">
                    <div class="col-4">
                        <div class="small">Promedio</div>
                        <div class="fs-5 fw-bold">${temperatura.promedio}</div>
                    </div>
                    <div class="col-4">
                        <div class="small">M&aacute;ximo</div>
                        <div class="fs-5 fw-bold">${temperatura.maximo}</div>
                    </div>
                    <div class="col-4">
                        <div class="small">M&iacute;nimo</div>
                        <div class="fs-5 fw-bold">${temperatura.minimo}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tarjeta de Humedad -->
        <div class="card bg-secondary text-white mb-3 text-start">
            <div class="card-header fw-bold">Sensor de Humedad (%)</div>
            <div class="card-body">
                <div class="row text-center">
                    <div class="col-4">
                        <div class="small">Promedio</div>
                        <div class="fs-5 fw-bold">${humedad.promedio}</div>
                    </div>
                    <div class="col-4">
                        <div class="small">M&aacute;ximo</div>
                        <div class="fs-5 fw-bold">${humedad.maximo}</div>
                    </div>
                    <div class="col-4">
                        <div class="small">M&iacute;nimo</div>
                        <div class="fs-5 fw-bold">${humedad.minimo}</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    contenedor.classList.remove('d-none');
}
