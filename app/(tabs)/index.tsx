import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <ThemedText type="title" style={styles.title}>Guía de Usuario - Foodie 🍽️</ThemedText>

        <ThemedText style={styles.sectionTitle}>Bienvenido a Foodie</ThemedText>
        <ThemedText style={styles.text}>
          Foodie es una aplicación móvil diseñada para ayudarte a descubrir y gestionar tus restaurantes favoritos. Esta guía te ayudará a entender todas las funcionalidades disponibles.
        </ThemedText>

        <ThemedText style={styles.sectionTitle}>Funcionalidades Principales</ThemedText>

        <ThemedText style={styles.subsectionTitle}>1. Explorar Restaurantes 🗺️</ThemedText>
        <ThemedText style={styles.text}>• Mapa Interactivo: Visualiza restaurantes cercanos en un mapa interactivo</ThemedText>
        <ThemedText style={styles.text}>• Búsqueda: Encuentra restaurantes por nombre o ubicación</ThemedText>
        <ThemedText style={styles.text}>• Filtros: Cambia entre vista de mapa y lista para encontrar el restaurante perfecto</ThemedText>
        <ThemedText style={styles.text}>• Ubicación: La aplicación detecta automáticamente tu ubicación para mostrarte restaurantes cercanos</ThemedText>

        <ThemedText style={styles.subsectionTitle}>2. Detalles del Restaurante 📱</ThemedText>
        <ThemedText style={styles.text}>• Información Completa:</ThemedText>
        <ThemedText style={styles.text}>  - Nombre y dirección</ThemedText>
        <ThemedText style={styles.text}>  - Calificación</ThemedText>
        <ThemedText style={styles.text}>  - Número de teléfono</ThemedText>
        <ThemedText style={styles.text}>  - Sitio web</ThemedText>
        <ThemedText style={styles.text}>• Acciones Rápidas:</ThemedText>
        <ThemedText style={styles.text}>  - Llamar directamente al restaurante</ThemedText>
        <ThemedText style={styles.text}>  - Visitar el sitio web</ThemedText>
        <ThemedText style={styles.text}>  - Guardar en favoritos o pendientes</ThemedText>

        <ThemedText style={styles.subsectionTitle}>3. Mis Listas 📋</ThemedText>
        <ThemedText style={styles.text}>• Favoritos: Guarda tus restaurantes favoritos para acceso rápido</ThemedText>
        <ThemedText style={styles.text}>• Pendientes: Crea una lista de restaurantes que quieres visitar</ThemedText>
        <ThemedText style={styles.text}>• Gestión de Listas:</ThemedText>
        <ThemedText style={styles.text}>  - Añadir/eliminar restaurantes</ThemedText>
        <ThemedText style={styles.text}>  - Ver detalles completos</ThemedText>
        <ThemedText style={styles.text}>  - Organizar por preferencia</ThemedText>

        <ThemedText style={styles.subsectionTitle}>4. Características Adicionales</ThemedText>
        <ThemedText style={styles.text}>• Tema Adaptativo: La aplicación se adapta automáticamente al tema claro u oscuro de tu dispositivo</ThemedText>
        <ThemedText style={styles.text}>• Interfaz Intuitiva: Diseño moderno y fácil de usar</ThemedText>
        <ThemedText style={styles.text}>• Navegación Sencilla: Acceso rápido a todas las funciones desde la barra de navegación</ThemedText>

        <ThemedText style={styles.sectionTitle}>Consejos de Uso</ThemedText>
        <ThemedText style={styles.text}>1. Para Explorar:</ThemedText>
        <ThemedText style={styles.text}>   • Usa el mapa para descubrir restaurantes cercanos</ThemedText>
        <ThemedText style={styles.text}>   • Toca los marcadores para ver información básica</ThemedText>
        <ThemedText style={styles.text}>   • Selecciona un restaurante para ver todos los detalles</ThemedText>

        <ThemedText style={styles.text}>2. Para Guardar:</ThemedText>
        <ThemedText style={styles.text}>   • En la pantalla de detalles, usa el botón de guardar</ThemedText>
        <ThemedText style={styles.text}>   • Elige entre "Favoritos" o "Pendientes"</ThemedText>
        <ThemedText style={styles.text}>   • Accede a tus listas desde la pestaña "Mis Listas"</ThemedText>

        <ThemedText style={styles.text}>3. Para Contactar:</ThemedText>
        <ThemedText style={styles.text}>   • Usa los botones de contacto en la pantalla de detalles</ThemedText>
        <ThemedText style={styles.text}>   • Llama directamente o visita el sitio web con un solo toque</ThemedText>

        <ThemedText style={styles.sectionTitle}>Soporte</ThemedText>
        <ThemedText style={styles.text}>
          Si necesitas ayuda adicional o tienes alguna sugerencia, no dudes en contactarnos a través de la sección de soporte de la aplicación.
        </ThemedText>

        <ThemedText style={styles.footer}>
          ¡Esperamos que disfrutes usando Foodie para descubrir nuevos lugares para comer! 🍽️
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
  footer: {
    fontSize: 16,
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 