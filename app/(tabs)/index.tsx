import { createHomeStyles } from "@/assets/styles/home.styles";
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import TodoInput from "@/components/TodoInput";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Alert, FlatList, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { 
  FadeInDown, 
  FadeOutRight
} from 'react-native-reanimated';
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import SwipeableCard from "@/components/SwipeableCard";
import FloatingActionButton from "@/components/FloatingActionButton";
import CelebrationAnimation from "@/components/CelebrationAnimation";

type Todo = Doc<"todos">;

export default function Index() {
  const { colors } = useTheme();

  const [editingId, setEditingId] = useState<Id<"todos"> | null>(null);
  const [editText, setEditText] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);

  const homeStyles = createHomeStyles(colors);

  const todos = useQuery(api.todos.getTodos, { sortBy: "priority" });
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const updateTodo = useMutation(api.todos.updateTodo);

  const isLoading = todos === undefined;

  if (isLoading) return <LoadingSpinner />;

  const handleToggleTodo = async (id: Id<"todos">) => {
    try {
      const todo = todos?.find(t => t._id === id);
      const isCompleting = todo && !todo.isCompleted;
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await toggleTodo({ id });
      
      // Show celebration for completing high/urgent priority tasks
      if (isCompleting && todo && (todo.priority === "high" || todo.priority === "urgent")) {
        setShowCelebration(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.log("Error toggling todo", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Failed to toggle todo");
    }
  };

  const handleDeleteTodo = async (id: Id<"todos">) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          deleteTodo({ id });
        }
      },
    ]);
  };

  const handleQuickComplete = async (id: Id<"todos">) => {
    try {
      const todo = todos?.find(t => t._id === id);
      const isCompleting = todo && !todo.isCompleted;
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await toggleTodo({ id });
      
      // Show celebration for completing any task via swipe
      if (isCompleting && todo) {
        setShowCelebration(true);
      }
    } catch (error) {
      console.log("Error completing todo", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleQuickDelete = async (id: Id<"todos">) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await deleteTodo({ id });
    } catch (error) {
      console.log("Error deleting todo", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditText(todo.text);
    setEditingId(todo._id);
  };

  const handleSaveEdit = async () => {
    if (editingId) {
      try {
        await updateTodo({ id: editingId, text: editText.trim() });
        setEditingId(null);
        setEditText("");
      } catch (error) {
        console.log("Error updating todo", error);
        Alert.alert("Error", "Failed to update todo");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent": return "warning";
      case "high": return "chevron-up";
      case "medium": return "remove";
      case "low": return "chevron-down";
      default: return "remove";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "work": return "briefcase";
      case "personal": return "person";
      case "health": return "fitness";
      case "learning": return "library";
      case "shopping": return "bag";
      case "travel": return "airplane";
      default: return "person";
    }
  };

  const renderTodoItem = ({ item, index }: { item: Todo, index: number }) => {
    // Safety check for item
    if (!item || !item._id) {
      return null;
    }

    const isEditing = editingId === item._id;

    const leftAction = {
      icon: item.isCompleted ? "close-circle" : "checkmark-circle",
      color: item.isCompleted ? colors.warning : colors.success,
      gradient: item.isCompleted ? colors.gradients.warning : colors.gradients.success,
      action: () => handleQuickComplete(item._id),
      text: item.isCompleted ? "Undo" : "Done",
    };

    const rightActions = [
      {
        icon: "trash" as keyof typeof Ionicons.glyphMap,
        color: colors.danger,
        gradient: colors.gradients.danger,
        action: () => handleQuickDelete(item._id),
        text: "Delete",
      },
    ];

    return (
      <Animated.View 
        style={homeStyles.todoItemWrapper}
        entering={FadeInDown.delay(index * 100).springify()}
        exiting={FadeOutRight.springify()}
      >
        <SwipeableCard
          leftAction={leftAction}
          rightActions={rightActions}
        >
          <LinearGradient
            colors={colors.gradients.surface}
            style={[
              homeStyles.todoItem,
              { borderLeftWidth: 4, borderLeftColor: item.priority ? colors.priority[item.priority as keyof typeof colors.priority] : colors.primary }
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
          <TouchableOpacity
            style={homeStyles.checkbox}
            activeOpacity={0.7}
            onPress={() => handleToggleTodo(item._id)}
          >
            <LinearGradient
              colors={item.isCompleted ? colors.gradients.success : colors.gradients.muted}
              style={[
                homeStyles.checkboxInner,
                { borderColor: item.isCompleted ? "transparent" : colors.border },
              ]}
            >
              {item.isCompleted && <Ionicons name="checkmark" size={18} color="#fff" />}
            </LinearGradient>
          </TouchableOpacity>

          {isEditing ? (
            <View style={homeStyles.editContainer}>
              <TextInput
                style={homeStyles.editInput}
                value={editText}
                onChangeText={setEditText}
                autoFocus
                multiline
                placeholder="Edit your todo..."
                placeholderTextColor={colors.textMuted}
              />
              <View style={homeStyles.editButtons}>
                <TouchableOpacity onPress={handleSaveEdit} activeOpacity={0.8}>
                  <LinearGradient colors={colors.gradients.success} style={homeStyles.editButton}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                    <Text style={homeStyles.editButtonText}>Save</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleCancelEdit} activeOpacity={0.8}>
                  <LinearGradient colors={colors.gradients.muted} style={homeStyles.editButton}>
                    <Ionicons name="close" size={16} color="#fff" />
                    <Text style={homeStyles.editButtonText}>Cancel</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={homeStyles.todoTextContainer}>
              <Text
                style={[
                  homeStyles.todoText,
                  item.isCompleted && {
                    textDecorationLine: "line-through",
                    color: colors.textMuted,
                    opacity: 0.6,
                  },
                ]}
              >
                {item.text}
              </Text>

              {/* Priority and Category Indicators */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 12 }}>
                {/* Priority Chip */}
                {item.priority && (
                  <LinearGradient
                    colors={colors.gradients[item.priority as keyof typeof colors.gradients] || colors.gradients.medium}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                      marginRight: 8,
                    }}
                  >
                    <Ionicons 
                      name={getPriorityIcon(item.priority) as keyof typeof Ionicons.glyphMap} 
                      size={12} 
                      color="#fff" 
                    />
                    <Text style={{ 
                      fontSize: 10, 
                      fontWeight: '600', 
                      color: '#fff', 
                      marginLeft: 4,
                      textTransform: 'capitalize' 
                    }}>
                      {item.priority}
                    </Text>
                  </LinearGradient>
                )}

                {/* Category Chip */}
                {item.category && (
                  <LinearGradient
                    colors={colors.gradients[item.category as keyof typeof colors.gradients] || colors.gradients.personal}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}
                  >
                    <Ionicons 
                      name={getCategoryIcon(item.category) as keyof typeof Ionicons.glyphMap} 
                      size={12} 
                      color="#fff" 
                    />
                    <Text style={{ 
                      fontSize: 10, 
                      fontWeight: '600', 
                      color: '#fff', 
                      marginLeft: 4,
                      textTransform: 'capitalize' 
                    }}>
                      {item.category}
                    </Text>
                  </LinearGradient>
                )}
              </View>

              <View style={homeStyles.todoActions}>
                <TouchableOpacity onPress={() => handleEditTodo(item)} activeOpacity={0.8}>
                  <LinearGradient colors={colors.gradients.warning} style={homeStyles.actionButton}>
                    <Ionicons name="pencil" size={14} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteTodo(item._id)} activeOpacity={0.8}>
                  <LinearGradient colors={colors.gradients.danger} style={homeStyles.actionButton}>
                    <Ionicons name="trash" size={14} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
          </LinearGradient>
        </SwipeableCard>
      </Animated.View>
    );
  };

  const fabActions = [
    {
      icon: "flash" as keyof typeof Ionicons.glyphMap,
      label: "Quick Task",
      color: colors.warning,
      gradient: colors.gradients.warning,
      onPress: () => {
        // Add a quick task with high priority
        console.log("Quick task");
      },
    },
    {
      icon: "mic" as keyof typeof Ionicons.glyphMap,
      label: "Voice Note",
      color: colors.primary,
      gradient: colors.gradients.primary,
      onPress: () => {
        // Voice input functionality
        console.log("Voice input");
      },
    },
    {
      icon: "camera" as keyof typeof Ionicons.glyphMap,
      label: "Photo",
      color: colors.success,
      gradient: colors.gradients.success,
      onPress: () => {
        // Camera OCR functionality
        console.log("Camera OCR");
      },
    },
  ];

  return (
    <LinearGradient colors={colors.gradients.background} style={homeStyles.container}>
      <StatusBar barStyle={colors.statusBarStyle} />
      <SafeAreaView style={homeStyles.safeArea}>
        <Header />

        <TodoInput />

        <FlatList
          data={Array.isArray(todos) ? todos : []}
          renderItem={({ item, index }) => renderTodoItem({ item, index })}
          keyExtractor={(item) => item?._id || `item-${index}`}
          style={homeStyles.todoList}
          contentContainerStyle={homeStyles.todoListContent}
          ListEmptyComponent={<EmptyState />}
          showsVerticalScrollIndicator={false}
        />

        <FloatingActionButton actions={Array.isArray(fabActions) ? fabActions : []} />
        
        <CelebrationAnimation
          visible={showCelebration}
          onComplete={() => setShowCelebration(false)}
          type="confetti"
        />
      </SafeAreaView>
    </LinearGradient>
  );
}