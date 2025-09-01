// ====== REGISTER ======
var formRegistro = document.getElementById("formRegistro");
if (formRegistro) {
    var nombre = document.getElementById("nombreCompleto");
    var email = document.getElementById("email");
    var telefono = document.getElementById("telefono");
    var usuario = document.getElementById("usuario");
    var password = document.getElementById("password");
    var password2 = document.getElementById("password2");
    var togglePwd = document.getElementById("togglePwd");
    var pwdStrength = document.getElementById("pwdStrength");

    // errores
    var errNombre = document.getElementById("err-nombre");
    var errEmail = document.getElementById("err-email");
    var errTelefono = document.getElementById("err-telefono");
    var errUsuario = document.getElementById("err-usuario");
    var errPassword = document.getElementById("err-password");
    var errPassword2 = document.getElementById("err-password2");
    var errGenero = document.getElementById("err-genero");

    function limpiarErrores() {
        if (errNombre) errNombre.textContent = "";
        if (errEmail) errEmail.textContent = "";
        if (errTelefono) errTelefono.textContent = "";
        if (errUsuario) errUsuario.textContent = "";
        if (errPassword) errPassword.textContent = "";
        if (errPassword2) errPassword2.textContent = "";
        if (errGenero) errGenero.textContent = "";
    }

    function validaNombre() {
        var v = (nombre.value || "").trim();
        var soloLetras = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/;
        if (!v) { errNombre.textContent = "El nombre es obligatorio."; return false; }
        if (v.length > 100) { errNombre.textContent = "Máximo 100 caracteres."; return false; }
        if (!soloLetras.test(v)) { errNombre.textContent = "Solo letras y espacios."; return false; }
        errNombre.textContent = "";
        return true;
    }

    function validaEmail() {
        var v = (email.value || "").trim();
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!re.test(v)) {
            errEmail.textContent = "Ingresa un correo válido.";
            return false;
        }
        errEmail.textContent = "";
        return true;
    }

    function validaTelefono() {
        var v = (telefono.value || "").trim();
        if (!v) { errTelefono.textContent = ""; return true; } // opcional
        var re = /^\+?\d{7,15}$/;
        if (!re.test(v)) {
            errTelefono.textContent = "Teléfono inválido. Usa +569########.";
            return false;
        }
        errTelefono.textContent = "";
        return true;
    }

    function validaUsuario() {
        var v = (usuario.value || "").trim();
        var re = /^[a-zA-Z0-9_.-]{3,20}$/;
        if (!v) { errUsuario.textContent = "El usuario es obligatorio."; return false; }
        if (!re.test(v)) { errUsuario.textContent = "3–20: letras, números, _ . -"; return false; }
        errUsuario.textContent = "";
        return true;
    }

    function scorePassword(v) {
        var s = 0;
        if (v.length >= 8) s++;
        if (/[a-z]/.test(v)) s++;
        if (/[A-Z]/.test(v)) s++;
        if (/\d/.test(v)) s++;
        if (/[^A-Za-z0-9]/.test(v)) s++;
        if (s > 4) s = 4;
        return s;
    }

    function validaPassword() {
        var v = password.value || "";
        // regla simple
        var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/;
        if (!re.test(v)) {
            errPassword.textContent = "Debe tener 8+, mayúscula, minúscula, número y símbolo.";
            if (pwdStrength) pwdStrength.value = scorePassword(v);
            return false;
        }
        errPassword.textContent = "";
        if (pwdStrength) pwdStrength.value = scorePassword(v);
        return true;
    }

    function validaPassword2() {
        if ((password2.value || "") !== (password.value || "")) {
            errPassword2.textContent = "Las contraseñas no coinciden.";
            return false;
        }
        errPassword2.textContent = "";
        return true;
    }

    function validaGenero() {
        var radios = document.getElementsByName("genero");
        var escogido = false;
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) { escogido = true; break; }
        }
        if (!escogido) {
            if (errGenero) errGenero.textContent = "Selecciona tu género favorito.";
            return false;
        }
        if (errGenero) errGenero.textContent = "";
        return true;
    }

    // eventos sencillos (en tiempo real)
    nombre.addEventListener("input", validaNombre);
    email.addEventListener("input", validaEmail);
    telefono.addEventListener("input", validaTelefono);
    usuario.addEventListener("input", validaUsuario);
    password.addEventListener("input", validaPassword);
    password2.addEventListener("input", validaPassword2);

    if (togglePwd) {
        togglePwd.addEventListener("click", function () {
            if (password.type === "password") {
                password.type = "text";
                togglePwd.textContent = "Ocultar";
            } else {
                password.type = "password";
                togglePwd.textContent = "Mostrar";
            }
        });
    }

    formRegistro.addEventListener("submit", function (e) {
        e.preventDefault();
        limpiarErrores();

        var ok1 = validaNombre();
        var ok2 = validaEmail();
        var ok3 = validaTelefono();
        var ok4 = validaUsuario();
        var ok5 = validaPassword();
        var ok6 = validaPassword2();
        var ok7 = validaGenero();

        if (!(ok1 && ok2 && ok3 && ok4 && ok5 && ok6 && ok7)) return;

        // Guardar usuario en localStorage (DEMO)
        var users = [];
        try {
            users = JSON.parse(localStorage.getItem("gz_users") || "[]");
        } catch (e) { users = []; }

        var generoSel = "";
        var radios = document.getElementsByName("genero");
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) { generoSel = radios[i].value; break; }
        }

        var nuevo = {
            nombre: (nombre.value || "").trim(),
            email: (email.value || "").trim().toLowerCase(),
            telefono: (telefono.value || "").trim(),
            usuario: (usuario.value || "").trim(),
            genero: generoSel,
            password: password.value // no hacer esto en producción
        };

        // Chequeo simple de duplicados
        for (var j = 0; j < users.length; j++) {
            if (users[j].email === nuevo.email) {
                errEmail.textContent = "Este correo ya está registrado.";
                return;
            }
            if ((users[j].usuario || "").toLowerCase() === nuevo.usuario.toLowerCase()) {
                errUsuario.textContent = "Este usuario ya existe. Elige otro.";
                return;
            }
        }

        users.push(nuevo);
        localStorage.setItem("gz_users", JSON.stringify(users));

        // Mensaje para login
        sessionStorage.setItem("gz_feedback", "Registro exitoso. Ahora puedes iniciar sesión.");

        // Redirigir a Login (usa el nombre exacto de tu archivo)
        window.location.href = "./Login.html";
    });
}

