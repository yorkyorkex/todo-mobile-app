import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Category = "work" | "personal" | "health" | "learning" | "shopping" | "travel";

interface CategoryPickerProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
  style?: any;
}

const CategoryPicker = ({ selectedCategory, onCategoryChange, style }: CategoryPickerProps) => {
  const { colors } = useTheme();

  const categories: { value: Category; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { value: "work", label: "Work", icon: "briefcase" },
    { value: "personal", label: "Personal", icon: "person" },
    { value: "health", label: "Health", icon: "fitness" },
    { value: "learning", label: "Learning", icon: "library" },
    { value: "shopping", label: "Shopping", icon: "bag" },
    { value: "travel", label: "Travel", icon: "airplane" },
  ];

  // Safety check - if colors not ready, return null
  if (!colors) {
    return null;
  }

  const selectCategory = (category: Category) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChange(category);
  };

  const styles = StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    scrollView: {
      paddingHorizontal: 4,
    },
    categoryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      marginHorizontal: 4,
      borderWidth: 2,
      minWidth: 80,
    },
    categoryText: {
      fontSize: 13,
      fontWeight: '600',
      marginLeft: 6,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.value;
          return (
            <TouchableOpacity
              key={category.value}
              onPress={() => selectCategory(category.value)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isSelected ? colors.gradients[category.value] : ['transparent', 'transparent']}
                style={[
                  styles.categoryChip,
                  { 
                    borderColor: isSelected ? 'transparent' : colors.categories[category.value],
                    backgroundColor: isSelected ? 'transparent' : colors.surface,
                  }
                ]}
              >
                <Ionicons 
                  name={category.icon} 
                  size={16} 
                  color={isSelected ? '#fff' : colors.categories[category.value]} 
                />
                <Text style={[
                  styles.categoryText, 
                  { color: isSelected ? '#fff' : colors.categories[category.value] }
                ]}>
                  {category.label}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CategoryPicker;