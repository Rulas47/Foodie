import { StyleSheet, View, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function RestaurantDetailsScreen() {
  const { name, address, rating, phone, website } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';

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

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: name as string,
          headerShown: true,
        }}
      />
      <View style={styles.content}>
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <ThemedText type="title" style={{ color: theme.text }}>{name}</ThemedText>
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
}); 