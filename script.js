async function fetchPrograms() {
    const urls = [
        "https://db.sense.fitness/api/Programa/4",
        "https://db.sense.fitness/api/Programa/3",
        "https://db.sense.fitness/api/Programa/2",
        "https://db.sense.fitness/api/Programa/1"
    ];

    const programsContainer = document.getElementById("programs");
    programsContainer.innerHTML = "";
    let allPrograms = []; // Array para almacenar todos los programas

    for (let url of urls) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error ${response.status}`);
            const data = await response.json();

            allPrograms.push(data); // Guardar los datos en el array

            // Mostrar en pantalla con formato limpio
            const programDiv = document.createElement("div");
            programDiv.className = "program";
            programDiv.innerHTML = `<h2>${data.nombre}</h2>`;

            data.bloques.forEach(bloque => {
                let ejercicios = bloque.ejercicios
                    .replace(/<br>/g, '\n')
                    .replace(/<.*?>/g, '')
                    .replace(/&#\d+;/g, match => {
                        const textarea = document.createElement("textarea");
                        textarea.innerHTML = match;
                        return textarea.value;
                    });
                programDiv.innerHTML += `<p><strong>Bloque ${bloque.bloque}:</strong><br>${ejercicios.replace(/\n/g, '<br>')}</p>`;
            });

            programsContainer.appendChild(programDiv);
        } catch (error) {
            console.error("Error al obtener datos: ", error);
        }
    }

    // Agregar funcionalidad para descargar el JSON con formato limpio
    document.getElementById("downloadButton").onclick = () => downloadJSON(allPrograms);
}

// Función para descargar el JSON con formato limpio
function downloadJSON(data) {
    if (!data.length) {
        console.error("No hay datos para descargar.");
        return;
    }
    
    let fecha = "sin-fecha";
    if (data[0] && data[0].bloques && data[0].bloques.length > 0 && data[0].bloques[0].fecha) {
        const fechaObj = new Date(data[0].bloques[0].fecha);
        fecha = `${fechaObj.getDate().toString().padStart(2, '0')}/${(fechaObj.getMonth() + 1).toString().padStart(2, '0')}/${fechaObj.getFullYear()}`;
    }
    
    // Formatear los datos de salida
    let formattedText = data.map(programa => {
        let bloquesText = programa.bloques.map(bloque => {
            let ejercicios = bloque.ejercicios
                .replace(/<br>/g, '\n')
                .replace(/<.*?>/g, '')
                .replace(/&#\d+;/g, match => {
                    const textarea = document.createElement("textarea");
                    textarea.innerHTML = match;
                    return textarea.value;
                });
            return `Bloque ${bloque.bloque}:\n${ejercicios}\n`;
        }).join('\n');
        return `${programa.nombre}\n${bloquesText}`;
    }).join('\n');
    
    const blob = new Blob([formattedText], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `PlanificacionSense-${fecha}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Ejecutar la función
fetchPrograms();
