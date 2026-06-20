/**
 * Lógica del Nivel 5: El Portal Cuántico
 */

const NIVEL5_TOTAL_REGISTROS = 250000;
const NIVEL5_PROB_NEGATIVO = 0.06;

let nivel5Worker = null;
let nivel5Stats = null;
let nivel5TickerInterval = null;
let nivel5TickerCount = 0;

function initLevel5() {
    const generateBtn = document.getElementById('nivel5-generate-btn');
    const downloadBtn = document.getElementById('nivel5-download-btn');

    if (!generateBtn) return;

    generateBtn.addEventListener('click', runNivel5);
    downloadBtn.addEventListener('click', descargarResultadosNivel5);
}

function runNivel5() {
    if (nivel5Worker) return;

    if (!window.Worker) {
        mostrarErrorNivel5('Tu navegador no soporta Web Workers.');
        return;
    }

    ocultarErrorNivel5();
    document.getElementById('nivel5-stats-card').classList.add('d-none');
    document.getElementById('nivel5-success').classList.add('d-none');
    deshabilitarBotonGenerar();
    mostrarBarraProgresoNivel5();
    iniciarContadorEnVivo();

    const datos = generarDatosNivel5();

    nivel5Worker = new Worker('js/worker-nivel5.js');
    nivel5Worker.onmessage = manejarMensajeWorkerNivel5;
    nivel5Worker.onerror = manejarErrorWorkerNivel5;

    nivel5Worker.postMessage(
        { count: NIVEL5_TOTAL_REGISTROS, temperatura: datos.temperatura, humedad: datos.humedad, presion: datos.presion },
        [datos.temperatura.buffer, datos.humedad.buffer, datos.presion.buffer]
    );
}

function generarValorSensorNivel5(min, max) {
    const valor = min + Math.random() * (max - min);
    return Math.random() < NIVEL5_PROB_NEGATIVO ? -valor : valor;
}

function generarDatosNivel5() {
    const temperatura = new Float64Array(NIVEL5_TOTAL_REGISTROS);
    const humedad = new Float64Array(NIVEL5_TOTAL_REGISTROS);
    const presion = new Float64Array(NIVEL5_TOTAL_REGISTROS);

    for (let i = 0; i < NIVEL5_TOTAL_REGISTROS; i++) {
        temperatura[i] = generarValorSensorNivel5(0, 45);
        humedad[i] = generarValorSensorNivel5(0, 100);
        presion[i] = generarValorSensorNivel5(0, 1050);
    }

    return { temperatura, humedad, presion };
}

function manejarMensajeWorkerNivel5(event) {
    const data = event.data;

    if (data.type === 'progress') {
        actualizarBarraProgresoNivel5(data.percent);
    } else if (data.type === 'done') {
        detenerContadorEnVivo();
        nivel5Stats = data.stats;
        mostrarResultadosNivel5(data.stats);
        habilitarBotonGenerar();
        if (nivel5Worker) {
            nivel5Worker.terminate();
            nivel5Worker = null;
        }
    }
}

function manejarErrorWorkerNivel5(error) {
    detenerContadorEnVivo();
    mostrarErrorNivel5('Ocurrió un error procesando los datos: ' + error.message);
    habilitarBotonGenerar();
    ocultarBarraProgresoNivel5();
    if (nivel5Worker) {
        nivel5Worker.terminate();
        nivel5Worker = null;
    }
}

function mostrarBarraProgresoNivel5() {
    document.getElementById('nivel5-progress-container').classList.remove('d-none');
    actualizarBarraProgresoNivel5(0);
}

function ocultarBarraProgresoNivel5() {
    document.getElementById('nivel5-progress-container').classList.add('d-none');
}

function actualizarBarraProgresoNivel5(percent) {
    const bar = document.getElementById('nivel5-progress-bar');
    bar.style.width = percent + '%';
    bar.textContent = percent + '%';
}

function iniciarContadorEnVivo() {
    nivel5TickerCount = 0;
    const tickerEl = document.getElementById('nivel5-ui-ticker');
    nivel5TickerInterval = setInterval(() => {
        nivel5TickerCount++;
        if (tickerEl) tickerEl.textContent = 'Interfaz activa (' + nivel5TickerCount + ')';
    }, 250);
}

function detenerContadorEnVivo() {
    clearInterval(nivel5TickerInterval);
    nivel5TickerInterval = null;
    const tickerEl = document.getElementById('nivel5-ui-ticker');
    if (tickerEl) tickerEl.textContent = 'Interfaz activa';
}

function deshabilitarBotonGenerar() {
    document.getElementById('nivel5-generate-btn').disabled = true;
}

function habilitarBotonGenerar() {
    document.getElementById('nivel5-generate-btn').disabled = false;
}

function mostrarResultadosNivel5(stats) {
    ocultarBarraProgresoNivel5();

    const statsList = document.getElementById('nivel5-stats-list');
    statsList.innerHTML =
        '<li class="list-group-item bg-dark text-white">Total generados: ' + stats.totalGenerados.toLocaleString('es-SV') + '</li>' +
        '<li class="list-group-item bg-dark text-white">Registros válidos: ' + stats.registrosValidos.toLocaleString('es-SV') + '</li>' +
        '<li class="list-group-item bg-dark text-white">Registros descartados (negativos): ' + stats.registrosDescartados.toLocaleString('es-SV') + '</li>' +
        '<li class="list-group-item bg-dark text-white">Promedio Temperatura: ' + stats.promedioTemperatura.toFixed(2) + ' °C</li>' +
        '<li class="list-group-item bg-dark text-white">Promedio Humedad: ' + stats.promedioHumedad.toFixed(2) + ' %</li>' +
        '<li class="list-group-item bg-dark text-white">Promedio Presión: ' + stats.promedioPresion.toFixed(2) + ' hPa</li>';

    const topTempList = document.getElementById('nivel5-top-temp');
    topTempList.innerHTML = stats.top10Temperaturas.map(t => '<li>' + t.toFixed(2) + ' °C</li>').join('');

    const topPresionList = document.getElementById('nivel5-top-presion');
    topPresionList.innerHTML = stats.top10Presiones.map(p => '<li>' + p.toFixed(2) + ' hPa</li>').join('');

    document.getElementById('nivel5-stats-card').classList.remove('d-none');
    document.getElementById('nivel5-download-btn').disabled = false;
}

function descargarResultadosNivel5() {
    if (!nivel5Stats) return;

    const blob = new Blob([JSON.stringify(nivel5Stats, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'portal-cuantico-resultados.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    mostrarMensajeFinalNivel5();
}

function mostrarMensajeFinalNivel5() {
    gameState.levelsCompleted[5] = true;
    document.getElementById('nivel5-success').classList.remove('d-none');
}

function mostrarErrorNivel5(mensaje) {
    const errorDiv = document.getElementById('nivel5-error');
    errorDiv.innerHTML = '<div class="alert alert-danger">' + mensaje + '</div>';
    errorDiv.classList.remove('d-none');
}

function ocultarErrorNivel5() {
    const errorDiv = document.getElementById('nivel5-error');
    errorDiv.innerHTML = '';
    errorDiv.classList.add('d-none');
}
