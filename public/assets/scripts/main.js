// Función para mostrar un modal personalizado
function showCustomModal(message, type = "alert", onConfirm = null) {
  const modal = document.getElementById("customModal");
  const modalMessage = document.getElementById("modalMessage");
  const modalConfirmBtn = document.getElementById("modalConfirmBtn");
  const modalCancelBtn = document.getElementById("modalCancelBtn");
  const modalOkBtn = document.getElementById("modalOkBtn");
  const closeButton = modal.querySelector(".close-button");
  modalMessage.textContent = message;

  // Reiniciar la visualización de los botones
  modalConfirmBtn.style.display = "none";
  modalCancelBtn.style.display = "none";
  modalOkBtn.style.display = "none";

  modalConfirmBtn.onclick = null;
  modalCancelBtn.onclick = null;
  modalOkBtn.onclick = null;
  closeButton.onclick = null;

  if (type === "confirm" && onConfirm) {
    modalConfirmBtn.style.display = "inline-block";
    modalCancelBtn.style.display = "inline-block";

    modalConfirmBtn.onclick = () => {
      modal.style.display = "none";
      onConfirm(true);
    };
    modalCancelBtn.onclick = () => {
      modal.style.display = "none";
      onConfirm(false);
    };
  } else {
    modalOkBtn.style.display = "inline-block";
    modalOkBtn.onclick = () => {
      modal.style.display = "none";
      if (onConfirm) onConfirm();
    };
  }

  closeButton.onclick = () => {
    modal.style.display = "none";
    if (type === "confirm" && onConfirm) onConfirm(false);
  };

  modal.style.display = "flex";
}

// Función para validar el formato de email
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(String(email).toLowerCase());
}

// Función para validar número de teléfono (solo 9 dígitos)
function validatePhoneNumber(phone) {
  const re = /^\d{9}$/; // Acepta exactamente 9 dígitos (0-9)
  return re.test(String(phone));
}

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const nombresInput = document.getElementById("nombres");
  const apellidosInput = document.getElementById("apellidos");
  const tipoDocSelect = document.getElementById("tipoDoc");
  const telefonoInput = document.getElementById("telefono");
  const emailInput = document.getElementById("email");
  const mensajeTextarea = document.getElementById("mensaje");
  const rolRadios = document.querySelectorAll('input[name="rol"]');

  const nombresError = document.getElementById("nombresError"); // Este span no se usará para errores de nombres
  const apellidosError = document.getElementById("apellidosError"); // Este span no se usará para errores de apellidos
  const tipoDocError = document.getElementById("tipoDocError");
  const telefonoError = document.getElementById("telefonoError");
  const emailError = document.getElementById("emailError"); // Este span no se usará para errores de email
  const mensajeError = document.getElementById("mensajeError");
  const rolError = document.getElementById("rolError");

  // Función para limpiar SÓLO los mensajes de error personalizados (los nativos son manejados por el navegador)
  function clearCustomErrors() {
    tipoDocError.textContent = "";
    telefonoError.textContent = "";
    mensajeError.textContent = "";
    rolError.textContent = "";
  }

  contactForm.addEventListener("submit", (event) => {
    clearCustomErrors();
    let customValidationIsValid = true;

    // Validar Tipo de Documento
    if (tipoDocSelect.value === "") {
      tipoDocError.textContent = "Por favor, seleccione un tipo de documento.";
      customValidationIsValid = false;
    }

    // Validar Teléfono (obligatorio y con 9 dígitos)
    if (telefonoInput.value.trim() === "") {
      telefonoError.textContent = "Por favor, ingrese su teléfono.";
      customValidationIsValid = false;
    } else if (!validatePhoneNumber(telefonoInput.value.trim())) {
      telefonoError.textContent =
        "Por favor, ingrese un teléfono válido de 9 dígitos (solo números).";
      customValidationIsValid = false;
    }

    // Validar Mensaje
    if (mensajeTextarea.value.trim() === "") {
      mensajeError.textContent = "Completa este campo.";
      customValidationIsValid = false;
    }

    // Validar Rol (Estudiante o Conductor)
    if (!Array.from(rolRadios).some((radio) => radio.checked)) {
      rolError.textContent =
        "Por favor, seleccione si es estudiante o conductor.";
      customValidationIsValid = false;
    }

    if (!contactForm.checkValidity()) {
      event.preventDefault();
    } else if (!customValidationIsValid) {
      event.preventDefault(); // Prevenir el envío
      showCustomModal(
        "Por favor, complete todos los campos requeridos correctamente.",
        "alert"
      );
    } else {
      event.preventDefault(); // Prevenir el envío por defecto para manejar la confirmación
      showCustomModal(
        "Está a punto de enviar el formulario, ¿Desea continuar?",
        "confirm",
        (confirmed) => {
          if (confirmed) {
            showCustomModal("¡Mensaje enviado correctamente!", "alert", () => {
              contactForm.reset(); // Reiniciar el formulario después del envío exitoso
              clearCustomErrors();
            });
          } else {
            showCustomModal("Envío de mensaje cancelado.", "alert");
          }
        }
      );
    }
  });
});

function showForm(formId) {
  const header = document.querySelector("nav"); // o tu selector real de la barra
  const headerHeight = header ? header.getBoundingClientRect().height : 0;

  const registro = document.getElementById("registro");
  registro.style.top = headerHeight + "px";
  registro.style.height = `calc(100% - ${headerHeight}px)`;

  registro.style.display = "flex";

  document
    .querySelectorAll(".form-box")
    .forEach((box) => box.classList.remove("active"));
  document.getElementById(formId).classList.add("active");
  document.body.style.overflow = "hidden";
}

function hideForm() {
  const registro = document.getElementById("registro");
  registro.style.display = "none";
  document.body.style.overflow = "auto";
}
document.addEventListener("DOMContentLoaded", () => {
  // Registrar el evento para ocultar el modal cuando se hace clic en enlaces del menú
  document.querySelectorAll("header .navbar a").forEach((link) => {
    link.addEventListener("click", () => {
      hideForm();
    });
  });
});
