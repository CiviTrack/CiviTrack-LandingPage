//main.js

document.addEventListener("DOMContentLoaded", () => {
    // Referencias a los elementos del modal de registro/login principal
    const registroSection = document.getElementById("registro");
    const registerFormStep1 = document.getElementById("register-form");
    const stepUniversidad = document.getElementById("step-universidad");
    const stepRol = document.getElementById("step-rol");

    // Función global para mostrar formularios de registro/login
    // Usamos 'window.' para que sea accesible globalmente desde el HTML (onclick="showForm('...')")
    if (registroSection) {
        window.showForm = function(formId) {
            const header = document.querySelector("header");
            const headerHeight = header ? header.getBoundingClientRect().height : 0;

            registroSection.style.top = headerHeight + "px";
            registroSection.style.height = `calc(100% - ${headerHeight}px)`;
            registroSection.style.display = "flex";

            document.querySelectorAll("#registro .form-box").forEach((box) => box.classList.remove("active"));
            const targetForm = document.getElementById(formId);
            if (targetForm) {
                targetForm.classList.add("active");
            }
            document.body.style.overflow = "hidden";
        };

        window.hideForm = function() {
            registroSection.style.display = "none";
            document.body.style.overflow = "auto";
            // Asegurarse de que al cerrar, el formulario de registro vuelve a su paso 1
            if (registerFormStep1) registerFormStep1.classList.add("active");
            if (stepUniversidad) stepUniversidad.classList.remove("active");
            if (stepRol) stepRol.classList.remove("active");
        };

        // Cerrar el formulario de registro/login al hacer clic en enlaces del menú
        document.querySelectorAll("header .navbar a, header .botton a").forEach((link) => {
            link.addEventListener("click", (e) => {
                // Solo cierra el formulario si el clic no es para abrir uno de los formularios
                if (e.currentTarget.getAttribute('onclick') === null || !e.currentTarget.getAttribute('onclick').includes('showForm')) {
                    window.hideForm();
                }
            });
        });
    }


    // --- Lógica del formulario de contacto ---
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        const nombresInput = document.getElementById("nombres");
        const apellidosInput = document.getElementById("apellidos");
        const tipoDocSelect = document.getElementById("tipoDoc");
        const telefonoInput = document.getElementById("telefono");
        const emailInput = document.getElementById("email");
        const mensajeTextarea = document.getElementById("mensaje");
        const rolRadios = document.querySelectorAll('input[name="rol"]');

        // Mapeo de inputs a sus elementos de error para simplificar
        const errorElements = {
            nombres: document.getElementById("nombresError"),
            apellidos: document.getElementById("apellidosError"),
            tipoDoc: document.getElementById("tipoDocError"),
            telefono: document.getElementById("telefonoError"),
            email: document.getElementById("emailError"),
            mensaje: document.getElementById("mensajeError"),
            rol: document.getElementById("rolError")
        };

        function displayError(field, message) {
            if (errorElements[field]) {
                errorElements[field].textContent = message;
            }
        }

        function clearContactFormErrors() {
            for (const key in errorElements) {
                if (errorElements[key]) {
                    errorElements[key].textContent = "";
                }
            }
        }

        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            clearContactFormErrors();
            let isValid = true;

            if (nombresInput && nombresInput.value.trim() === "") {
                displayError("nombres", "Por favor, ingrese su nombre.");
                isValid = false;
            }
            if (apellidosInput && apellidosInput.value.trim() === "") {
                displayError("apellidos", "Por favor, ingrese su apellido.");
                isValid = false;
            }
            if (tipoDocSelect && tipoDocSelect.value === "") {
                displayError("tipoDoc", "Por favor, seleccione un tipo de documento.");
                isValid = false;
            }
            if (telefonoInput) {
                if (telefonoInput.value.trim() === "") {
                    displayError("telefono", "Por favor, ingrese su teléfono.");
                    isValid = false;
                } else if (!validatePhoneNumber(telefonoInput.value.trim())) {
                    displayError("telefono", "Por favor, ingrese un teléfono válido de 9 dígitos (solo números).");
                    isValid = false;
                }
            }
            if (emailInput) {
                if (emailInput.value.trim() === "") {
                    displayError("email", "Por favor, ingrese su correo.");
                    isValid = false;
                } else if (!validateEmail(emailInput.value.trim())) {
                    displayError("email", "Por favor, ingrese un correo válido.");
                    isValid = false;
                }
            }
            if (mensajeTextarea && mensajeTextarea.value.trim() === "") {
                displayError("mensaje", "Completa este campo.");
                isValid = false;
            }
            if (rolRadios.length > 0 && !Array.from(rolRadios).some((radio) => radio.checked)) {
                displayError("rol", "Por favor, seleccione si es estudiante o conductor.");
                isValid = false;
            }

            if (!isValid) {
                showCustomModal("Por favor, complete todos los campos requeridos correctamente.", "alert");
                return;
            }

            showCustomModal(
                "Está a punto de enviar el formulario, ¿Desea continuar?",
                "confirm",
                (confirmed) => {
                    if (confirmed) {
                        showCustomModal("¡Mensaje enviado correctamente!", "alert", () => {
                            contactForm.reset();
                            clearContactFormErrors();
                        });
                    } else {
                        showCustomModal("Envío de mensaje cancelado.", "alert");
                    }
                }
            );
        });
    }

    // --- Lógica del formulario de registro multipaso ---
    const formRegistro = document.getElementById("formRegistro");
    if (formRegistro) {
        const regNombreInput = document.getElementById("regNombre");
        const regCorreoInput = document.getElementById("regCorreo");
        const regPasswordInput = document.getElementById("regPassword");
        const universidadSelect = document.getElementById("universidad");

        const regErrorElements = {
            regNombre: document.getElementById("nombreError"),
            regCorreo: document.getElementById("correoError"),
            regPassword: document.getElementById("passwordError"),
            universidad: document.getElementById("universidadError"), // Asumiendo que tienes un span para este error
            year: document.getElementById("yearError") // Asumiendo un span para este error
        };

        let selectedYear = "";
        let selectedRol = "";

        function displayRegError(field, message) {
            if (regErrorElements[field]) {
                regErrorElements[field].textContent = message;
            }
        }

        function clearRegistroErrors() {
            for (const key in regErrorElements) {
                if (regErrorElements[key]) {
                    regErrorElements[key].textContent = "";
                }
            }
        }

        // Paso 1: Validar datos iniciales
        formRegistro.addEventListener("submit", (e) => {
            e.preventDefault();
            clearRegistroErrors();
            let valido = true;

            if (regNombreInput.value.trim() === "") {
                displayRegError("regNombre", "Por favor, ingresa tu nombre.");
                valido = false;
            }
            if (regCorreoInput.value.trim() === "") {
                displayRegError("regCorreo", "Por favor, ingresa tu correo.");
                valido = false;
            } else if (!validateEmail(regCorreoInput.value.trim())) {
                displayRegError("regCorreo", "El correo no tiene un formato válido.");
                valido = false;
            }
            if (regPasswordInput.value.trim() === "") {
                displayRegError("regPassword", "Por favor, ingresa una contraseña.");
                valido = false;
            } else if (regPasswordInput.value.trim().length < 6) {
                displayRegError("regPassword", "La contraseña debe tener al menos 6 caracteres.");
                valido = false;
            }

            if (valido) {
                if (registerFormStep1) registerFormStep1.classList.remove("active");
                if (stepUniversidad) stepUniversidad.classList.add("active");
            } else {
                showCustomModal("Por favor, complete los campos de registro correctamente.", "alert");
            }
        });

        // Paso 2: Seleccionar Año (botón)
        document.querySelectorAll(".year-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".year-btn").forEach((b) => b.classList.remove("selected"));
                btn.classList.add("selected");
                selectedYear = btn.textContent.trim();
                displayRegError("year", ""); // Limpiar error al seleccionar
            });
        });

        // Botón "Siguiente" para ir a selección de Rol (Desde Paso 2)
        const btnToRol = document.getElementById("btnToRol");
        if (btnToRol) {
            btnToRol.addEventListener("click", () => {
                clearRegistroErrors(); // Limpiar errores antes de validar este paso
                let paso2Valido = true;

                if (!universidadSelect || universidadSelect.value.trim() === "") {
                    displayRegError("universidad", "Por favor, selecciona tu universidad.");
                    paso2Valido = false;
                }
                if (selectedYear === "") {
                    displayRegError("year", "Por favor, selecciona el año.");
                    paso2Valido = false;
                }

                if (paso2Valido) {
                    if (stepUniversidad) stepUniversidad.classList.remove("active");
                    if (stepRol) stepRol.classList.add("active");
                } else {
                    showCustomModal("Por favor, selecciona tu universidad y el año antes de continuar.", "alert");
                }
            });
        }

        // Paso 3: Selección de Rol y Finalización
        document.querySelectorAll(".rol-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                selectedRol = btn.dataset.rol;

                showCustomModal(
                    "Registro exitoso. ¡Bienvenido a CiviTrack!",
                    "alert",
                    () => {
                        window.hideForm(); // Esto ya reinicia los pasos y limpia el scroll
                        window.location.href = "reportes.html"; // Redirigir
                        formRegistro.reset(); // Asegurarse de resetear el formulario
                        clearRegistroErrors(); // Limpiar errores
                        selectedYear = ""; // Resetear variables de estado
                        selectedRol = "";
                        if (universidadSelect) universidadSelect.value = ""; // Resetear select de universidad

                        console.log("Datos de Registro Finales (antes de redirigir):", {
                            nombre: regNombreInput ? regNombreInput.value.trim() : 'N/A',
                            correo: regCorreoInput ? regCorreoInput.value.trim() : 'N/A',
                            universidad: universidadSelect ? universidadSelect.value.trim() : 'N/A',
                            year: selectedYear,
                            rol: selectedRol
                        });
                    }
                );
            });
        });
    }

    // --- Lógica del formulario de Login ---
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        const loginCorreoInput = document.getElementById("loginCorreo");
        const loginPasswordInput = document.getElementById("loginPassword");

        const loginCorreoError = document.getElementById("loginCorreoError");
        const loginPasswordError = document.getElementById("loginPasswordError");

        function clearLoginErrors() {
            if (loginCorreoError) loginCorreoError.textContent = "";
            if (loginPasswordError) loginPasswordError.textContent = "";
        }

        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            clearLoginErrors();

            let isValid = true;

            if (loginCorreoInput.value.trim() === "") {
                if (loginCorreoError) loginCorreoError.textContent = "Por favor, ingrese su correo.";
                isValid = false;
            } else if (!validateEmail(loginCorreoInput.value.trim())) {
                if (loginCorreoError) loginCorreoError.textContent = "Ingrese un correo válido.";
                isValid = false;
            }

            if (loginPasswordInput.value.trim() === "") {
                if (loginPasswordError) loginPasswordError.textContent = "Ingrese su contraseña.";
                isValid = false;
            }

            if (!isValid) {
                showCustomModal("Por favor, complete sus credenciales correctamente para iniciar sesión.", "alert");
                return;
            }

            showCustomModal("¡Inicio de sesión exitoso!", "alert", () => {
                loginForm.reset();
                clearLoginErrors();
                window.hideForm();
            });
        });
    }
});