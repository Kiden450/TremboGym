import { db, collection, doc, setDoc } from './firebase-config.js';

export const seedData = async (uid) => {
    try {
        console.log("Iniciando inyección de datos de prueba para UID:", uid);
        const userRef = doc(db, "users", uid);
        await setDoc(userRef, { createdAt: new Date() }, { merge: true });

        const routinesRef = collection(userRef, "routines");

        // Lunes: Torso A
        await setDoc(doc(routinesRef, "monday"), {
            dayName: "Lunes",
            planName: "Torso A",
            exercises: [
                { id: "lat_polea", name: "Laterales Polea", defaultSets: 2, defaultRestTime: 90 },
                { id: "jalon_neutro", name: "Jalón Neutro", defaultSets: 2, defaultRestTime: 180 },
                { id: "lat_maquina", name: "Laterales Maquina", defaultSets: 2, defaultRestTime: 150 },
                { id: "press_inclinado_maq", name: "Press Inclinado Maquina", defaultSets: 2, defaultRestTime: 150 },
                { id: "remo_t", name: "Remo en T", defaultSets: 2, defaultRestTime: 150 },
                { id: "press_banca_inclinado", name: "Press Banca Inclinado", defaultSets: 1, defaultRestTime: 180 },
                { id: "jalon_abierto", name: "Jalón abierto", defaultSets: 1, defaultRestTime: 150 },
                { id: "curl_biceps", name: "Curl de Bíceps", defaultSets: 1, defaultRestTime: 90 },
                { id: "ext_triceps", name: "Extensión de tríceps", defaultSets: 1, defaultRestTime: 90 },
                { id: "curl_antebrazo", name: "Curl Antebrazo", defaultSets: 1, defaultRestTime: 90 },
                { id: "curl_braquial", name: "Curl Braquial", defaultSets: 1, defaultRestTime: 90 }
            ]
        });

        // Martes: Pierna
        await setDoc(doc(routinesRef, "tuesday"), {
            dayName: "Martes",
            planName: "Pierna",
            exercises: [
                { id: "quads_hacka", name: "Quads hacka", defaultSets: 2, defaultRestTime: 180 },
                { id: "curl_femoral", name: "Curl Femoral Sentado", defaultSets: 2, defaultRestTime: 150 },
                { id: "prensa", name: "Prensa", defaultSets: 2, defaultRestTime: 180 },
                { id: "erectores", name: "Erectores Espinales", defaultSets: 2, defaultRestTime: 120 },
                { id: "aductores", name: "Aductores", defaultSets: 1, defaultRestTime: 120 },
                { id: "abductores", name: "Abductores", defaultSets: 1, defaultRestTime: 120 },
                { id: "hip_trust", name: "Hip Trust", defaultSets: 1, defaultRestTime: 150 },
                { id: "gemelos", name: "Gemelos", defaultSets: 1, defaultRestTime: 120 },
                { id: "crunch", name: "Crunch", defaultSets: 1, defaultRestTime: 120 },
                { id: "soleo", name: "Soleo", defaultSets: 1, defaultRestTime: 120 }
            ]
        });

        // Miércoles: Torso B
        await setDoc(doc(routinesRef, "wednesday"), {
            dayName: "Miércoles",
            planName: "Torso B",
            exercises: [
                { id: "lat_polea", name: "Laterales Polea", defaultSets: 2, defaultRestTime: 90 },
                { id: "jalon_neutro", name: "Jalón Neutro", defaultSets: 2, defaultRestTime: 180 },
                { id: "lat_maquina", name: "Laterales Maquina", defaultSets: 2, defaultRestTime: 150 },
                { id: "press_inclinado_maq", name: "Press Inclinado Maquina", defaultSets: 2, defaultRestTime: 150 },
                { id: "remo_t", name: "Remo en T", defaultSets: 2, defaultRestTime: 150 },
                { id: "press_banca_inclinado", name: "Press Banca Inclinado", defaultSets: 1, defaultRestTime: 180 },
                { id: "jalon_abierto", name: "Jalón abierto", defaultSets: 1, defaultRestTime: 150 },
                { id: "curl_biceps", name: "Curl de Bíceps", defaultSets: 1, defaultRestTime: 90 },
                { id: "ext_triceps", name: "Extensión de tríceps", defaultSets: 1, defaultRestTime: 90 },
                { id: "curl_antebrazo", name: "Curl Antebrazo", defaultSets: 1, defaultRestTime: 90 },
                { id: "curl_braquial", name: "Curl Braquial", defaultSets: 1, defaultRestTime: 90 }
            ]
        });

        // Viernes: Torso C
        await setDoc(doc(routinesRef, "friday"), {
            dayName: "Viernes",
            planName: "Torso C",
            exercises: [
                { id: "lat_polea", name: "Laterales Polea", defaultSets: 2, defaultRestTime: 90 },
                { id: "jalon_neutro", name: "Jalón Neutro", defaultSets: 2, defaultRestTime: 180 },
                { id: "lat_maquina", name: "Laterales Maquina", defaultSets: 3, defaultRestTime: 150 },
                { id: "press_inclinado_maq", name: "Press Inclinado Maquina", defaultSets: 2, defaultRestTime: 180 },
                { id: "remo_t", name: "Remo en T", defaultSets: 2, defaultRestTime: 180 },
                { id: "jalon_abierto", name: "Jalón Abierto", defaultSets: 1, defaultRestTime: 180 },
                { id: "press_banca_inclinado", name: "Press Banca Inclinado", defaultSets: 1, defaultRestTime: 180 },
                { id: "curl_biceps", name: "Curl de Bíceps", defaultSets: 1, defaultRestTime: 90 },
                { id: "ext_triceps", name: "Extensión de tríceps", defaultSets: 1, defaultRestTime: 90 },
                { id: "curl_braquial", name: "Curl Braquial", defaultSets: 1, defaultRestTime: 90 },
                { id: "curl_antebrazo", name: "Curl Antebrazo", defaultSets: 1, defaultRestTime: 90 }
            ]
        });

        // Seed History for some exercises to demonstrate 2-week logic
        const historyRef = collection(userRef, "exercise_history");
        await setDoc(doc(historyRef, "lat_polea"), {
            name: "Laterales Polea",
            historicalWeights: [
                { weight: 21.25, lastUsed: new Date("2026-09-17").toISOString(), ignoredCount: 1 },
                { weight: 22.5, lastUsed: new Date().toISOString(), ignoredCount: 0 }
            ],
            lastPerformance: [
                { weight: 22.5, reps: 8 },
                { weight: 22.5, reps: 8 }
            ]
        });

        await setDoc(doc(historyRef, "press_banca_inclinado"), {
            name: "Press Banca Inclinado",
            historicalWeights: [
                { weight: 82.5, lastUsed: new Date("2026-09-20").toISOString(), ignoredCount: 0 },
                { weight: 85, lastUsed: new Date().toISOString(), ignoredCount: 0 }
            ],
            lastPerformance: [
                { weight: 85, reps: 9 },
                { weight: 85, reps: 11 }
            ]
        });

        console.log("Datos de prueba inyectados correctamente");
        alert("Datos cargados correctamente");
    } catch (e) {
        console.error("Error al inyectar datos de prueba", e);
        alert("Error al inyectar datos de prueba");
    }
};
