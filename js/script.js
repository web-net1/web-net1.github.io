// Función para el botón "JUGAR AHORA"
const playButton = document.getElementById('play-button');
if (playButton) {
    playButton.addEventListener('click', function(event) {
        event.preventDefault(); // Evita el comportamiento predeterminado del enlace
        alert('Conectando al servidor...'); // Mensaje interactivo
        window.location.href = 'samp://92.133.12.78:7777'; // Redirige al cliente de SAMP
    });
}

// Ruta del archivo JSON con los datos de los vehículos
const jsonFilePath = "../data/autos.json";

// Contenedores para los vehículos organizados arriba y abajo
const vehiclesContainerTop = document.getElementById("vehicles-container-top");
const vehiclesContainerBottom = document.getElementById("vehicles-container-bottom");

// Función para cargar y mostrar vehículos desde el archivo JSON
fetch(jsonFilePath)
    .then(response => response.json())
    .then(data => {
        // Ordenar los vehículos alfabéticamente
        const sortedVehicles = data.sort((a, b) => a.nombre.localeCompare(b.nombre));

        // Función para mostrar vehículos en un contenedor
        const displayVehicles = (container, vehicles) => {
            vehicles.forEach(vehicle => {
                // Crear la estructura HTML de cada vehículo
                const vehicleItem = document.createElement("div");
                vehicleItem.classList.add("vehicle-item");

                vehicleItem.innerHTML = `
                    <img src="${vehicle.imagen}" alt="${vehicle.nombre}" class="vehicle-img">
                    <div class="vehicle-details">
                        <p><strong>Nombre:</strong> ${vehicle.nombre}</p>
                        <p><strong>Precio:</strong> $${vehicle.precio}</p>
                        <button class="purchase-btn" data-nombre="${vehicle.nombre}" data-precio="${vehicle.precio}">Pedir</button>
                    </div>
                `;

                // Agregar el vehículo al contenedor
                container.appendChild(vehicleItem);
            });
        };

        // Dividir los vehículos por sección (Arriba y Abajo)
        const halfway = Math.ceil(sortedVehicles.length / 2);
        const vehiclesTop = sortedVehicles.slice(0, halfway); // Primera mitad
        const vehiclesBottom = sortedVehicles.slice(halfway); // Segunda mitad

        // Mostrar los vehículos en las secciones correspondientes
        displayVehicles(vehiclesContainerTop, vehiclesTop);
        displayVehicles(vehiclesContainerBottom, vehiclesBottom);

        // Agregar el evento de "Pedir" a cada botón
        document.querySelectorAll(".purchase-btn").forEach(button => {
            button.addEventListener("click", () => {
                const vehicleName = button.getAttribute("data-nombre");
                const vehiclePrice = button.getAttribute("data-precio");
                const discordUser = prompt("Por favor, ingresa tu usuario de Discord (Ejemplo: UsuarioDiscord#1234):");

                if (discordUser) {
                    sendToDiscord(vehicleName, vehiclePrice, discordUser);
                    alert(`¡Gracias por tu pedido! \n\nDetalles:\n- Vehículo: ${vehicleName}\n- Precio: $${vehiclePrice}\n- Usuario de Discord: ${discordUser}`);
                } else {
                    alert("El pedido ha sido cancelado. Por favor, proporciona un usuario de Discord válido.");
                }
            });
        });
    })
    .catch(error => console.error("Error al cargar los vehículos:", error));

// Función para enviar datos como embed al Discord
function sendToDiscord(vehicleName, vehiclePrice, discordUser) {
    const embedMessage = {
        embeds: [
            {
                title: "🚗 Vehículo Pedido",
                color: 3447003, // Azul
                fields: [
                    { name: "Nombre del Vehículo", value: vehicleName, inline: true },
                    { name: "Precio", value: `$${vehiclePrice}`, inline: true },
                    { name: "Usuario de Discord", value: discordUser, inline: false }
                ],
                footer: { text: "¡Gracias por tu pedido!" },
                timestamp: new Date().toISOString()
            }
        ]
    };

    const webhookUrl = "https://discordapp.com/api/webhooks/1358938372285923589/bopBjt2btrcRGAC4YUMJZtt4TDsZkNgFa7tEyvYFcGLp5AfiK4iqmt4umfxZBeGKkxWk";

    fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(embedMessage)
    })
    .then(response => {
        if (!response.ok) {
            console.error("Error al enviar los datos a Discord");
        }
    })
    .catch(error => console.error("Error en Discord Webhook:", error));
}
