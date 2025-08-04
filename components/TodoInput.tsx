import { createHomeStyles } from "@/assets/styles/home.styles";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import CategoryPicker from "./CategoryPicker";
import PriorityPicker from "./PriorityPicker";

type Priority = "urgent" | "high" | "medium" | "low";
type Category = "work" | "personal" | "health" | "learning" | "shopping" | "travel";

const TodoInput = () => {
  const { colors } = useTheme();
  const [newTodo, setNewTodo] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<Priority>("medium");
  const [selectedCategory, setSelectedCategory] = useState<Category>("personal");
  const [showOptions, setShowOptions] = useState(false);
  const addTodo = useMutation(api.todos.addTodo);
  
  // Safety check - if colors not ready, return null
  if (!colors) {
    return null;
  }
  
  const homeStyles = createHomeStyles(colors);

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await addTodo({ 
          text: newTodo.trim(),
          priority: selectedPriority,
          category: selectedCategory,
        });
        setNewTodo("");
        setShowOptions(false);
      } catch (error) {
        console.log("Error adding a todo", error);
        console.error(error);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Error", "Failed to add todo. The database schema may need to be updated.");
      }
    }
  };

  const toggleOptions = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowOptions(!showOptions);
  };

  const styles = StyleSheet.create({
    optionsContainer: {
      marginTop: colors.spacing.lg,
      paddingHorizontal: colors.spacing.xl,
      backgroundColor: colors.surface,
      borderRadius: colors.borderRadius.lg,
      padding: colors.spacing.lg,
      marginHorizontal: colors.spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      ...colors.shadows.sm,
    },
    optionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: colors.spacing.md,
    },
    optionsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: colors.spacing.lg,
      paddingVertical: colors.spacing.md,
      borderRadius: colors.borderRadius.lg,
      backgroundColor: colors.bg,
      borderWidth: 1,
      borderColor: colors.border,
      ...colors.shadows.sm,
    },
    optionsText: {
      fontSize: 13,
      fontWeight: '600',
      marginLeft: colors.spacing.sm,
      color: colors.textMuted,
      letterSpacing: 0.1,
    },
  });

  return (
    <View style={homeStyles.inputSection}>
      <View style={homeStyles.inputWrapper}>
        <TextInput
          style={[homeStyles.input, isFocused && homeStyles.inputFocused]}
          placeholder="What's your next win? ✨"
          value={newTodo}
          onChangeText={setNewTodo}
          onSubmitEditing={handleAddTodo}
          onFocus={() => {
            setIsFocused(true);
            setShowOptions(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={colors.textMuted}
        />
        
        <TouchableOpacity 
          onPress={toggleOptions} 
          activeOpacity={0.8}
          style={{
            width: 44,
            height: 44,
            borderRadius: colors.borderRadius.md,
            backgroundColor: colors.bg,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            ...colors.shadows.sm,
          }}
        >
          <Ionicons name="options" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleAddTodo} activeOpacity={0.8} disabled={!newTodo.trim()}>
          <LinearGradient
            colors={newTodo.trim() ? colors.gradients.primary : colors.gradients.muted}
            style={[homeStyles.addButton, !newTodo.trim() && homeStyles.addButtonDisabled]}
          >
            <Ionicons name="add" size={22} color="#ffffff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {showOptions && colors && (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <PriorityPicker
              selectedPriority={selectedPriority}
              onPriorityChange={setSelectedPriority}
              style={{ flex: 1, marginRight: 8 }}
            />
          </View>
          <CategoryPicker
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </View>
      )}
    </View>
  );
};

export default TodoInput;