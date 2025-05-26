import { StyleSheet, Dimensions, TextInput, View, TouchableOpacity, FlatList, Animated } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import Constants from 'expo-constants';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { GOOGLE_MAPS_API_KEY } from '@/config/api';

interface Restaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  rating?: number;
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const fetchRestaurantDetails = async (placeId: string) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,rating,price_level&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching restaurant details:', error);
    return null;
  }
};

export default function TabTwoScreen() {
  const [activeView, setActiveView] = useState('map');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [location, setLocation] = useState({
    latitude: 40.416775,
    longitude: -3.703790,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentRegion, setCurrentRegion] = useState(location);
  const colorScheme = useColorScheme() ?? 'light';

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setLocation(newLocation);
      setCurrentRegion(newLocation);
      await fetchNearbyRestaurants(newLocation.latitude, newLocation.longitude);
    })();
  }, []);

  useEffect(() => {
    const filtered = restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRestaurants(filtered);

    // Centrar el mapa en el restaurante más cercano si hay resultados
    if (filtered.length > 0 && searchQuery.trim() !== '') {
      const closestRestaurant = filtered.reduce((closest, current) => {
        const closestDistance = calculateDistance(
          location.latitude,
          location.longitude,
          closest.latitude,
          closest.longitude
        );
        const currentDistance = calculateDistance(
          location.latitude,
          location.longitude,
          current.latitude,
          current.longitude
        );
        return currentDistance < closestDistance ? current : closest;
      });

      setCurrentRegion({
        latitude: closestRestaurant.latitude,
        longitude: closestRestaurant.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [searchQuery, restaurants]);

  const handleRegionChangeComplete = async (region: any) => {
    setCurrentRegion(region);
    await fetchNearbyRestaurants(region.latitude, region.longitude);
  };

  const fetchNearbyRestaurants = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=restaurant&key=${GOOGLE_MAPS_API_KEY}`
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
            placeholder="Buscar restaurantes..."
            placeholderTextColor={Colors[colorScheme].icon}
            value={searchQuery}
            onChangeText={setSearchQuery}
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
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={location}
            region={currentRegion}
            onRegionChangeComplete={handleRegionChangeComplete}
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
            {filteredRestaurants.map((restaurant) => (
              <Marker
                key={restaurant.id}
                coordinate={{
                  latitude: restaurant.latitude,
                  longitude: restaurant.longitude,
                }}
                title={restaurant.name}
                description={`Rating: ${restaurant.rating || 'No disponible'}`}
                pinColor="#FF0000"
                onPress={() => setSelectedRestaurant(restaurant)}
              />
            ))}
          </MapView>
          {selectedRestaurant && (
            <View style={[styles.infoCard, { backgroundColor: Colors[colorScheme].background }]}>
              <TouchableOpacity 
                style={styles.infoCardContent}
                onPress={async () => {
                  const details = await fetchRestaurantDetails(selectedRestaurant.id);
                  if (details) {
                    router.push({
                      pathname: '/restaurant-details',
                      params: {
                        id: selectedRestaurant.id,
                        name: details.name,
                        address: details.formatted_address,
                        rating: details.rating,
                        priceLevel: details.price_level,
                        phone: details.formatted_phone_number,
                        website: details.website
                      }
                    });
                  }
                }}
              >
                <ThemedText style={styles.infoCardTitle}>{selectedRestaurant.name}</ThemedText>
                {selectedRestaurant.rating && (
                  <ThemedText style={styles.infoCardRating}>⭐ {selectedRestaurant.rating.toFixed(1)}</ThemedText>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View style={[styles.listView, { backgroundColor: Colors[colorScheme].background }]}>
          <FlatList
            data={filteredRestaurants
              .map(restaurant => ({
                ...restaurant,
                distance: calculateDistance(
                  location.latitude,
                  location.longitude,
                  restaurant.latitude,
                  restaurant.longitude
                )
              }))
              .sort((a, b) => a.distance - b.distance)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.restaurantItem, { 
                  backgroundColor: colorScheme === 'light' ? '#f5f5f5' : '#2a2a2a',
                  borderColor: colorScheme === 'light' ? '#ddd' : '#444'
                }]}
                onPress={async () => {
                  const details = await fetchRestaurantDetails(item.id);
                  if (details) {
                    router.push({
                      pathname: '/restaurant-details',
                      params: {
                        id: item.id,
                        name: details.name,
                        address: details.formatted_address,
                        rating: details.rating,
                        priceLevel: details.price_level,
                        phone: details.formatted_phone_number,
                        website: details.website
                      }
                    });
                  }
                }}
              >
                <ThemedText style={styles.restaurantName}>{item.name}</ThemedText>
                <View style={styles.restaurantInfo}>
                  <ThemedText style={styles.restaurantDistance}>
                    {item.distance.toFixed(1)} km
                  </ThemedText>
                  {item.rating && (
                    <ThemedText style={styles.restaurantRating}>
                      ⭐ {item.rating.toFixed(1)}
                    </ThemedText>
                  )}
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContainer}
          />
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
  },
  listContainer: {
    padding: 10,
  },
  restaurantItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  restaurantDistance: {
    fontSize: 14,
    color: '#666',
  },
  restaurantRating: {
    fontSize: 14,
    color: '#FFD700',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  infoCardRating: {
    fontSize: 14,
    color: '#FFD700',
    marginLeft: 10,
  },
}); 
