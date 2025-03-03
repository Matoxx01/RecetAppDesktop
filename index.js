import { loginUser, loginWithGoogle } from './database/firebase_config.js';

document.getElementById('minimize').addEventListener('click', () => {
    window.electron.minimize();
});

document.getElementById('max').addEventListener('click', () => {
    window.electron.max();
});

document.getElementById('close').addEventListener('click', () => {
    window.electron.close();
});

// Manejar Login
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const googleLoginButton = document.getElementById('google-login');
    console.log("window.electron:", window.electron);

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const mail = document.getElementById('mail').value;
            const password = document.getElementById('password').value;

            const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!mailRegex.test(mail)) {
                showFlashMessage('Por favor, introduce un email válido.', 'danger');
                return;
            }

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(password)) {
                showFlashMessage('La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.', 'danger');
                return;
            }

            const submitButton = loginForm.querySelector('button[type="submit"]');
            if (submitButton) submitButton.classList.add('loading');

            try {
                const user = await loginUser(mail, password); // Función de Firebase
                if (user) {
                    showFlashMessage('Login exitoso.', 'success');

                    // Guardar el estado de login en localStorage
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userName', user?.displayName || 'Usuario');
                    localStorage.setItem('uid', user?.uid || '');

                    // Limpia el formulario
                    loginForm.reset();

                    // Emitir evento de login exitoso
                    document.dispatchEvent(new Event('loginSuccessful'));

                    // Redirigir a /home.html después de 3 segundos
                    setTimeout(() => {
                        window.electron.home(); // 🔹 Llama a la función del preload
                    }, 3000);
                }
            } catch (error) {
                console.error('Error en el login:', error);
                showFlashMessage('Hubo un error al iniciar sesión. Por favor, inténtalo nuevamente.', 'danger');
            } finally {
                if (submitButton) submitButton.classList.remove('loading');
            }
        });
    }

    // Manejar login con Google
    if (googleLoginButton) {
        googleLoginButton.addEventListener('click', async () => {
            googleLoginButton.classList.add('loading');

            try {
                const result = await loginWithGoogle();
                if (result.success) {
                    showFlashMessage('Inicio de sesión con Google exitoso.', 'success');

                    document.dispatchEvent(new Event('loginSuccessful'));

                    setTimeout(() => {
                        window.location.href = '/home/home.html';
                        console.log('Redirigiendo a /home/home.html');
                    }, 3000);
                } else {
                    showFlashMessage(result.message, 'danger');
                }
            } catch (error) {
                console.error('Error al iniciar sesión con Google:', error);
                showFlashMessage('Hubo un problema con Google. Inténtalo de nuevo.', 'danger');
            } finally {
                googleLoginButton.classList.remove('loading');
            }
        });
    }
});

function showFlashMessage(message, category) {
    const flashContainer = document.getElementById('flash-messages');
    if (!flashContainer) {
        console.error('No se encontró el contenedor de mensajes flash.');
        return;
    }

    const flashMessage = document.createElement('div');
    flashMessage.className = `alert ${category}`;
    flashMessage.textContent = message;

    flashContainer.appendChild(flashMessage);

    setTimeout(() => {
        flashMessage.remove();
    }, 5000);
}
