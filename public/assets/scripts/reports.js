// reports.js
document.addEventListener("DOMContentLoaded", () => {
    // --- Lógica del Modal de Reporte de Incidente (EXISTENTE) ---
    const openReportModalBtn = document.getElementById("openReportModalBtn");
    const reportIncidentModal = document.getElementById("reportIncidentModal");
    const closeReportModalBtn = document.getElementById("closeReportModalBtn");
    const cancelReportBtn = document.getElementById("cancelReportBtn");
    const incidentTypeButtons = document.querySelectorAll(".btn-incident-type");
    const incidentReportForm = document.getElementById("incidentReportForm");
    const ubicacionInput = document.getElementById("ubicacion");
    const fechaInput = document.getElementById("fecha");
    const horaInput = document.getElementById("hora");
    const descripcionTextarea = document.getElementById("descripcion");

    // Referencias a los elementos donde se mostrarán los mensajes de error
    const incidentTypeError = document.getElementById("incidentTypeError");
    const ubicacionError = document.getElementById("ubicacionError");
    const fechaError = document.getElementById("fechaError");
    const horaError = document.getElementById("horaError");
    const descripcionError = document.getElementById("descripcionError");

    function resetReportModal() {
        if (incidentReportForm) {
            incidentReportForm.reset();
        }
        incidentTypeButtons.forEach(btn => btn.classList.remove('selected'));
        // Limpiar errores del formulario de reporte si los hubiera
        if (incidentTypeError) incidentTypeError.textContent = '';
        if (ubicacionError) ubicacionError.textContent = '';
        if (fechaError) fechaError.textContent = '';
        if (horaError) horaError.textContent = '';
        if (descripcionError) descripcionError.textContent = '';
    }

    if (openReportModalBtn && reportIncidentModal) {
        openReportModalBtn.addEventListener("click", () => {
            reportIncidentModal.style.display = 'flex';
            document.body.style.overflow = "hidden";
            resetReportModal();
        });

        if (closeReportModalBtn) {
            closeReportModalBtn.addEventListener("click", () => {
                reportIncidentModal.style.display = 'none';
                document.body.style.overflow = "auto";
            });
        }
        if (cancelReportBtn) {
            cancelReportBtn.addEventListener("click", () => {
                reportIncidentModal.style.display = 'none';
                document.body.style.overflow = "auto";
            });
        }
        window.addEventListener("click", (event) => {
            if (event.target === reportIncidentModal) {
                reportIncidentModal.style.display = 'none';
                document.body.style.overflow = "auto";
            }
        });
    }

    // --- Flatpickr para Fecha y Hora en el modal de reporte ---
    if (fechaInput) {
        flatpickr("#fecha", {
            dateFormat: "d/m/Y",
            locale: "es",
            maxDate: "today"
        });
    }
    if (horaInput) {
        flatpickr("#hora", {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true,
            locale: "es"
        });
    }
    
    // Selección de Tipo de Incidente
    if (incidentTypeButtons.length > 0) {
        incidentTypeButtons.forEach(button => {
            button.addEventListener("click", () => {
                incidentTypeButtons.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
                if (incidentTypeError) incidentTypeError.textContent = "";
            });
        });
    }

    // --- Lógica de la sección "Ver Reportes" y Navegación ---
    const verReportesNavLink = document.querySelector(".sidebar-nav .nav-link i.fa-file-alt").closest('a');
    const mapSection = document.getElementById("mapSection"); 
    const reportsListSection = document.getElementById("reportsListSection");
    const reportsContainer = document.getElementById("reportsContainer");

    function showSection(sectionToShow) {
        if (mapSection) mapSection.style.display = 'none';
        if (reportsListSection) reportsListSection.style.display = 'none';

        if (sectionToShow === 'map' && mapSection) {
            mapSection.style.display = 'flex';
        } else if (sectionToShow === 'reports' && reportsListSection) {
            reportsListSection.style.display = 'block';
            loadReports(); // Cargar los reportes cada vez que se muestra la sección
        }
    }

    if (verReportesNavLink) {
        verReportesNavLink.addEventListener("click", (event) => {
            event.preventDefault();
            showSection('reports');

            document.querySelectorAll(".sidebar-nav .nav-link").forEach(link => {
                link.classList.remove('active');
            });
            verReportesNavLink.classList.add('active');
        });
    }

    const inicioNavLink = document.querySelector(".sidebar-nav .nav-link i.fa-home").closest('a');
    if (inicioNavLink) {
        inicioNavLink.addEventListener("click", (event) => {
            event.preventDefault();
            showSection('map');

            document.querySelectorAll(".sidebar-nav .nav-link").forEach(link => {
                link.classList.remove('active');
            });
            inicioNavLink.classList.add('active');
        });
    }

    // Función para guardar un reporte en localStorage
    function saveReport(reportData) {
        let reports = JSON.parse(localStorage.getItem('civitrackReports')) || [];
        reports.push(reportData);
        localStorage.setItem('civitrackReports', JSON.stringify(reports));
    }
    // Eliminar un reporte del localStorage
    function deleteReport(idToDelete) {
        let reports = JSON.parse(localStorage.getItem('civitrackReports')) || [];
        const updatedReports = reports.filter(report => report.id !== idToDelete);
        localStorage.setItem('civitrackReports', JSON.stringify(updatedReports));
        loadReports(); // Recargar los reportes después de eliminar
    }

    // Función para cargar y mostrar los reportes
    function loadReports() {
        if (!reportsContainer) {
            console.error("El contenedor de reportes (reportsContainer) no se encontró.");
            return;
        }
        reportsContainer.innerHTML = ''; // Limpiar el contenedor antes de cargar

        let reports = JSON.parse(localStorage.getItem('civitrackReports')) || [];

        if (reports.length === 0) {
            reportsContainer.innerHTML = '<p class="no-reports-message">Aún no hay reportes. ¡Anímate a reportar un incidente!</p>';
            return;
        }

        reports.forEach(report => {
            const reportCard = document.createElement('div');
            reportCard.classList.add('report-card');

            const statusClass = 'active-status';
            const statusText = 'Activo';

            reportCard.innerHTML = `
                <div class="report-card-header">
                    <span class="report-incident-type">${report.tipoIncidente}</span>
                    <span class="report-status ${statusClass}">${statusText}</span>
                </div>
                <div class="report-card-body">
                    <p class="report-location"><i class="fas fa-map-marker-alt"></i> ${report.ubicacion}</p>
                    <p class="report-date-time">
                        <span class="report-date"><i class="fas fa-calendar-alt"></i> ${report.fecha}</span>
                        <span class="report-time"><i class="fas fa-clock"></i> ${report.hora}</span>
                    </p>
                    <p class="report-description">${report.descripcion}</p>
                </div>
                <div class="report-card-actions">
                    <button class="btn delete-report-btn" data-id="${report.id}"><i class="fas fa-trash-alt"></i></button>
                    <button class="btn view-details-btn">Ver Detalles</button>
                </div>
            `;
            reportsContainer.appendChild(reportCard);
        });

        // Añadir event listeners a los botones de eliminar después de cargarlos
        document.querySelectorAll('.delete-report-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const reportId = parseInt(event.currentTarget.dataset.id); // Obtener el ID del botón
                console.log("Intento de eliminar reporte con ID:", reportId); // Para depuración
                // Mostrar el modal de confirmación
                showCustomModal(
                    "¿Estás seguro de querer eliminar este reporte?",
                    "confirm",
                    (confirmed) => {
                        if (confirmed) {
                            deleteReport(reportId); // Si confirma, llamar a la función de eliminación
                            showCustomModal("Reporte eliminado correctamente.", "alert");
                        } else {
                            showCustomModal("Eliminación de reporte cancelada.", "alert");
                        }
                    }
                );
            });
        });
    }

    // Envío del Formulario de Reporte (simulado)
    if (incidentReportForm) {
        incidentReportForm.addEventListener("submit", (event) => {
            event.preventDefault();

            let reportIsValid = true;
            let tipoIncidente = null;
            // Limpiar errores previos
            if (incidentTypeError) incidentTypeError.textContent = "";
            if (ubicacionError) ubicacionError.textContent = "";
            if (fechaError) fechaError.textContent = "";
            if (horaError) horaError.textContent = "";
            if (descripcionError) descripcionError.textContent = "";

            const selectedIncidentTypeBtn = document.querySelector('.btn-incident-type.selected');
            if (selectedIncidentTypeBtn) {
                tipoIncidente = selectedIncidentTypeBtn.textContent.trim();
            } else {
                if (incidentTypeError) incidentTypeError.textContent = "Selecciona un tipo de incidente.";
                reportIsValid = false;
            }
            if (!ubicacionInput || ubicacionInput.value.trim() === "") {
                if (ubicacionError) ubicacionError.textContent = "Ingresa la ubicación.";
                reportIsValid = false;
            }
            if (!fechaInput || fechaInput.value.trim() === "") {
                if (fechaError) fechaError.textContent = "Selecciona la fecha.";
                reportIsValid = false;
            }
            if (!horaInput || horaInput.value.trim() === "") {
                if (horaError) horaError.textContent = "Selecciona la hora.";
                reportIsValid = false;
            }
            if (!descripcionTextarea || descripcionTextarea.value.trim() === "") {
                if (descripcionError) descripcionError.textContent = "Describe el incidente.";
                reportIsValid = false;
            }

            if (!reportIsValid) {
                showCustomModal("Por favor, rellena todos los campos requeridos correctamente.", "alert");
                return;
            }

            const reportData = {
                tipoIncidente: tipoIncidente,
                ubicacion: ubicacionInput.value.trim(),
                fecha: fechaInput.value.trim(),
                hora: horaInput.value.trim(),
                descripcion: descripcionTextarea.value.trim(),
                id: Date.now() // Un ID simple basado en la marca de tiempo
            };

            console.log("Datos del reporte a enviar:", reportData);

            reportIncidentModal.style.display = 'none';
            document.body.style.overflow = "auto";
            const summaryIncidentTypeDisplay = document.getElementById("summaryIncidentTypeDisplay");
            const summaryDateDisplay = document.getElementById("summaryDateDisplay");
            const summaryTimeDisplay = document.getElementById("summaryTimeDisplay");
            const summaryLocationDisplay = document.getElementById("summaryLocationDisplay");
            const summaryDescriptionDisplay = document.getElementById("summaryDescriptionDisplay");

            if (summaryIncidentTypeDisplay) summaryIncidentTypeDisplay.textContent = reportData.tipoIncidente;
            if (summaryDateDisplay) summaryDateDisplay.textContent = reportData.fecha;
            if (summaryTimeDisplay) summaryTimeDisplay.textContent = reportData.hora;
            if (summaryLocationDisplay) summaryLocationDisplay.textContent = reportData.ubicacion;
            if (summaryDescriptionDisplay) summaryDescriptionDisplay.textContent = reportData.descripcion;

            showCustomModal(
                "",
                "reportSummary",
                (confirmed) => {
                    if (confirmed) {
                        saveReport(reportData);
                        console.log("Reporte enviado y guardado:", reportData); 
                        showCustomModal("¡Reporte enviado correctamente!", "alert", () => {
                            resetReportModal();
                            // Aquí podrías recargar la sección de reportes si quieres que aparezca inmediatamente
                            // showSection('reports');
                        });
                    } else {
                        showCustomModal("Envío de reporte cancelado.", "alert", () => {
                             reportIncidentModal.style.display = 'flex';
                             document.body.style.overflow = "hidden";
                        });
                    }
                },
                reportData
            );
        });
    }
});