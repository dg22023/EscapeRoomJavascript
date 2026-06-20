/**
 * Worker del Nivel 5: procesa los registros transferidos desde el hilo principal.
 */

const NIVEL5_CHUNK_COUNT = 20;
const NIVEL5_CHUNK_DELAY_MS = 40;

self.onmessage = function (event) {
    const { count, temperatura, humedad, presion } = event.data;
    procesarDatosNivel5(count, temperatura, humedad, presion);
};

function procesarDatosNivel5(count, temperatura, humedad, presion) {
    const chunkSize = Math.ceil(count / NIVEL5_CHUNK_COUNT);

    let sumaTemperatura = 0;
    let sumaHumedad = 0;
    let sumaPresion = 0;
    let registrosValidos = 0;
    const temperaturasValidas = [];
    const presionesValidas = [];

    let chunkIndex = 0;

    procesarSiguienteChunk();

    function procesarSiguienteChunk() {
        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, count);

        for (let i = start; i < end; i++) {
            const t = temperatura[i];
            const h = humedad[i];
            const p = presion[i];

            if (t >= 0 && h >= 0 && p >= 0) {
                registrosValidos++;
                sumaTemperatura += t;
                sumaHumedad += h;
                sumaPresion += p;
                temperaturasValidas.push(t);
                presionesValidas.push(p);
            }
        }

        chunkIndex++;
        const percent = Math.min(Math.round((chunkIndex / NIVEL5_CHUNK_COUNT) * 100), 100);
        self.postMessage({ type: 'progress', percent: percent });

        if (end < count) {
            setTimeout(procesarSiguienteChunk, NIVEL5_CHUNK_DELAY_MS);
        } else {
            finalizarProcesamiento();
        }
    }

    function finalizarProcesamiento() {
        temperaturasValidas.sort((a, b) => b - a);
        presionesValidas.sort((a, b) => b - a);

        const stats = {
            totalGenerados: count,
            registrosValidos: registrosValidos,
            registrosDescartados: count - registrosValidos,
            promedioTemperatura: registrosValidos > 0 ? sumaTemperatura / registrosValidos : 0,
            promedioHumedad: registrosValidos > 0 ? sumaHumedad / registrosValidos : 0,
            promedioPresion: registrosValidos > 0 ? sumaPresion / registrosValidos : 0,
            top10Temperaturas: temperaturasValidas.slice(0, 10),
            top10Presiones: presionesValidas.slice(0, 10),
            generadoEn: new Date().toISOString()
        };

        self.postMessage({ type: 'done', stats: stats });
    }
}
