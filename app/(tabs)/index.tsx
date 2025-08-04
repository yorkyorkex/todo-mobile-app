import CelebrationAnimation from "@/components/CelebrationAnimation";
import CategoryOverviewCard from "@/components/CategoryOverviewCard";
import EmptyState from "@/components/EmptyState";
import FloatingActionButton from "@/components/FloatingActionButton";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import SwipeableCard from "@/components/SwipeableCard";
import TaskCard from "@/components/TaskCard";
import TaskEditModal from "@/components/TaskEditModal";
import TodoInput from "@/components/TodoInput";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeOutRight } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

type Todo = Doc<"todos">;

export default function Index() {
  const { colors } = useTheme();
  const [showCelebration, setShowCelebration] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState<"active" | "done">("active");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Todo | null>(null);
  
  const todos = useQuery(api.todos.getTodos, { sortBy: "priority" });
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const updateTodo = useMutation(api.todos.updateTodo);
  const addTodo = useMutation(api.todos.addTodo);

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
    setSelectedTask(todo);
    setShowEditModal(true);
  };

  const handleEditModalSave = async (taskData: any) => {
    try {
      if (taskData.id) {
        // Updating existing task
        await updateTodo({ 
          id: taskData.id, 
          text: taskData.text,
          priority: taskData.priority,
          category: taskData.category,
          progress: taskData.progress,
          notes: taskData.notes,
          estimatedDuration: taskData.estimatedDuration
        });
      } else {
        // Creating new task
        await addTodo({
          text: taskData.text,
          priority: taskData.priority,
          category: taskData.category,
          progress: taskData.progress || 0,
          notes: taskData.notes,
          estimatedDuration: taskData.estimatedDuration
        });
      }
    } catch (error) {
      console.log("Error saving task", error);
      Alert.alert("Error", "Failed to save task");
    }
  };

  const handleEditModalDelete = async (taskId: string) => {
    try {
      await deleteTodo({ id: taskId as Id<"todos"> });
    } catch (error) {
      console.log("Error deleting task", error);
      Alert.alert("Error", "Failed to delete task");
    }
  };

  const handleEditModalToggleComplete = async (taskId: string) => {
    try {
      await toggleTodo({ id: taskId as Id<"todos"> });
    } catch (error) {
      console.log("Error toggling task", error);
      Alert.alert("Error", "Failed to toggle task");
    }
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



  const fabActions = [
    {
      icon: "flash" as keyof typeof Ionicons.glyphMap,
      label: "Quick Task",
      color: colors.warning,
      gradient: colors.gradients.warning,
      onPress: () => {
        setSelectedTask(null);
        setShowEditModal(true);
      },
    },
    {
      icon: "mic" as keyof typeof Ionicons.glyphMap,
      label: "Voice Note",
      color: colors.primary,
      gradient: colors.gradients.primary,
      onPress: () => {
        Alert.alert("Voice Input", "Voice input feature coming soon!");
      },
    },
    {
      icon: "camera" as keyof typeof Ionicons.glyphMap,
      label: "Photo",
      color: colors.success,
      gradient: colors.gradients.success,
      onPress: () => {
        Alert.alert("Photo OCR", "Photo text recognition coming soon!");
      },
    },
  ];

  // Group todos by category for overview cards
  const getCategories = () => {
    if (!todos) return [];
    
    const categoryData = {
      work: { count: 0, completed: 0 },
      personal: { count: 0, completed: 0 },
      health: { count: 0, completed: 0 },
      learning: { count: 0, completed: 0 },
      shopping: { count: 0, completed: 0 },
      travel: { count: 0, completed: 0 },
    };

    todos.forEach(todo => {
      const category = todo.category || 'personal';
      if (categoryData[category as keyof typeof categoryData]) {
        categoryData[category as keyof typeof categoryData].count++;
        if (todo.isCompleted) {
          categoryData[category as keyof typeof categoryData].completed++;
        }
      }
    });

    return Object.entries(categoryData)
      .filter(([_, data]) => data.count > 0)
      .map(([category, data]) => ({
        category,
        ...data,
      }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'work': return 'briefcase';
      case 'personal': return 'person';
      case 'health': return 'fitness';
      case 'learning': return 'library';
      case 'shopping': return 'bag';
      case 'travel': return 'airplane';
      default: return 'list';
    }
  };

  const categories = getCategories();
  
  // Filter todos based on search text and category
  const filteredTodos = todos?.filter(todo => {
    // Search filter
    if (searchText && !todo.text.toLowerCase().includes(searchText.toLowerCase()) &&
        !todo.category?.toLowerCase().includes(searchText.toLowerCase()) &&
        !todo.priority?.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (categoryFilter && todo.category !== categoryFilter) {
      return false;
    }
    
    return true;
  }) || [];
  
  // Apply active filter
  const displayTodos = activeFilter === "active" 
    ? filteredTodos.filter(todo => !todo.isCompleted)
    : filteredTodos.filter(todo => todo.isCompleted);
    
  const ongoingTodos = filteredTodos.filter(todo => !todo.isCompleted) || [];
  const completedTodos = filteredTodos.filter(todo => todo.isCompleted) || [];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    scrollContainer: {
      flex: 1,
    },
    categorySection: {
      paddingHorizontal: colors.spacing.lg,
      marginBottom: colors.spacing.lg,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.text,
      marginBottom: colors.spacing.lg,
      letterSpacing: 0.3,
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: colors.spacing.md,
    },
    categoryCardWrapper: {
      width: '47%',
      marginBottom: colors.spacing.md,
    },
    ongoingSection: {
      marginBottom: colors.spacing.lg,
    },
    completedSection: {
      marginBottom: 120,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: colors.spacing.md,
      paddingHorizontal: colors.spacing.lg,
    },
    seeAllButton: {
      paddingHorizontal: colors.spacing.md + 2,
      paddingVertical: colors.spacing.sm,
      borderRadius: colors.borderRadius.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      ...colors.shadows.sm,
    },
    seeAllText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '700',
      letterSpacing: 0.2,
    },
  });

  return (
    <LinearGradient colors={colors.gradients.background} style={styles.container}>
      <StatusBar barStyle={colors.statusBarStyle} />
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Header 
            onSearch={(text) => setSearchText(text)}
            onAddTask={() => {
              setSelectedTask(null);
              setShowEditModal(true);
            }}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          <TodoInput />

          {/* Category Overview Cards */}
          {categories.length > 0 && (
            <View style={styles.categorySection}>
              <View style={styles.categoryGrid}>
                {categories.map((category) => (
                  <View key={category.category} style={styles.categoryCardWrapper}>
                    <CategoryOverviewCard
                      category={category.category}
                      taskCount={category.count}
                      completedCount={category.completed}
                      icon={getCategoryIcon(category.category) as keyof typeof Ionicons.glyphMap}
                      onPress={() => {
                        setCategoryFilter(categoryFilter === category.category ? "" : category.category);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Main Tasks Section */}
          <View style={styles.ongoingSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {activeFilter === "active" ? "Active Tasks" : "Completed Tasks"}
                {displayTodos.length > 0 && ` (${displayTodos.length})`}
              </Text>
            </View>

            {displayTodos.length > 0 ? (
              displayTodos.map((item, index) => (
                <TaskCard
                  key={item._id}
                  task={{
                    _id: item._id,
                    text: item.text,
                    priority: item.priority || 'medium',
                    category: item.category || 'personal',
                    progress: activeFilter === "done" ? 100 : (item.progress || 0),
                    dueDate: item.dueDate,
                    isCompleted: item.isCompleted,
                    estimatedDuration: item.estimatedDuration
                  }}
                  onSave={async (text) => {
                    try {
                      await updateTodo({ id: item._id, text });
                    } catch (error) {
                      console.log("Error updating todo", error);
                    }
                  }}
                  onDelete={() => handleDeleteTodo(item._id)}
                  onToggle={() => handleToggleTodo(item._id)}
                  showAvatars={activeFilter === "active" && index < 2} // Show avatars on first 2 active tasks
                />
              ))
            ) : (
              <EmptyState />
            )}
          </View>
        </ScrollView>

        <FloatingActionButton actions={Array.isArray(fabActions) ? fabActions : []} />
        
        <CelebrationAnimation
          visible={showCelebration}
          onComplete={() => setShowCelebration(false)}
          type="confetti"
        />
        
        <TaskEditModal
          visible={showEditModal}
          task={selectedTask || undefined}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTask(null);
          }}
          onSave={handleEditModalSave}
          onDelete={handleEditModalDelete}
          onToggleComplete={handleEditModalToggleComplete}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}