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
      marginTop: 12,
      paddingHorizontal: 24,
    },
    optionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    optionsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    optionsText: {
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 4,
      color: colors.textMuted,
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
        
        <TouchableOpacity onPress={toggleOptions} activeOpacity={0.8}>
          <LinearGradient
            colors={colors.gradients.muted}
            style={styles.optionsButton}
          >
            <Ionicons name="options" size={16} color={colors.textMuted} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleAddTodo} activeOpacity={0.8} disabled={!newTodo.trim()}>
          <LinearGradient
            colors={newTodo.trim() ? colors.gradients.primary : colors.gradients.muted}
            style={[homeStyles.addButton, !newTodo.trim() && homeStyles.addButtonDisabled]}
          >
            <Ionicons name="add" size={24} color="#ffffff" />
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