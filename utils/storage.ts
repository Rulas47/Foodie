import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedRestaurant {
  id: string;
  name: string;
  address: string;
  rating?: number;
  phone?: string;
  website?: string;
  list: 'favoritos' | 'pendientes';
}

const FAVORITOS_KEY = '@foodie_favoritos';
const PENDIENTES_KEY = '@foodie_pendientes';

export const saveRestaurant = async (restaurant: SavedRestaurant) => {
  try {
    const key = restaurant.list === 'favoritos' ? FAVORITOS_KEY : PENDIENTES_KEY;
    const existingData = await AsyncStorage.getItem(key);
    const restaurants = existingData ? JSON.parse(existingData) : [];
    
    // Verificar si el restaurante ya existe
    const exists = restaurants.some((r: SavedRestaurant) => r.id === restaurant.id);
    if (!exists) {
      restaurants.push(restaurant);
      await AsyncStorage.setItem(key, JSON.stringify(restaurants));
    }
  } catch (error) {
    console.error('Error saving restaurant:', error);
  }
};

export const getRestaurants = async (list: 'favoritos' | 'pendientes'): Promise<SavedRestaurant[]> => {
  try {
    const key = list === 'favoritos' ? FAVORITOS_KEY : PENDIENTES_KEY;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting restaurants:', error);
    return [];
  }
};

export const removeRestaurant = async (restaurantId: string, list: 'favoritos' | 'pendientes') => {
  try {
    const key = list === 'favoritos' ? FAVORITOS_KEY : PENDIENTES_KEY;
    const existingData = await AsyncStorage.getItem(key);
    if (existingData) {
      const restaurants = JSON.parse(existingData);
      const updatedRestaurants = restaurants.filter((r: SavedRestaurant) => r.id !== restaurantId);
      await AsyncStorage.setItem(key, JSON.stringify(updatedRestaurants));
    }
  } catch (error) {
    console.error('Error removing restaurant:', error);
  }
}; 