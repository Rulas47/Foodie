import { StyleSheet, Dimensions, TextInput, View, TouchableOpacity, FlatList } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import Constants from 'expo-constants';
import { useState, useEffect } from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getRestaurants, SavedRestaurant, removeRestaurant } from '@/utils/storage';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function MyListScreen() {
  const [activeView, setActiveView] = useState('favoritos');
  const [searchText, setSearchText] = useState('');
  const [restaurants, setRestaurants] = useState<SavedRestaurant[]>([]);
  const colorScheme = useColorScheme() ?? 'light';

  useEffect(() => {
    loadRestaurants();
  }, [activeView]);

  const loadRestaurants = async () => {
    const loadedRestaurants = await getRestaurants(activeView as 'favoritos' | 'pendientes');
    setRestaurants(loadedRestaurants);
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleRestaurantPress = (restaurant: SavedRestaurant) => {
    router.push({
      pathname: '/restaurant-details',
      params: {
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        rating: restaurant.rating,
        phone: restaurant.phone,
        website: restaurant.website
      }
    });
  };

  const handleRemoveRestaurant = async (restaurantId: string) => {
    await removeRestaurant(restaurantId, activeView as 'favoritos' | 'pendientes');
    loadRestaurants();
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
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <View style={[styles.buttonContainer, { backgroundColor: colorScheme === 'light' ? '#f5f5f5' : '#2a2a2a' }]}>
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.buttonLeft, 
              { backgroundColor: Colors[colorScheme].background },
              activeView === 'favoritos' && styles.activeButton
            ]}
            onPress={() => setActiveView('favoritos')}
          >
            <ThemedText style={[styles.buttonText, activeView === 'favoritos' && styles.activeButtonText]}>
              Favoritos
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.buttonRight, 
              { backgroundColor: Colors[colorScheme].background },
              activeView === 'pendientes' && styles.activeButton
            ]}
            onPress={() => setActiveView('pendientes')}
          >
            <ThemedText style={[styles.buttonText, activeView === 'pendientes' && styles.activeButtonText]}>
              Pendientes
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.listView, { backgroundColor: Colors[colorScheme].background }]}>
        <FlatList
          data={filteredRestaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.restaurantItem, { 
                backgroundColor: colorScheme === 'light' ? '#f5f5f5' : '#2a2a2a',
                borderColor: colorScheme === 'light' ? '#ddd' : '#444'
              }]}
              onPress={() => handleRestaurantPress(item)}
            >
              <View style={styles.restaurantInfo}>
                <ThemedText style={styles.restaurantName}>{item.name}</ThemedText>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveRestaurant(item.id)}
                >
                  <IconSymbol name="trash" size={20} color="#FF4444" />
                </TouchableOpacity>
              </View>
              <View style={styles.restaurantDetails}>
                <ThemedText style={styles.restaurantAddress}>{item.address}</ThemedText>
                {item.rating && (
                  <ThemedText style={styles.restaurantRating}>
                    ⭐ {item.rating.toFixed(1)}
                  </ThemedText>
                )}
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>
                No hay restaurantes en {activeView === 'favoritos' ? 'favoritos' : 'pendientes'}
              </ThemedText>
            </View>
          )}
        />
      </View>
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
  restaurantInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  restaurantDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  restaurantRating: {
    fontSize: 14,
    color: '#FFD700',
    marginLeft: 10,
  },
  removeButton: {
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 