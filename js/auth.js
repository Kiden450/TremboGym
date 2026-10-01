import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from './firebase-config.js';

export const initAuth = (onLoginCallback) => {
    const btnLogin = document.getElementById('btn-login');
    const btnRegister = document.getElementById('btn-register');
    const btnLogout = document.getElementById('nav-logout');
    
    // UI Elements
    const authView = document.getElementById('auth-view');
    const mainNav = document.getElementById('main-nav');
    const homeView = document.getElementById('home-view');

    const showApp = (user) => {
        authView.classList.add('hidden');
        authView.classList.remove('active');
        mainNav.classList.remove('hidden');
        homeView.classList.remove('hidden');
        homeView.classList.add('active');
        onLoginCallback(user);
    };

    const showLogin = () => {
        authView.classList.remove('hidden');
        authView.classList.add('active');
        mainNav.classList.add('hidden');
        document.querySelectorAll('.view').forEach(v => {
            if(v.id !== 'auth-view') {
                v.classList.remove('active');
                v.classList.add('hidden');
            }
        });
    };

    onAuthStateChanged(auth, (user) => {
        if (user) {
            showApp(user);
        } else {
            showLogin();
        }
    });

    btnLogin.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log("Botón Iniciar Sesión clickeado");
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        
        if (!email || !pass) {
            alert("Por favor, introduce correo y contraseña.");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, pass);
            console.log("Inicio de sesión exitoso");
        } catch (error) {
            console.error("Error Login:", error);
            alert("Error al iniciar sesión: " + error.message);
        }
    });

    btnRegister.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log("Botón Registrarse clickeado");
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        
        if (!email || !pass) {
            alert("Por favor, introduce correo y contraseña para registrarte.");
            return;
        }

        try {
            console.log("Intentando crear usuario en Firebase...");
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            console.log("Registro exitoso, usuario creado:", userCredential.user.uid);
            alert("¡Cuenta creada con éxito! Iniciando sesión...");
        } catch (error) {
            console.error("Error Registro:", error);
            // Manejo de errores específicos comunes de Firebase
            let msg = error.message;
            if (error.code === 'auth/email-already-in-use') msg = "Este correo ya está registrado.";
            if (error.code === 'auth/weak-password') msg = "La contraseña debe tener al menos 6 caracteres.";
            if (error.code === 'auth/invalid-email') msg = "El formato del correo es inválido.";
            
            alert("Error al registrarse:\n" + msg);
        }
    });

    btnLogout.addEventListener('click', async (e) => {
        e.preventDefault();
        await signOut(auth);
    });
};
