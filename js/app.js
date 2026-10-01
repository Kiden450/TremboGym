import { initAuth } from './auth.js';
import { seedData } from './seed.js';
import { initWorkoutDay } from './workout.js';

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    initAuth((user) => {
        currentUser = user;
        initWorkoutDay(user);
    });

    // Seed Data Button (Temporal)
    document.getElementById('btn-seed').addEventListener('click', async () => {
        if (currentUser) {
            await seedData(currentUser.uid);
            // Refresh
            initWorkoutDay(currentUser);
        }
    });

    // Navigation Logic
    const navButtons = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view');

    navButtons.forEach(btn => {
        if(btn.id === 'nav-logout') return;
        
        btn.addEventListener('click', (e) => {
            // Update Active Nav
            navButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Hide all views except auth
            views.forEach(v => {
                if (v.id !== 'auth-view') v.classList.add('hidden');
                v.classList.remove('active');
            });

            // Show selected view
            if (e.target.id === 'nav-home') {
                document.getElementById('home-view').classList.remove('hidden');
                document.getElementById('home-view').classList.add('active');
                initWorkoutDay(currentUser);
            } else if (e.target.id === 'nav-edit') {
                document.getElementById('edit-view').classList.remove('hidden');
                document.getElementById('edit-view').classList.add('active');
            } else if (e.target.id === 'nav-stats') {
                document.getElementById('stats-view').classList.remove('hidden');
                document.getElementById('stats-view').classList.add('active');
                renderMockChart(); // Placeholder for chart
            }
        });
    });

    // Extended View logic
    const modal = document.getElementById('extended-view-modal');
    document.getElementById('btn-extended-view').addEventListener('click', () => {
        modal.classList.remove('hidden');
        // A full implementation would render the list of currentRoutine.exercises here
        // allowing the user to click and skip exercises.
    });

    document.getElementById('btn-close-extended').addEventListener('click', () => {
        modal.classList.add('hidden');
    });
});

function renderMockChart() {
    const ctx = document.getElementById('progressChart');
    if(ctx.chartInstance) return; // already rendered
    
    ctx.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            datasets: [{
                label: 'Press Banca (Kg)',
                data: [80, 82.5, 82.5, 85],
                borderColor: '#3b82f6',
                tension: 0.3,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#f8fafc' } }
            },
            scales: {
                x: { ticks: { color: '#94a3b8' } },
                y: { ticks: { color: '#94a3b8' } }
            }
        }
    });
}
