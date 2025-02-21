async function fetchPrograms() {
    const urls = [
        "https://db.sense.fitness/api/Programa/4",
        "https://db.sense.fitness/api/Programa/3",
        "https://db.sense.fitness/api/Programa/2",
        "https://db.sense.fitness/api/Programa/1"
    ];

    const programsContainer = document.getElementById("programs");
    programsContainer.innerHTML = "";

    for (let url of urls) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error ${response.status}`);
            const data = await response.json();

            const programDiv = document.createElement("div");
            programDiv.className = "program";
            programDiv.innerHTML = `<h2>${data.nombre}</h2>`;

            data.bloques.forEach(bloque => {
                let ejercicios = bloque.ejercicios.replace(/<br>/g, '\n').replace(/<.*?>/g, '');
                programDiv.innerHTML += `<p><strong>Bloque ${bloque.bloque}:</strong><br>${ejercicios.replace(/\n/g, '<br>')}</p>`;
            });

            programsContainer.appendChild(programDiv);
        } catch (error) {
            console.error("Error al obtener datos: ", error);
        }
    }
}

fetchPrograms();
