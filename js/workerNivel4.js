/**
 * workerNivel4.js
 * Web Worker para el procesamiento de datos de sensores virtuales.
 * Recibe un array de datos, los procesa en lotes y envía mensajes
 * de progreso al hilo principal sin bloquearlo.
 */

self.onmessage = function (e) {
    const datos = e.data; // Array de 20,000 objetos { temperatura, humedad }
    const total = datos.length;
    const BATCH_SIZE = 500; // Procesamos en lotes para poder reportar progreso

    // Acumuladores para temperatura
    let sumTemp = 0;
    let maxTemp = -Infinity;
    let minTemp = Infinity;

    // Acumuladores para humedad
    let sumHum = 0;
    let maxHum = -Infinity;
    let minHum = Infinity;

    let procesados = 0;

    /**
     * Procesa un lote de datos de forma recursiva usando setTimeout(0)
     * para no bloquear el event loop del worker y permitir enviar mensajes.
     */
    function procesarLote() {
        const fin = Math.min(procesados + BATCH_SIZE, total);

        for (let i = procesados; i < fin; i++) {
            const { temperatura, humedad } = datos[i];

            sumTemp += temperatura;
            if (temperatura > maxTemp) maxTemp = temperatura;
            if (temperatura < minTemp) minTemp = temperatura;

            sumHum += humedad;
            if (humedad > maxHum) maxHum = humedad;
            if (humedad < minHum) minHum = humedad;
        }

        procesados = fin;

        // Calcular y reportar progreso (0 a 100)
        const progreso = Math.round((procesados / total) * 100);
        self.postMessage({ tipo: 'progreso', valor: progreso });

        if (procesados < total) {
            // Ceder el control brevemente antes del siguiente lote
            setTimeout(procesarLote, 0);
        } else {
            // Todos los datos procesados: enviar resultados finales
            const resultado = {
                tipo: 'resultado',
                temperatura: {
                    promedio: parseFloat((sumTemp / total).toFixed(2)),
                    maximo:   parseFloat(maxTemp.toFixed(2)),
                    minimo:   parseFloat(minTemp.toFixed(2))
                },
                humedad: {
                    promedio: parseFloat((sumHum / total).toFixed(2)),
                    maximo:   parseFloat(maxHum.toFixed(2)),
                    minimo:   parseFloat(minHum.toFixed(2))
                },
                totalProcesados: total
            };
            self.postMessage(resultado);
        }
    }

    // Arrancar el primer lote
    procesarLote();
};
