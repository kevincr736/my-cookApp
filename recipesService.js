// Importar funciones de Firebase Realtime Database
import { 
  ref, 
  set, 
  get, 
  remove, 
  push, 
  onValue, 
  off 
} from 'firebase/database';
import { database } from './firebaseConfig';

// Clase para manejar las recetas personalizadas
export class RecipesService {
  
  // Crear una nueva receta personalizada
  static async createRecipe(userId, recipeData) {
    try {
      const recipesRef = ref(database, `customRecipes/${userId}`);
      const newRecipeRef = push(recipesRef);
      
      const recipe = {
        id: newRecipeRef.key,
        name: recipeData.name,
        description: recipeData.description,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions,
        image: recipeData.image || 'https://via.placeholder.com/300x200?text=Sin+Imagen',
        category: recipeData.category || 'Personalizada',
        area: recipeData.area || 'Personalizada',
        prepTime: recipeData.prepTime || 'No especificado',
        servings: recipeData.servings || 'No especificado',
        difficulty: recipeData.difficulty || 'Media',
        createdAt: new Date().toISOString(),
        createdBy: userId
      };

      await set(newRecipeRef, recipe);
      return { success: true, recipeId: newRecipeRef.key };
    } catch (error) {
      console.error('Error al crear receta:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener todas las recetas personalizadas de un usuario
  static async getUserRecipes(userId) {
    try {
      const recipesRef = ref(database, `customRecipes/${userId}`);
      const snapshot = await get(recipesRef);
      
      if (snapshot.exists()) {
        const recipes = snapshot.val();
        return Object.values(recipes);
      }
      return [];
    } catch (error) {
      console.error('Error al obtener recetas:', error);
      return [];
    }
  }

  // Obtener todas las recetas personalizadas (públicas)
  static async getAllCustomRecipes() {
    try {
      const recipesRef = ref(database, 'customRecipes');
      const snapshot = await get(recipesRef);
      
      if (snapshot.exists()) {
        const allRecipes = snapshot.val();
        const recipes = [];
        
        // Combinar todas las recetas de todos los usuarios
        Object.values(allRecipes).forEach(userRecipes => {
          recipes.push(...Object.values(userRecipes));
        });
        
        return recipes;
      }
      return [];
    } catch (error) {
      console.error('Error al obtener todas las recetas:', error);
      return [];
    }
  }

  // Actualizar una receta personalizada
  static async updateRecipe(userId, recipeId, recipeData) {
    try {
      const recipeRef = ref(database, `customRecipes/${userId}/${recipeId}`);
      
      const updatedRecipe = {
        ...recipeData,
        updatedAt: new Date().toISOString()
      };

      await set(recipeRef, updatedRecipe);
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar receta:', error);
      return { success: false, error: error.message };
    }
  }

  // Eliminar una receta personalizada
  static async deleteRecipe(userId, recipeId) {
    try {
      const recipeRef = ref(database, `customRecipes/${userId}/${recipeId}`);
      await remove(recipeRef);
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar receta:', error);
      return { success: false, error: error.message };
    }
  }

  // Escuchar cambios en las recetas personalizadas
  static listenToUserRecipes(userId, callback) {
    const recipesRef = ref(database, `customRecipes/${userId}`);
    
    const unsubscribe = onValue(recipesRef, (snapshot) => {
      if (snapshot.exists()) {
        const recipes = snapshot.val();
        callback(Object.values(recipes));
      } else {
        callback([]);
      }
    });

    return unsubscribe;
  }
}
