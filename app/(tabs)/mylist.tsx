import { StyleSheet, Dimensions, TextInput, View, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import Constants from 'expo-constants';
import { useState } from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function MyListScreen() {
  const [activeView, setActiveView] = useState('favoritos');
  const [searchText, setSearchText] = useState('');
  const colorScheme = useColorScheme() ?? 'light';

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
      <View style={[styles.contentView, { backgroundColor: Colors[colorScheme].background }]}>
        <ThemedText style={styles.contentText}>
          {activeView === 'favoritos' ? 'Favoritos' : 'Pendientes'}
        </ThemedText>
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
  contentView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 20,
  },
}); 