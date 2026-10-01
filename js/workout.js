import { db, doc, getDoc, collection, setDoc, updateDoc } from './firebase-config.js';

let currentUser = null;
let currentRoutine = null;
let currentExerciseIndex = 0;
let startTime = null;
let timerInterval = null;

const dayMap = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export const initWorkoutDay = async (user) => {
    currentUser = user;
    const todayStr = dayMap[new Date().getDay()];
    
    // Fetch today's routine
    const routineRef = doc(db, `users/${user.uid}/routines`, todayStr);
    const routineSnap = await getDoc(routineRef);
    
    const titleEl = document.getElementById('today-title');
    const startContainer = document.getElementById('start-workout-container');
    const btnStart = document.getElementById('btn-start-workout');
    const noWorkoutMsg = document.getElementById('no-workout-msg');
    
    if (routineSnap.exists()) {
        currentRoutine = routineSnap.data();
        titleEl.textContent = `Hoy: ${currentRoutine.planName}`;
        startContainer.classList.remove('hidden');
        btnStart.classList.remove('hidden');
        noWorkoutMsg.classList.add('hidden');
    } else {
        titleEl.textContent = "Día de Descanso";
        startContainer.classList.remove('hidden');
        btnStart.classList.add('hidden');
        noWorkoutMsg.classList.remove('hidden');
    }

    btnStart.onclick = startWorkout;
};

const startWorkout = () => {
    document.getElementById('start-workout-container').classList.add('hidden');
    document.getElementById('active-workout-container').classList.remove('hidden');
    startTime = Date.now();
    
    // Timer
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const s = String(elapsed % 60).padStart(2, '0');
        document.getElementById('timer').textContent = `${m}:${s}`;
    }, 1000);

    currentExerciseIndex = 0;
    renderExercise();
};

const renderExercise = async () => {
    if (currentExerciseIndex >= currentRoutine.exercises.length) {
        alert("¡Has terminado todos los ejercicios!");
        return;
    }

    const ex = currentRoutine.exercises[currentExerciseIndex];
    document.getElementById('current-exercise-name').textContent = ex.name;
    
    const setsContainer = document.getElementById('sets-container');
    setsContainer.innerHTML = '';
    
    // Fetch history for weight options and last performance
    const historyRef = doc(db, `users/${currentUser.uid}/exercise_history`, ex.id);
    const historySnap = await getDoc(historyRef);
    
    let historicalWeights = [];
    let lastPerformance = [];
    
    if (historySnap.exists()) {
        const data = historySnap.data();
        historicalWeights = data.historicalWeights || [];
        lastPerformance = data.lastPerformance || [];
    }

    // Render weight selector if multiple options exist
    const weightSelectorContainer = document.getElementById('weight-selector-container');
    const weightDropdown = document.getElementById('weight-dropdown');
    
    if (historicalWeights.length > 1) {
        weightSelectorContainer.classList.remove('hidden');
        weightDropdown.innerHTML = '';
        historicalWeights.forEach(hw => {
            const opt = document.createElement('option');
            opt.value = hw.weight;
            opt.textContent = `${hw.weight} Kg`;
            weightDropdown.appendChild(opt);
        });
    } else {
        weightSelectorContainer.classList.add('hidden');
        // Usar el único peso si existe
        if(historicalWeights.length === 1) {
            weightDropdown.innerHTML = `<option value="${historicalWeights[0].weight}">${historicalWeights[0].weight} Kg</option>`;
        } else {
            weightDropdown.innerHTML = `<option value="">--</option>`; // Si no hay datos
        }
    }

    // Render Sets
    const setsToRender = ex.defaultSets;
    for(let i=0; i<setsToRender; i++) {
        const setRow = document.createElement('div');
        setRow.className = 'set-row';
        
        let targetReps = lastPerformance[i]?.reps || 8; // Default
        
        setRow.innerHTML = `
            <label>Serie ${i+1}</label>
            <input type="number" class="reps-input" value="${targetReps}" placeholder="Reps">
            <select class="intensity-input">
                <option value="green" class="intensity-green">EZ (Verde)</option>
                <option value="orange" class="intensity-orange">Justo (Naranja)</option>
                <option value="red" class="intensity-red">Milagro (Rojo)</option>
            </select>
        `;
        setsContainer.appendChild(setRow);
    }
    
    document.getElementById('btn-next-exercise').onclick = () => saveExerciseAndNext(ex, historicalWeights);
    document.getElementById('btn-finish-workout').onclick = finishWorkout;
};

const saveExerciseAndNext = async (ex, historicalWeights) => {
    // Collect data
    const weightSelected = parseFloat(document.getElementById('weight-dropdown').value) || 0;
    const repsInputs = document.querySelectorAll('.reps-input');
    const intensityInputs = document.querySelectorAll('.intensity-input');
    
    const performance = [];
    for(let i=0; i<repsInputs.length; i++) {
        performance.push({
            weight: weightSelected,
            reps: parseInt(repsInputs[i].value),
            intensity: intensityInputs[i].value
        });
    }

    // Regla de 2 Semanas (Actualizar histórico)
    let newHistorical = [...historicalWeights];
    let found = false;
    newHistorical = newHistorical.map(hw => {
        if (hw.weight === weightSelected) {
            found = true;
            return { ...hw, lastUsed: new Date().toISOString(), ignoredCount: 0 };
        } else {
            return { ...hw, ignoredCount: (hw.ignoredCount || 0) + 1 };
        }
    });

    if (!found && weightSelected > 0) {
        newHistorical.push({ weight: weightSelected, lastUsed: new Date().toISOString(), ignoredCount: 0 });
    }
    
    // Filtrar los que llegaron a 2 ignores
    newHistorical = newHistorical.filter(hw => hw.ignoredCount < 2);

    // Guardar DB (Histórico del ejercicio)
    try {
        const historyRef = doc(db, `users/${currentUser.uid}/exercise_history`, ex.id);
        await setDoc(historyRef, {
            name: ex.name,
            historicalWeights: newHistorical,
            lastPerformance: performance
        }, { merge: true });
        
        // Aquí deberíamos guardar también en la subcolección del workout actual (simplificado para el prototipo)
    } catch(e) {
        console.error("Error saving exercise", e);
    }

    currentExerciseIndex++;
    renderExercise();
};

const finishWorkout = () => {
    clearInterval(timerInterval);
    const elapsedMinutes = Math.floor((Date.now() - startTime) / 60000);
    const saveTime = confirm(`Has tardado ${elapsedMinutes} minutos. ¿Quieres guardar este tiempo en las estadísticas?`);
    
    if (saveTime) {
        // Lógica para guardar la duración total en la db (workout doc)
        console.log("Tiempo guardado:", elapsedMinutes);
    }
    
    alert("¡Entrenamiento Finalizado!");
    document.getElementById('active-workout-container').classList.add('hidden');
    document.getElementById('start-workout-container').classList.remove('hidden');
};
