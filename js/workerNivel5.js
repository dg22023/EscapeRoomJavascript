self.onmessage = function (e) {
    const datos = e.data;
    const total = datos.length;
    const BATCH_SIZE = 2000;

    let sumTemp = 0;
    let sumPresion = 0;
    let validos = 0;

    const topTemp = [];
    const topPresion = [];

    function mantenerTop10(arr, valor) {
        arr.push(valor);
        arr.sort(function (a, b) { return b - a; });
        if (arr.length > 10) arr.length = 10;
    }

    let procesados = 0;

    function procesarLote() {
        const fin = Math.min(procesados + BATCH_SIZE, total);

        for (let i = procesados; i < fin; i++) {
            const t = datos[i].temperatura;
            const p = datos[i].presion;
            if (t >= 0 && p >= 0) {
                sumTemp += t;
                sumPresion += p;
                mantenerTop10(topTemp, t);
                mantenerTop10(topPresion, p);
                validos++;
            }
        }

        procesados = fin;
        const progreso = Math.round((procesados / total) * 100);
        self.postMessage({ tipo: 'progreso', valor: progreso });

        if (procesados < total) {
            setTimeout(procesarLote, 0);
        } else {
            const promedioTemp = validos > 0 ? parseFloat((sumTemp / validos).toFixed(2)) : 0;
            const promedioPresion = validos > 0 ? parseFloat((sumPresion / validos).toFixed(2)) : 0;

            self.postMessage({
                tipo: 'resultado',
                totalRegistros: total,
                registrosValidos: validos,
                registrosInvalidos: total - validos,
                temperatura: {
                    promedio: promedioTemp,
                    top10: topTemp
                },
                presion: {
                    promedio: promedioPresion,
                    top10: topPresion
                }
            });
        }
    }

    procesarLote();
};
