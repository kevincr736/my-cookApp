// Importaciones de React y hooks para manejo de estado
import React, { useState, useEffect } from 'react';
// Importación del contenedor principal de navegación
import { NavigationContainer } from '@react-navigation/native';
// Importación para crear navegación por pestañas (TabBar)
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Importación para crear navegación por stack (pantallas apiladas)
import { createStackNavigator } from '@react-navigation/stack';
// Importación para manejar la barra de estado del dispositivo
import { StatusBar } from 'expo-status-bar';
// Importación para manejar áreas seguras del dispositivo (notch, etc.)
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Importación de iconos vectoriales
import { Ionicons } from '@expo/vector-icons';
// Importación de componentes básicos de React Native
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Linking, Image } from 'react-native';
// Importación de componente de imagen optimizado de Expo
import { Image as ExpoImage } from 'expo-image';

// Creación de navegadores para la app
const Tab = createBottomTabNavigator(); // Navegador de pestañas (TabBar)
const Stack = createStackNavigator();   // Navegador de stack (pantallas apiladas)


// Pantalla de detalles del plato (para la sección de Recetas)
const DishDetailScreen = ({ route, navigation }) => {
  // Extrae el ID del plato que viene desde la pantalla anterior
  const { dishId } = route.params;
  // Estado para almacenar los datos del plato
  const [dish, setDish] = useState(null);
  // Estado para controlar si está cargando la información
  const [loading, setLoading] = useState(true);

  // Hook que se ejecuta cuando el componente se monta o cambia dishId
  useEffect(() => {
    fetchDishDetails();
  }, [dishId]);

  // Función asíncrona para obtener los detalles del plato desde la API
  const fetchDishDetails = async () => {
    try {
      setLoading(true); // Activa el indicador de carga
      // Hace petición a la API de TheMealDB para obtener detalles del plato
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${dishId}`);
      const data = await response.json();
      // Si hay datos, guarda el primer plato en el estado
      if (data.meals && data.meals.length > 0) {
        setDish(data.meals[0]);
      }
    } catch (error) {
      // Si hay error, muestra alerta al usuario
      Alert.alert('Error', 'No se pudo cargar la receta');
      console.error('Error:', error);
    } finally {
      setLoading(false); // Desactiva el indicador de carga
    }
  };

  // Función para extraer ingredientes y medidas del plato
  const getIngredients = () => {
    if (!dish) return []; // Si no hay plato, retorna array vacío
    const ingredients = []; // Array para almacenar ingredientes
    // Itera del 1 al 20 porque la API tiene hasta 20 ingredientes
    for (let i = 1; i <= 20; i++) {
      // Obtiene el ingrediente i (strIngredient1, strIngredient2, etc.)
      const ingredient = dish[`strIngredient${i}`];
      // Obtiene la medida i (strMeasure1, strMeasure2, etc.)
      const measure = dish[`strMeasure${i}`];
      // Si el ingrediente existe y no está vacío, lo agrega al array
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push({
          ingredient: ingredient.trim(), // Nombre del ingrediente sin espacios
          measure: measure ? measure.trim() : '', // Medida sin espacios o vacío
        });
      }
    }
    return ingredients; // Retorna el array de ingredientes
  };

  // Si está cargando, muestra indicador de carga
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Cargando receta...</Text>
      </View>
    );
  }

  // Si no hay datos del plato, muestra mensaje de error
  if (!dish) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se encontró la receta</Text>
      </View>
    );
  }

  // Obtiene la lista de ingredientes del plato
  const ingredients = getIngredients();

  return (
    <ScrollView style={styles.container}>
      {/* Imagen principal del plato */}
      <ExpoImage
        source={{ uri: dish.strMealThumb }}
        style={styles.dishImage}
        contentFit="cover"
      />
      
      <View style={styles.content}>
        {/* Nombre del plato */}
        <Text style={styles.dishName}>{dish.strMeal}</Text>
        
        {/* Sección de categoría (solo si existe) */}
        {dish.strCategory && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Categoría</Text>
            <Text style={styles.infoText}>{dish.strCategory}</Text>
          </View>
        )}

        {/* Sección de área/cocina (solo si existe) */}
        {dish.strArea && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Cocina</Text>
            <Text style={styles.infoText}>{dish.strArea}</Text>
          </View>
        )}

        {/* Sección de ingredientes (solo si hay ingredientes) */}
        {ingredients.length > 0 && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Ingredientes</Text>
            {/* Mapea cada ingrediente y lo muestra como lista */}
            {ingredients.map((item, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.ingredientText}>
                  • {item.measure} {item.ingredient}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Sección de instrucciones paso a paso (solo si existe) */}
        {dish.strInstructions && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Paso a Paso</Text>
            <Text style={styles.instructionsText}>{dish.strInstructions}</Text>
          </View>
        )}

        {/* Sección de video de YouTube (solo si existe) */}
        {dish.strYoutube && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Video Tutorial</Text>
            {/* Botón para abrir video en YouTube */}
            <TouchableOpacity 
              style={styles.youtubeButton}
              onPress={() => Linking.openURL(dish.strYoutube)}
            >
              <Ionicons name="logo-youtube" size={24} color="#fff" />
              <Text style={styles.youtubeButtonText}>Ver Tutorial en YouTube</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// Componente HomeScreen con API integrada (pantalla de Recetas)
const HomeScreen = ({ navigation }) => {
  // Estado para controlar si está cargando las recetas
  const [loading, setLoading] = useState(false);
  // Estado para almacenar la lista de recetas
  const [recipes, setRecipes] = useState([]);
  // Estado para manejar los likes de las recetas
  const [recipeLikes, setRecipeLikes] = useState({});

  // Hook que se ejecuta cuando el componente se monta
  useEffect(() => {
    getRecipes();
  }, []);

  // Función asíncrona para obtener recetas desde la API
  const getRecipes = async () => {
    try {
      setLoading(true); // Activa el indicador de carga
      // Hace petición a la API de TheMealDB para obtener recetas individuales
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
      const data = await response.json();
      // Guarda las recetas en el estado (o array vacío si no hay datos)
      setRecipes(data.meals || []);
    } catch (error) {
      // Si hay error, muestra alerta al usuario
      Alert.alert('Error', 'No se pudieron cargar las recetas');
      console.error('Error:', error);
    } finally {
      setLoading(false); // Desactiva el indicador de carga
    }
  };

  // Función para manejar likes de recetas
  const toggleRecipeLike = (recipeId) => {
    setRecipeLikes(prev => ({
      ...prev,
      [recipeId]: !prev[recipeId] // Cambia el estado del like
    }));
  };

  // Función para renderizar cada receta en la lista
  const renderRecipe = ({ item }) => (
    <View style={styles.recipeCard}>
      <TouchableOpacity 
        style={styles.recipeContent}
        // Al presionar, navega a la pantalla de detalles con el ID del plato
        onPress={() => navigation.navigate('DishDetail', { dishId: item.idMeal })}
      >
        {/* Imagen de la receta */}
        <ExpoImage
          source={{ uri: item.strMealThumb }}
          style={styles.recipeImage}
          contentFit="cover"
        />
        <View style={styles.recipeInfo}>
          {/* Nombre de la receta */}
          <Text style={styles.recipeName}>{item.strMeal}</Text>
        </View>
      </TouchableOpacity>
      {/* Botón de like/dislike */}
      <TouchableOpacity 
        style={styles.likeButton}
        onPress={() => toggleRecipeLike(item.idMeal)}
      >
        <Ionicons 
          name={recipeLikes[item.idMeal] ? "heart" : "heart-outline"} 
          size={24} 
          color={recipeLikes[item.idMeal] ? "#FF6B6B" : "#666"} 
        />
      </TouchableOpacity>
    </View>
  );

  // Si está cargando, muestra indicador de carga
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Cargando recetas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Subtítulo explicativo */}
      <Text style={styles.subtitle}>Toca una receta para ver los detalles</Text>
      {/* Lista de recetas */}
      <FlatList
        data={recipes} // Datos de las recetas
        renderItem={renderRecipe} // Función para renderizar cada item
        keyExtractor={(item) => item.idMeal} // Clave única para cada item
        contentContainerStyle={styles.listContainer} // Estilos del contenedor
        showsVerticalScrollIndicator={false} // Oculta la barra de scroll
      />
    </View>
  );
};

// Stack Navigator para la sección de Recetas
const RecipesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        // Estilos globales para todas las pantallas del stack
        headerStyle: {
          backgroundColor: '#FF6B6B', // Color de fondo del header
        },
        headerTintColor: '#fff', // Color del texto del header
        headerTitleStyle: {
          fontWeight: 'bold', // Estilo del título
        },
      }}
    >
      {/* Pantalla principal de lista de recetas */}
      <Stack.Screen 
        name="RecipesList" 
        component={HomeScreen}
        options={{ 
          title: '📖 Recetas Populares',
          headerTitleAlign: 'center' // Centra el título
        }}
      />
      {/* Pantalla de detalles de la receta */}
      <Stack.Screen 
        name="DishDetail" 
        component={DishDetailScreen}
        options={{ 
          title: 'Detalle del Plato',
          headerTitleAlign: 'center' // Centra el título
        }}
      />
    </Stack.Navigator>
  );
};

// Stack Navigator para Países
const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FF6B6B',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="ProfileList" 
        component={ProfileScreen}
        options={{ 
          title: '🌍 Países del Mundo',
          headerTitleAlign: 'center'
        }}
      />
      <Stack.Screen 
        name="CountryDish" 
        component={CountryDishScreen}
        options={{ 
          title: 'Plato Principal',
          headerTitleAlign: 'center'
        }}
      />
    </Stack.Navigator>
  );
};

// Pantalla de plato principal del país
const CountryDishScreen = ({ route, navigation }) => {
  const { country } = route.params;
  const [showMore, setShowMore] = useState(false);

  const renderTraditionalDish = ({ item }) => (
    <View style={styles.traditionalDishCard}>
      <Image
        source={item.image}
        style={styles.traditionalDishImage}
        resizeMode="cover"
      />
      <View style={styles.traditionalDishInfo}>
        <Text style={styles.traditionalDishName}>{item.name}</Text>
        <Text style={styles.traditionalDishDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Image
        source={country.dishImage}
        style={styles.dishImage}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <View style={styles.countryHeader}>
          <ExpoImage
            source={{ uri: country.flag }}
            style={styles.countryFlag}
            contentFit="contain"
          />
          <View style={styles.countryInfo}>
            <Text style={styles.countryName}>{country.name}</Text>
            <Text style={styles.countryCapital}>{country.capital}</Text>
            <Text style={styles.countryPopulation}>{country.population} habitantes</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Plato Principal</Text>
          <Text style={styles.dishName}>{country.mainDish}</Text>
          <Text style={styles.dishDescription}>{country.dishDescription}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Sobre {country.name}</Text>
          <Text style={styles.infoText}>
            {country.name} es conocido por su rica tradición culinaria. 
            El plato principal "{country.mainDish}" representa la esencia 
            de la cocina de este país y es una delicia que no te puedes perder.
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Datos del País</Text>
          <View style={styles.countryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Capital</Text>
              <Text style={styles.statValue}>{country.capital}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Población</Text>
              <Text style={styles.statValue}>{country.population}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Plato Típico</Text>
              <Text style={styles.statValue}>{country.mainDish}</Text>
            </View>
          </View>
        </View>

        {/* Botón para expandir/colapsar platos tradicionales */}
        <TouchableOpacity 
          style={styles.showMoreButton}
          // Al presionar, cambia el estado de showMore (true/false)
          onPress={() => setShowMore(!showMore)}
        >
          {/* Texto que cambia según el estado */}
          <Text style={styles.showMoreText}>
            {showMore ? 'Ver menos' : 'Ver más platos tradicionales'}
          </Text>
          {/* Icono que cambia según el estado (flecha arriba/abajo) */}
          <Ionicons 
            name={showMore ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#FF6B6B" 
          />
        </TouchableOpacity>

        {/* Sección de platos tradicionales (solo se muestra si showMore es true) */}
        {showMore && (
          <View style={styles.traditionalDishesSection}>
            {/* Título de la sección */}
            <Text style={styles.sectionTitle}>Platos Tradicionales</Text>
            {/* Carrusel horizontal de platos tradicionales */}
            <FlatList
              data={country.traditionalDishes} // Datos de platos tradicionales
              renderItem={renderTraditionalDish} // Función para renderizar cada plato
              keyExtractor={(item, index) => index.toString()} // Clave única para cada item
              horizontal // Scroll horizontal
              showsHorizontalScrollIndicator={false} // Oculta la barra de scroll
              contentContainerStyle={styles.traditionalDishesList} // Estilos del contenedor
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// Componente ProfileScreen
const ProfileScreen = ({ navigation }) => {
  // Estado para manejar los likes de los países
  const [countryLikes, setCountryLikes] = useState({});
  
  // Datos hardcodeados de países y sus platos principales
  const countries = [
    {
      id: '1',
      name: 'Colombia',
      flag: 'https://flagcdn.com/w80/co.png',
      capital: 'Bogotá',
      population: '51.2M',
      mainDish: 'Bandeja Paisa',
      dishDescription: 'Frijoles, arroz, carne, huevo, plátano y aguacate',
      dishImage: require('./assets/bandeja-paisa-1616-1.jpg'),
      traditionalDishes: [
        { name: 'Ajiaco', description: 'Sopa de pollo con papa y maíz', image: require('./assets/ajiaco-colombiano.jpg') },
        { name: 'Sancocho', description: 'Sopa espesa con carne y verduras', image: require('./assets/sancocho-colombiano.jpg') },
        { name: 'Arepa', description: 'Pan de maíz tradicional', image: require('./assets/arepas.jpg') },
        { name: 'Lechona', description: 'Cerdo relleno asado', image: require('./assets/lechona.jpg') }
      ]
    },
    {
      id: '2',
      name: 'España',
      flag: 'https://flagcdn.com/w80/es.png',
      capital: 'Madrid',
      population: '47.4M',
      mainDish: 'Paella Valenciana',
      dishDescription: 'Arroz con pollo, conejo, judías verdes y azafrán',
      dishImage: require('./assets/paella-valenciana.jpg'),
      traditionalDishes: [
        { name: 'Tortilla Española', description: 'Tortilla de patatas tradicional', image: require('./assets/TortillaEspanola.jpg') },
        { name: 'Gazpacho', description: 'Sopa fría de tomate', image: require('./assets/gazpacho.jpg') },
        { name: 'Jamón Ibérico', description: 'Jamón curado de cerdo ibérico', image: require('./assets/jamon_iberico.jpg') },
        { name: 'Churros', description: 'Dulce frito con chocolate', image: require('./assets/churros.jpg') }
      ]
    },
    {
      id: '3',
      name: 'Italia',
      flag: 'https://flagcdn.com/w80/it.png',
      capital: 'Roma',
      population: '60.4M',
      mainDish: 'Pizza Margherita',
      dishDescription: 'Pizza con tomate, mozzarella y albahaca fresca',
      dishImage: require('./assets/pizza-margarita.jpg'),
      traditionalDishes: [
        { name: 'Pasta Carbonara', description: 'Pasta con huevo, queso y panceta', image: require('./assets/pasta_carbonara.jpg') },
        { name: 'Risotto', description: 'Arroz cremoso con queso parmesano', image: require('./assets/risotto.jpg') },
        { name: 'Lasagna', description: 'Pasta en capas con carne y queso', image: require('./assets/lasagna.jpg') },
        { name: 'Tiramisu', description: 'Postre de café y mascarpone', image: require('./assets/tiramisu.jpg') }
      ]
    },
    {
      id: '4',
      name: 'Francia',
      flag: 'https://flagcdn.com/w80/fr.png',
      capital: 'París',
      population: '67.4M',
      mainDish: 'Coq au Vin',
      dishDescription: 'Pollo cocido en vino tinto con verduras',
      dishImage: require('./assets/coq-au-vin.jpg'),
      traditionalDishes: [
        { name: 'Ratatouille', description: 'Guiso de verduras provenzal', image: require('./assets/rotatouille.jpg') },
        { name: 'Bouillabaisse', description: 'Sopa de pescado marsellesa', image: require('./assets/bouillabaisse.jpg') },
        { name: 'Croissant', description: 'Panadería francesa tradicional', image: require('./assets/Croissant.jpg') },
        { name: 'Crêpes', description: 'Panqueques dulces o salados', image: require('./assets/classic_crepes.jpg') }
      ]
    },
    {
      id: '5',
      name: 'México',
      flag: 'https://flagcdn.com/w80/mx.png',
      capital: 'Ciudad de México',
      population: '128.9M',
      mainDish: 'Tacos al Pastor',
      dishDescription: 'Tacos de cerdo marinado con piña y cebolla',
      dishImage: require('./assets/tacos_pastor.jpg'),
      traditionalDishes: [
        { name: 'Mole Poblano', description: 'Salsa de chocolate con chiles', image: require('./assets/mole-poblano.jpg') },
        { name: 'Chiles en Nogada', description: 'Chiles rellenos con nogada', image: require('./assets/chille_nogada.jpg') },
        { name: 'Pozole', description: 'Sopa de maíz con carne', image: require('./assets/pozolejpg.jpg') },
        { name: 'Tamales', description: 'Masa de maíz envuelta en hojas', image: require('./assets/tamales.jpg') }
      ]
    },
    {
      id: '6',
      name: 'Japón',
      flag: 'https://flagcdn.com/w80/jp.png',
      capital: 'Tokio',
      population: '125.8M',
      mainDish: 'Sushi',
      dishDescription: 'Arroz con pescado crudo y algas marinas',
      dishImage: require('./assets/suchi.jpg'),
      traditionalDishes: [
        { name: 'Ramen', description: 'Sopa de fideos japonesa', image: require('./assets/ramen.jpg') },
        { name: 'Tempura', description: 'Verduras y mariscos fritos', image: require('./assets/tempura.jpg') },
        { name: 'Teriyaki', description: 'Carne con salsa dulce', image: require('./assets/teriyaki.jpg') },
        { name: 'Mochi', description: 'Dulce de arroz glutinoso', image: require('./assets/mochi.jpg') }
      ]
    },
    {
      id: '7',
      name: 'India',
      flag: 'https://flagcdn.com/w80/in.png',
      capital: 'Nueva Delhi',
      population: '1.38B',
      mainDish: 'Biryani',
      dishDescription: 'Arroz aromático con especias y carne',
      dishImage: require('./assets/biryani.png'),
      traditionalDishes: [
        { name: 'Curry', description: 'Guiso con especias y leche de coco', image: require('./assets/curry.jpg') },
        { name: 'Naan', description: 'Pan plano indio', image: require('./assets/naan.jpg') },
        { name: 'Tandoori', description: 'Carne cocida en horno de barro', image: require('./assets/tandori.jpg') },
        { name: 'Lassi', description: 'Bebida de yogur con frutas', image: require('./assets/lassi.jpg') }
      ]
    }
  ];

  // Función para manejar likes de países
  const toggleCountryLike = (countryId) => {
    setCountryLikes(prev => ({
      ...prev,
      [countryId]: !prev[countryId] // Cambia el estado del like
    }));
  };

   // Función para renderizar cada país en la lista
  const renderCountry = ({ item }) => (
    <View style={styles.countryCard}>
      <TouchableOpacity 
        style={styles.countryContent}
        // Al presionar, navega a la pantalla de detalles del país
        onPress={() => navigation.navigate('CountryDish', { country: item })}
      >
        {/* Header de la tarjeta con bandera e información del país */}
        <View style={styles.countryHeader}>
          {/* Imagen de la bandera del país */}
          <ExpoImage
            source={{ uri: item.flag }}
            style={styles.countryFlag}
            contentFit="contain"
          />
          {/* Información del país */}
          <View style={styles.countryInfo}>
            <Text style={styles.countryName}>{item.name}</Text>
            <Text style={styles.countryCapital}>{item.capital}</Text>
            <Text style={styles.countryPopulation}>{item.population} habitantes</Text>
          </View>
        </View>
        {/* Vista previa del plato principal */}
        <View style={styles.dishPreview}>
          <Text style={styles.dishName}>{item.mainDish}</Text>
          <Text style={styles.dishDescription}>{item.dishDescription}</Text>
        </View>
      </TouchableOpacity>
      {/* Botón de like/dislike */}
      <TouchableOpacity 
        style={styles.likeButton}
        onPress={() => toggleCountryLike(item.id)}
      >
        <Ionicons 
          name={countryLikes[item.id] ? "heart" : "heart-outline"} 
          size={24} 
          color={countryLikes[item.id] ? "#FF6B6B" : "#666"} 
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Subtítulo explicativo */}
      <Text style={styles.subtitle}>Toca un país para ver su plato principal</Text>
      {/* Lista de países */}
      <FlatList
        data={countries} // Datos de los países
        renderItem={renderCountry} // Función para renderizar cada país
        keyExtractor={(item) => item.id} // Clave única para cada país
        contentContainerStyle={styles.listContainer} // Estilos del contenedor
        showsVerticalScrollIndicator={false} // Oculta la barra de scroll
      />
    </View>
  );
};

// Componente principal de la aplicación
export default function App() {
  return (
    // Proveedor de áreas seguras para manejar notch y bordes del dispositivo
    <SafeAreaProvider>
      {/* Contenedor principal de navegación */}
      <NavigationContainer>
        {/* Barra de estado del dispositivo */}
        <StatusBar style="auto" />
        {/* Navegador de pestañas (TabBar) */}
        <Tab.Navigator
          screenOptions={({ route }) => ({
            // Función para mostrar iconos en las pestañas
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              // Asigna iconos según la pestaña activa
              if (route.name === 'Recipes') {
                iconName = focused ? 'book' : 'book-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              }

              // Retorna el icono con el nombre, tamaño y color
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            // Color del texto de la pestaña activa
            tabBarActiveTintColor: '#FF6B6B',
            // Color del texto de las pestañas inactivas
            tabBarInactiveTintColor: 'gray',
            // Estilos del TabBar
            tabBarStyle: {
              backgroundColor: '#fff', // Fondo blanco
              borderTopWidth: 1, // Borde superior
              borderTopColor: '#e0e0e0', // Color del borde
              paddingBottom: 5, // Espaciado inferior
              paddingTop: 5, // Espaciado superior
              height: 60, // Altura del TabBar
            },
            // Estilos del header
            headerStyle: {
              backgroundColor: '#FF6B6B', // Color de fondo del header
            },
            headerTintColor: '#fff', // Color del texto del header
            headerTitleStyle: {
              fontWeight: 'bold', // Estilo del título
            },
          })}
        >
          {/* Pestaña de Recetas */}
          <Tab.Screen 
            name="Recipes" 
            component={RecipesStack}
            options={{ 
              title: 'Recetas', // Título de la pestaña
              headerShown: false, // Oculta el header (lo maneja RecipesStack)
              // Icono personalizado para la pestaña
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="book" size={size} color={color} />
              ),
            }}
          />
          {/* Pestaña de Países */}
          <Tab.Screen 
            name="Profile" 
            component={ProfileStack}
            options={{ 
              title: 'Países', // Título de la pestaña
              headerShown: false, // Oculta el header (lo maneja ProfileStack)
              // Icono personalizado para la pestaña
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="globe" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    margin: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  listContainer: {
    padding: 10,
  },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
    position: 'relative',
  },
  recipeContent: {
    flex: 1,
    flexDirection: 'row',
  },
  recipeImage: {
    width: 120,
    height: 120,
  },
  recipeInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  // Estilos para la pantalla de detalles
  dishImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  dishName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  ingredientItem: {
    marginBottom: 5,
  },
  ingredientText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  instructionsText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    textAlign: 'justify',
  },
  linkText: {
    fontSize: 16,
    color: '#FF6B6B',
    textDecorationLine: 'underline',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
  },
  // Estilos para el botón de YouTube
  youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 10,
    elevation: 5,
    shadowColor: '#FF0000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    transform: [{ scale: 1 }],
  },
  youtubeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  // Estilos para tarjetas de países
  countryCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: 'relative',
  },
  countryContent: {
    flex: 1,
  },
  countryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  countryFlag: {
    width: 50,
    height: 35,
    marginRight: 15,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  countryCapital: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  countryPopulation: {
    fontSize: 12,
    color: '#888',
  },
  dishPreview: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  dishDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  // Estilos para pantalla de país
  countryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  showMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
    marginRight: 8,
  },
  traditionalDishesSection: {
    marginTop: 10,
  },
  traditionalDishesList: {
    paddingHorizontal: 10,
  },
  traditionalDishCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  traditionalDishImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  traditionalDishInfo: {
    padding: 12,
  },
  traditionalDishName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  traditionalDishDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  // Estilos para botón de like
  likeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

