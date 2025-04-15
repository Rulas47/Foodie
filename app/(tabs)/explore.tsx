import { StyleSheet, Dimensions, TextInput, View, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import Constants from 'expo-constants';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Restaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  rating?: number;
}

export default function TabTwoScreen() {
  const [activeView, setActiveView] = useState('map');
  const [location, setLocation] = useState({
    latitude: 40.416775,
    longitude: -3.703790,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const colorScheme = useColorScheme() ?? 'light';

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      
      // Buscar restaurantes cercanos
      await fetchNearbyRestaurants(currentLocation.coords.latitude, currentLocation.coords.longitude);
    })();
  }, []);

  const fetchNearbyRestaurants = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=restaurant&key=AIzaSyCUotSSvr4PyrHMeUS0v40gCBtqQmnmrmU`
      );
      const data = await response.json();
      
      if (data.results) {
        const restaurantsData = data.results.map((place: any) => ({
          id: place.place_id,
          name: place.name,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          rating: place.rating
        }));
        console.log('Restaurantes encontrados:', restaurantsData.length);
        setRestaurants(restaurantsData);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor: Colors[colorScheme].background }]}>
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, { 
              backgroundColor: colorScheme === 'light' ? '#f5f5f5' : '#2a2a2a',
              color: Colors[colorScheme].text 
            }]}
            placeholder="Buscar"
            placeholderTextColor={Colors[colorScheme].icon}
          />
        </View>
        <View style={[styles.buttonContainer, { backgroundColor: colorScheme === 'light' ? '#f5f5f5' : '#2a2a2a' }]}>
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.buttonLeft, 
              { backgroundColor: Colors[colorScheme].background },
              activeView === 'map' && styles.activeButton
            ]}
            onPress={() => setActiveView('map')}
          >
            <ThemedText style={[styles.buttonText, activeView === 'map' && styles.activeButtonText]}>
              Mapa
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.buttonRight, 
              { backgroundColor: Colors[colorScheme].background },
              activeView === 'list' && styles.activeButton
            ]}
            onPress={() => setActiveView('list')}
          >
            <ThemedText style={[styles.buttonText, activeView === 'list' && styles.activeButtonText]}>
              Lista
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
      {activeView === 'map' ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={location}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsPointsOfInterest={false}
          showsBuildings={false}
          showsTraffic={false}
          showsIndoors={false}
          showsCompass={false}
          showsScale={false}
          customMapStyle={[
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "poi.business",
              elementType: "all",
              stylers: [{ visibility: "on" }]
            }
          ]}
        >
          {restaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              coordinate={{
                latitude: restaurant.latitude,
                longitude: restaurant.longitude,
              }}
              title={restaurant.name}
              description={`Rating: ${restaurant.rating || 'No disponible'}`}
              pinColor="#FF0000"
            />
          ))}
        </MapView>
      ) : (
        <View style={[styles.listView, { backgroundColor: Colors[colorScheme].background }]}>
          <ThemedText style={styles.listText}>Explorar por lista</ThemedText>
        </View>
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 8,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  listView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listText: {
    fontSize: 20,
  },
}); 
