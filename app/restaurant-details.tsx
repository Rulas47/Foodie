import { StyleSheet, View, TouchableOpacity, Linking } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function RestaurantDetailsScreen() {
  const { name, address, rating, priceLevel, phone, website } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';

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

  const getPriceLevelText = (level: string) => {
    const priceLevel = parseInt(level);
    if (isNaN(priceLevel)) return 'No disponible';
    return '$'.repeat(priceLevel);
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: name as string,
          headerShown: true,
        }}
      />
      <View style={styles.content}>
        <View style={styles.section}>
          <ThemedText type="title">{name}</ThemedText>
          {rating && (
            <View style={styles.ratingContainer}>
              <IconSymbol name="star.fill" size={20} color="#FFD700" />
              <ThemedText style={styles.ratingText}>{rating}</ThemedText>
            </View>
          )}
          {priceLevel && (
            <ThemedText style={styles.priceLevel}>
              {getPriceLevelText(priceLevel as string)}
            </ThemedText>
          )}
        </View>

        {address && (
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold">Dirección</ThemedText>
            <ThemedText>{address}</ThemedText>
          </View>
        )}

        {phone && (
          <TouchableOpacity style={styles.section} onPress={handlePhonePress}>
            <ThemedText type="defaultSemiBold">Teléfono</ThemedText>
            <View style={styles.contactContainer}>
              <IconSymbol name="phone.fill" size={20} color={Colors[colorScheme].tint} />
              <ThemedText style={styles.contactText}>{phone}</ThemedText>
            </View>
          </TouchableOpacity>
        )}

        {website && (
          <TouchableOpacity style={styles.section} onPress={handleWebsitePress}>
            <ThemedText type="defaultSemiBold">Sitio Web</ThemedText>
            <View style={styles.contactContainer}>
              <IconSymbol name="globe" size={20} color={Colors[colorScheme].tint} />
              <ThemedText style={styles.contactText}>{website}</ThemedText>
            </View>
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
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#FFD700',
  },
  priceLevel: {
    marginTop: 8,
    fontSize: 16,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  contactText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#0a7ea4',
  },
}); 