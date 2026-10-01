import { auth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from './firebase-config.js';

export const initAuth = (onLoginCallback) => {
    const btnLogin = document.getElementById('btn-login');
    const btnGoogle = document.getElementById('btn-google');
    const btnLogout = document.getElementById('nav-logout');
    
    // UI Elements
    const authView = document.getElementById('auth-view');
    const mainNav = document.getElementById('main-nav');
    const homeView = document.getElementById('home-view');

    const showApp = (user) => {
        authView.classList.remove('active');
        mainNav.classList.remove('hidden');
        homeView.classList.add('active');
        onLoginCallback(user);
    };

    const showLogin = () => {
        authView.classList.add('active');
        mainNav.classList.add('hidden');
        document.querySelectorAll('.view').forEach(v => {
            if(v.id !== 'auth-view') v.classList.remove('active');
        });
    };

    onAuthStateChanged(auth, (user) => {
        if (user) {
            showApp(user);
        } else {
            showLogin();
        }
    });

    btnLogin.addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        try {
            await signInWithEmailAndPassword(auth, email, pass);
        } catch (error) {
            alert("Error al iniciar sesión: " + error.message);
        }
    });

    btnGoogle.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            alert("Error con Google: " + error.message);
        }
    });

    btnLogout.addEventListener('click', async () => {
        await signOut(auth);
    });
};
