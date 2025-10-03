# Configuración de Firebase Realtime Database

## Pasos para configurar Firebase en tu aplicación

### 1. Crear un proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto"
3. Ingresa el nombre de tu proyecto (ej: "my-cook-app")
4. Habilita Google Analytics (opcional)
5. Haz clic en "Crear proyecto"

### 2. Configurar Realtime Database

1. En el panel izquierdo, haz clic en "Realtime Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Iniciar en modo de prueba" (para desarrollo)
4. Elige una ubicación cercana a ti
5. Haz clic en "Listo"

### 3. Obtener las credenciales de configuración

1. En el panel izquierdo, haz clic en "Configuración del proyecto" (ícono de engranaje)
2. Haz clic en "Configuración del proyecto"
3. En la pestaña "General", busca "Tus aplicaciones"
4. Haz clic en el ícono de web (</>) para agregar una aplicación web
5. Ingresa un nombre para tu aplicación (ej: "My Cook App")
6. No marques "También configura Firebase Hosting"
7. Haz clic en "Registrar aplicación"
8. Copia la configuración que aparece (firebaseConfig)

### 4. Actualizar el archivo de configuración

1. Abre el archivo `firebaseConfig.js` en tu proyecto
2. Reemplaza los valores de ejemplo con los de tu proyecto:

```javascript
const firebaseConfig = {
  apiKey: "tu-api-key-real",
  authDomain: "tu-proyecto-real.firebaseapp.com",
  databaseURL: "https://tu-proyecto-real-default-rtdb.firebaseio.com/",
  projectId: "tu-proyecto-real-id",
  storageBucket: "tu-proyecto-real.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id-real"
};
```

### 5. Configurar reglas de seguridad (opcional)

En Realtime Database > Reglas, puedes configurar:

```json
{
  "rules": {
    "favorites": {
      "$userId": {
        ".read": "auth != null && $userId == auth.uid",
        ".write": "auth != null && $userId == auth.uid"
      }
    },
    "customRecipes": {
      "$userId": {
        ".read": "auth != null",
        ".write": "auth != null && $userId == auth.uid"
      }
    }
  }
}
```

### 6. Probar la aplicación

1. Ejecuta `npx expo start`
2. Abre la aplicación en tu dispositivo o emulador
3. Prueba agregar recetas a favoritos
4. Prueba crear una nueva receta personalizada

## Funcionalidades implementadas

### ✅ Favoritos
- Agregar recetas a favoritos
- Remover recetas de favoritos
- Ver estado de favoritos en tiempo real
- Almacenamiento persistente en Firebase

### ✅ Recetas Personalizadas
- Crear nuevas recetas
- Formulario completo con validación
- Almacenamiento en Firebase
- Navegación integrada

## Estructura de datos en Firebase

```
favorites/
  user123/
    recetaId1/
      id: "recetaId1"
      name: "Nombre de la receta"
      image: "URL de la imagen"
      category: "Categoría"
      area: "Área"
      addedAt: "2024-01-01T00:00:00.000Z"

customRecipes/
  user123/
    recetaId1/
      id: "recetaId1"
      name: "Mi Receta Personalizada"
      description: "Descripción"
      ingredients: "Ingredientes"
      instructions: "Instrucciones"
      category: "Personalizada"
      area: "Personalizada"
      prepTime: "30 min"
      servings: "4 personas"
      difficulty: "Media"
      createdAt: "2024-01-01T00:00:00.000Z"
      createdBy: "user123"
```

## Notas importantes

- El `userId` actual está hardcodeado como 'user123' para pruebas
- En una aplicación real, deberías implementar autenticación de usuarios
- Las reglas de seguridad pueden ajustarse según tus necesidades
- Los datos se sincronizan en tiempo real entre dispositivos

