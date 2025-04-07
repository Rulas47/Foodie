import { StyleSheet, Dimensions, TextInput, View, TouchableOpacity, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { ThemedView } from '@/components/ThemedView';
import Constants from 'expo-constants';
import { useState } from 'react';

export default function TabTwoScreen() {
  const [activeView, setActiveView] = useState('map');

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar"
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.buttonLeft, activeView === 'map' && styles.activeButton]}
            onPress={() => setActiveView('map')}
          >
            <Text style={[styles.buttonText, activeView === 'map' && styles.activeButtonText]}>Mapa</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.buttonRight, activeView === 'list' && styles.activeButton]}
            onPress={() => setActiveView('list')}
          >
            <Text style={[styles.buttonText, activeView === 'list' && styles.activeButtonText]}>Lista</Text>
          </TouchableOpacity>
        </View>
      </View>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 40.416775,  // Madrid, España
          longitude: -3.703790,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  header: {
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  buttonLeft: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderRightWidth: 0.5,
    borderColor: '#ddd',
  },
  buttonRight: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderLeftWidth: 0.5,
    borderColor: '#ddd',
  },
  buttonText: {
    fontSize: 16,
    color: '#666',
  },
  activeButton: {
    backgroundColor: '#00BFA5',
  },
  activeButtonText: {
    color: 'white',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
}); 
