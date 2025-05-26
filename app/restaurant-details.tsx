import { StyleSheet, View, TouchableOpacity, Linking, Dimensions, Alert, Modal } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useState, useEffect } from 'react';
import { saveRestaurant, getRestaurants, SavedRestaurant, removeRestaurant } from '@/utils/storage';

export default function RestaurantDetailsScreen() {
  const { id, name, address, rating, phone, website } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const [isSaved, setIsSaved] = useState(false);
  const [savedList, setSavedList] = useState<'favoritos' | 'pendientes' | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    checkIfSaved();
  }, []);

  const checkIfSaved = async () => {
    const favoritos = await getRestaurants('favoritos');
    const pendientes = await getRestaurants('pendientes');
    
    const inFavoritos = favoritos.some(r => r.id === id);
    const inPendientes = pendientes.some(r => r.id === id);
    
    setIsSaved(inFavoritos || inPendientes);
    if (inFavoritos) setSavedList('favoritos');
    else if (inPendientes) setSavedList('pendientes');
  };

  const handleSave = async (list: 'favoritos' | 'pendientes') => {
    const restaurant: SavedRestaurant = {
      id: id as string,
      name: name as string,
      address: address as string,
      rating: rating ? Number(rating) : undefined,
      phone: phone as string,
      website: website as string,
      list
    };

    await saveRestaurant(restaurant);
    setIsSaved(true);
    setSavedList(list);
    setShowMenu(false);
    Alert.alert('Éxito', `Restaurante guardado en ${list}`);
  };

  const handleRemove = async () => {
    if (savedList) {
      await removeRestaurant(id as string, savedList);
      setIsSaved(false);
      setSavedList(null);
      setShowMenu(false);
      Alert.alert('Éxito', 'Restaurante eliminado de la lista');
    }
  };

  const isDark = colorScheme === 'dark';
  const theme = {
    background: isDark ? '#1a1a1a' : '#f5f5f5',
    card: isDark ? '#2d2d2d' : 'white',
    text: isDark ? '#ffffff' : '#000000',
    button: isDark ? '#2196F3' : '#1976D2',
    ratingBg: isDark ? '#332d00' : '#FFF9E6',
    contactBg: isDark ? '#1a237e' : '#E3F2FD',
    contactText: isDark ? '#90caf9' : '#1976D2',
  };

  const handlePhonePress = () => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleWebsitePress = () => {
    if (website) {
      Linking.openURL(website as string);
    }
  };

  const renderMenu = () => (
    <Modal
      visible={showMenu}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowMenu(false)}
    >
      <TouchableOpacity 
        style={styles.menuOverlay}
        activeOpacity={1}
        onPress={() => setShowMenu(false)}
      >
        <View style={[styles.menuContainer, { backgroundColor: theme.card }]}>
          {isSaved ? (
            <TouchableOpacity 
              style={[styles.menuItem, { borderBottomColor: theme.text + '20' }]}
              onPress={handleRemove}
            >
              <IconSymbol name="trash" size={20} color="#FF4444" />
              <ThemedText style={[styles.menuItemText, { color: '#FF4444' }]}>
                Quitar de {savedList === 'favoritos' ? 'Favoritos' : 'Pendientes'}
              </ThemedText>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity 
                style={[styles.menuItem, { borderBottomColor: theme.text + '20' }]}
                onPress={() => handleSave('favoritos')}
              >
                <IconSymbol name="star" size={20} color="#FFD700" />
                <ThemedText style={[styles.menuItemText, { color: theme.text }]}>
                  Añadir a Favoritos
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleSave('pendientes')}
              >
                <IconSymbol name="clock" size={20} color="#00BFA5" />
                <ThemedText style={[styles.menuItemText, { color: theme.text }]}>
                  Añadir a Pendientes
                </ThemedText>
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: name as string,
          headerShown: true,
        }}
      />
      {renderMenu()}
      <View style={styles.content}>
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
              <ThemedText type="title" style={{ color: theme.text }}>{name}</ThemedText>
              {savedList && (
                <View style={[styles.savedBadge, { backgroundColor: savedList === 'favoritos' ? '#FFD700' : '#00BFA5' }]}>
                  <ThemedText style={styles.savedText}>
                    {savedList === 'favoritos' ? 'Favorito' : 'Pendiente'}
                  </ThemedText>
                </View>
              )}
            </View>
            <TouchableOpacity 
              style={[
                styles.saveButton,
                { backgroundColor: isSaved ? (savedList === 'favoritos' ? '#FFD700' : '#00BFA5') : '#2196F3' }
              ]} 
              onPress={() => setShowMenu(true)}
            >
              <IconSymbol 
                name={isSaved ? "checkmark" : "plus"} 
                size={20} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
          {rating && (
            <View style={[styles.ratingContainer, { backgroundColor: theme.ratingBg }]}>
              <IconSymbol name="star.fill" size={20} color="#FFD700" />
              <ThemedText style={styles.ratingText}>{rating}</ThemedText>
            </View>
          )}
        </View>

        {address && (
          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <ThemedText type="defaultSemiBold" style={{ color: theme.text }}>Dirección</ThemedText>
            <ThemedText style={{ color: theme.text }}>{address}</ThemedText>
          </View>
        )}

        {phone && (
          <TouchableOpacity style={[styles.section, { backgroundColor: theme.card }]} onPress={handlePhonePress}>
            <ThemedText type="defaultSemiBold" style={{ color: theme.text }}>Teléfono</ThemedText>
            <View style={[styles.contactContainer, { backgroundColor: theme.contactBg }]}>
              <IconSymbol name="phone.fill" size={20} color={theme.contactText} />
              <ThemedText style={[styles.contactText, { color: theme.contactText }]}>{phone}</ThemedText>
            </View>
          </TouchableOpacity>
        )}

        {website && (
          <TouchableOpacity style={[styles.section, { backgroundColor: theme.card }]} onPress={handleWebsitePress}>
            <ThemedText type="defaultSemiBold" style={{ color: theme.text }}>Sitio Web</ThemedText>
            <TouchableOpacity 
              style={[styles.websiteButton, { backgroundColor: theme.button }]} 
              onPress={handleWebsitePress}
            >
              <IconSymbol name="globe" size={20} color="white" />
              <ThemedText style={styles.buttonText}>Visitar Sitio Web</ThemedText>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    flex: 1,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  contactText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  saveButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  savedBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  savedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 10,
  },
  menuContainer: {
    width: 250,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
}); 