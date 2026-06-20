let resultadoNivel5 = null;

function generarDatosNivel5(cantidad) {
    const datos = new Array(cantidad);
    for (let i = 0; i < cantidad; i++) {
        datos[i] = {
            temperatura: parseFloat((Math.random() * 70 - 20).toFixed(4)),
            presion: parseFloat((Math.random() * 1110 - 10).toFixed(4))
        };
    }
    return datos;
}

function initLevel5() {
    const btnProcesar = document.getElementById('nivel5-btn-procesar');
    const contenedorProg = document.getElementById('nivel5-progreso-contenedor');
    const barra = document.getElementById('nivel5-barra');
    const textoProgreso = document.getElementById('nivel5-texto-progreso');
    const contenedorRes = document.getElementById('nivel5-resultado-contenedor');
    const btnExportar = document.getElementById('nivel5-btn-exportar');
    const btnFinalizar = document.getElementById('nivel5-btn-finalizar');

    contenedorProg.classList.add('d-none');
    contenedorRes.classList.add('d-none');
    btnExportar.classList.add('d-none');
    btnFinalizar.classList.add('d-none');
    setProgresoN5(barra, textoProgreso, 0);
    resultadoNivel5 = null;

    btnProcesar.addEventListener('click', function handler() {
        btnProcesar.disabled = true;
        btnProcesar.textContent = 'Procesando…';

        contenedorProg.classList.remove('d-none');
        contenedorRes.classList.add('d-none');
        btnExportar.classList.add('d-none');
        btnFinalizar.classList.add('d-none');
        setProgresoN5(barra, textoProgreso, 0);

        const TOTAL = 250000;
        const datos = generarDatosNivel5(TOTAL);

        const worker = new Worker('js/workerNivel5.js');
        worker.postMessage(datos);

        worker.onmessage = function (e) {
            const msg = e.data;

            if (msg.tipo === 'progreso') {
                setProgresoN5(barra, textoProgreso, msg.valor);
            }

            if (msg.tipo === 'resultado') {
                setProgresoN5(barra, textoProgreso, 100);
                resultadoNivel5 = msg;
                mostrarResultadosN5(msg, contenedorRes);
                btnExportar.classList.remove('d-none');
                btnFinalizar.classList.remove('d-none');
                worker.terminate();
                btnProcesar.disabled = false;
                btnProcesar.textContent = 'Reprocesar Datos';
            }
        };

        worker.onerror = function (err) {
            console.error('Error en Web Worker:', err);
            btnProcesar.disabled = false;
            btnProcesar.textContent = 'Reintentar';
            worker.terminate();
        };
    });

    btnExportar.addEventListener('click', function () {
        if (!resultadoNivel5) return;
        const json = JSON.stringify(resultadoNivel5, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resultado-sensores.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    btnFinalizar.addEventListener('click', function () {
        completeLevel(5);
    });
}

function setProgresoN5(barra, texto, valor) {
    barra.style.width = valor + '%';
    barra.setAttribute('aria-valuenow', valor);
    barra.textContent = valor + '%';
    if (texto) texto.textContent = 'Procesando datos… ' + valor + '%';
}

function mostrarResultadosN5(r, contenedor) {
    contenedor.innerHTML = `
        <p class="mb-3">
            Procesamiento completado &mdash; ${r.totalRegistros.toLocaleString()} registros analizados.
        </p>

        <div class="card bg-dark text-white mb-3 text-start">
            <div class="card-header fw-bold">Resumen de Filtrado</div>
            <div class="card-body">
                <div class="row text-center">
                    <div class="col-4">
                        <div class="small">Registros V&aacute;lidos</div>
                        <div class="fs-5 fw-bold text-success">${r.registrosValidos.toLocaleString()}</div>
                    </div>
                    <div class="col-4">
                        <div class="small">Registros Inv&aacute;lidos</div>
                        <div class="fs-5 fw-bold text-danger">${r.registrosInvalidos.toLocaleString()}</div>
                    </div>
                    <div class="col-4">
                        <div class="small">% V&aacute;lidos</div>
                        <div class="fs-5 fw-bold">${((r.registrosValidos / r.totalRegistros) * 100).toFixed(1)}%</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card bg-dark text-white mb-3 text-start">
            <div class="card-header fw-bold">Temperatura (&deg;C)</div>
            <div class="card-body">
                <p class="mb-2">Promedio: <strong>${r.temperatura.promedio}</strong></p>
                <div class="small">Top 10:</div>
                <ol class="mb-0 small">
                    ${r.temperatura.top10.map(function (v) { return '<li>' + v.toFixed(2) + ' &deg;C</li>'; }).join('')}
                </ol>
            </div>
        </div>

        <div class="card bg-dark text-white mb-3 text-start">
            <div class="card-header fw-bold">Presi&oacute;n (hPa)</div>
            <div class="card-body">
                <p class="mb-2">Promedio: <strong>${r.presion.promedio}</strong></p>
                <div class="small">Top 10:</div>
                <ol class="mb-0 small">
                    ${r.presion.top10.map(function (v) { return '<li>' + v.toFixed(2) + ' hPa</li>'; }).join('')}
                </ol>
            </div>
        </div>
    `;
    contenedor.classList.remove('d-none');
}