// ====== LOGIN ======
var formLogin = document.getElementById("formLogin");
if (formLogin) {
    var identificador = document.getElementById("identificador");
    var loginPassword = document.getElementById("loginPassword");
    var loginFeedback = document.getElementById("loginFeedback");

    var errIdentificador = document.getElementById("err-identificador");
    var errLoginPassword = document.getElementById("err-loginPassword");

    // Mostrar mensaje si viene del registro
    var fbMsg = sessionStorage.getItem("gz_feedback");
    if (fbMsg && loginFeedback) {
        loginFeedback.textContent = fbMsg;
        sessionStorage.removeItem("gz_feedback");
    }

    formLogin.addEventListener("submit", function (e) {
        e.preventDefault();
        if (errIdentificador) errIdentificador.textContent = "";
        if (errLoginPassword) errLoginPassword.textContent = "";
        if (loginFeedback) loginFeedback.textContent = "";

        var id = (identificador.value || "").trim();
        var pwd = loginPassword.value || "";

        if (!id) { if (errIdentificador) errIdentificador.textContent = "Campo obligatorio."; return; }
        if (!pwd) { if (errLoginPassword) errLoginPassword.textContent = "Ingresa tu contraseña."; return; }

        var users = [];
        try {
            users = JSON.parse(localStorage.getItem("gz_users") || "[]");
        } catch (e) { users = []; }

        var i, user = null;
        var needle = id.toLowerCase();

        for (i = 0; i < users.length; i++) {
            var u = users[i];
            if (u.email === needle || (u.usuario || "").toLowerCase() === needle) {
                user = u; break;
            }
        }

        if (!user) {
            if (loginFeedback) loginFeedback.textContent = "No encontramos una cuenta con ese correo/usuario.";
            return;
        }
        if (user.password !== pwd) {
            if (loginFeedback) loginFeedback.textContent = "Contraseña incorrecta.";
            return;
        }

        // “Sesión” de mentira
        localStorage.setItem("gz_current", JSON.stringify({
            usuario: user.usuario,
            email: user.email,
            nombre: user.nombre,
            loginAt: new Date().toISOString()
        }));

        if (loginFeedback) loginFeedback.textContent = "Ingreso exitoso. ¡Bienvenido/a, " + (user.nombre.split(" ")[0] || "gamer") + "!";
        // Si quieres ir al inicio:
        // window.location.href = "./Index.html";
    });
}
