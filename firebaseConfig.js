// Importar Firebase
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Configuración de Firebase (debes reemplazar estos valores con los de tu proyecto)
const firebaseConfig = {
  apiKey: "AIzaSyC0rG79i1f2QrPpZFT-XYAau2fGZ2CesXU",
  authDomain: "recetasapp-88ef2.firebaseapp.com",
  databaseURL: "https://recetasapp-88ef2-default-rtdb.firebaseio.com/",
  projectId: "recetasapp-88ef2",
  storageBucket: "recetasapp-88ef2.firebasestorage.app",
  messagingSenderId: "267928952804",
  appId: "1:267928952804:web:13475939706eb18e8031f1",
  measurementId: "G-CPMEBJP1W5"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener la instancia de la base de datos
export const database = getDatabase(app);

export default app;
