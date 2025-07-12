// utils.js (CORREGIDO)
// Funciones de utilidad
function showCustomModal(message, type = "alert", onConfirm = null, reportData = null) { // Agrega reportData
    const modal = document.getElementById("customModal");
    const modalMessage = document.getElementById("modalMessage");
    const modalConfirmBtn = document.getElementById("modalConfirmBtn"); // Botón de "Confirmar" / "Enviar Reporte"
    const modalCancelBtn = document.getElementById("modalCancelBtn");   // Botón de "Cancelar"
    const modalOkBtn = document.getElementById("modalOkBtn");           // Botón de "OK" (para alertas)
    const closeButton = document.getElementById("closeCustomModalBtn"); // Botón de cierre 'X'

    // Nuevas referencias a los elementos donde se mostrará el resumen del reporte
    const reportSummaryContent = document.getElementById('reportSummaryContent');
    const summaryIncidentTypeDisplay = document.getElementById('summaryIncidentTypeDisplay');
    const summaryLocationDisplay = document.getElementById('summaryLocationDisplay');
    const summaryDateDisplay = document.getElementById('summaryDateDisplay');
    const summaryTimeDisplay = document.getElementById('summaryTimeDisplay');
    const summaryDescriptionDisplay = document.getElementById('summaryDescriptionDisplay');

    // Verificación simplificada de elementos esenciales
    if (!modal || !modalMessage || !modalOkBtn) {
        console.error("Elementos esenciales del modal (customModal, modalMessage, modalOkBtn) no encontrados.");
        return;
    }

    // Limpiar mensaje anterior y ocultar todos los contenidos de resumen por defecto
    modalMessage.textContent = message;
    if (reportSummaryContent) reportSummaryContent.style.display = 'none';

    // Ocultar todos los botones inicialmente y limpiar listeners
    [modalConfirmBtn, modalCancelBtn, modalOkBtn, closeButton].forEach(btn => {
        if (btn) {
            btn.style.display = "none";
            btn.onclick = null; // Limpiar listeners
        }
    });

    if (type === "confirm" && onConfirm) {
        modalMessage.textContent = message; // El mensaje es el texto de la pregunta de confirmación
        if (modalConfirmBtn && modalCancelBtn) {
            modalConfirmBtn.textContent = 'Confirmar'; // Asegurar el texto por defecto
            modalCancelBtn.textContent = 'Cancelar'; // Asegurar el texto por defecto
            modalConfirmBtn.style.display = "inline-block";
            modalCancelBtn.style.display = "inline-block";

            modalConfirmBtn.onclick = () => {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
                onConfirm(true);
            };
            modalCancelBtn.onclick = () => {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
                onConfirm(false);
            };
        }
    } else if (type === "alert") {
        modalMessage.textContent = message; // El mensaje es el texto de la alerta
        if (modalOkBtn) {
            modalOkBtn.style.display = "inline-block";
            modalOkBtn.onclick = () => {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
                if (onConfirm) onConfirm(); // En alertas, onConfirm es el callback sin parámetros
            };
        }
    } else if (type === "reportSummary" && reportData) { // NUEVO TIPO: resumen del reporte
        modalMessage.textContent = "Reporte"; // Título del modal para el resumen

        if (reportSummaryContent) reportSummaryContent.style.display = 'block'; // Mostrar el contenedor del resumen

        // Rellenar los datos en los elementos del resumen (redundante con reports.js, pero seguro)
        if (summaryIncidentTypeDisplay) summaryIncidentTypeDisplay.textContent = reportData.tipoIncidente || 'N/A';
        if (summaryLocationDisplay) summaryLocationDisplay.textContent = reportData.ubicacion || 'N/A';
        if (summaryDateDisplay) summaryDateDisplay.textContent = reportData.fecha || 'N/A';
        if (summaryTimeDisplay) summaryTimeDisplay.textContent = reportData.hora || 'N/A';
        if (summaryDescriptionDisplay) summaryDescriptionDisplay.textContent = reportData.descripcion || 'N/A';
        
        // Mostrar los botones "Cancelar" y "Enviar Reporte"
        if (modalConfirmBtn && modalCancelBtn) {
            modalConfirmBtn.textContent = 'Enviar Reporte'; // Cambiar texto del botón
            modalCancelBtn.textContent = 'Cancelar'; // Asegurar texto

            modalConfirmBtn.style.display = 'inline-block';
            modalCancelBtn.style.display = 'inline-block';

            modalConfirmBtn.onclick = () => {
                modal.style.display = 'none';
                document.body.style.overflow = "auto";
                if (onConfirm) onConfirm(true); // Callback para "Enviar Reporte"
            };
            modalCancelBtn.onclick = () => {
                modal.style.display = 'none';
                document.body.style.overflow = "auto";
                if (onConfirm) onConfirm(false); // Callback para "Cancelar"
            };
        }
    }

    // Manejar el cierre con el botón 'X'
    if (closeButton) {
        closeButton.onclick = () => {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
            // Si el modal era de confirmación o de resumen, se asume cancelación
            if ((type === "confirm" || type === "reportSummary") && onConfirm) {
                onConfirm(false);
            }
        };
    }

    modal.style.display = "flex"; // Usa 'flex' para centrado CSS (si tu CSS de .modal está configurado para ello)
    document.body.style.overflow = "hidden"; // Evitar scroll de fondo
}

// ... (tus otras funciones como validateEmail, validatePhoneNumber si las usas en utils.js) ...
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
}

function validatePhoneNumber(phone) {
    const re = /^\d{9}$/;
    return re.test(String(phone));
}