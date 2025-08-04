import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import React, { useState, useEffect } from "react";
import { 
  Modal, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  ScrollView,
  Alert 
} from "react-native";
import Animated, { 
  useSharedValue, 
  withSpring, 
  useAnimatedStyle, 
  withTiming 
} from "react-native-reanimated";
import CategoryPicker from "./CategoryPicker";
import PriorityPicker from "./PriorityPicker";

interface TaskEditModalProps {
  visible: boolean;
  task?: {
    _id: string;
    text: string;
    priority: "urgent" | "high" | "medium" | "low";
    category: string;
    progress?: number;
    dueDate?: number;
    estimatedDuration?: number;
    notes?: string;
    isCompleted: boolean;
  };
  onClose: () => void;
  onSave: (taskData: any) => void;
  onDelete?: (taskId: string) => void;
  onToggleComplete?: (taskId: string) => void;
}

const TaskEditModal = ({
  visible,
  task,
  onClose,
  onSave,
  onDelete,
  onToggleComplete,
}: TaskEditModalProps) => {
  const { colors } = useTheme();
  const modalScale = useSharedValue(0);
  const modalOpacity = useSharedValue(0);
  
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"urgent" | "high" | "medium" | "low">("medium");
  const [category, setCategory] = useState("personal");
  const [progress, setProgress] = useState(0);
  const [notes, setNotes] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");

  useEffect(() => {
    if (visible) {
      modalScale.value = withSpring(1);
      modalOpacity.value = withTiming(1);
      
      if (task) {
        setTitle(task.text);
        setPriority(task.priority);
        setCategory(task.category);
        setProgress(task.progress || 0);
        setNotes(task.notes || "");
        setEstimatedDuration(task.estimatedDuration?.toString() || "");
      } else {
        // Reset for new task
        setTitle("");
        setPriority("medium");
        setCategory("personal");
        setProgress(0);
        setNotes("");
        setEstimatedDuration("");
      }
    } else {
      modalScale.value = withTiming(0);
      modalOpacity.value = withTiming(0);
    }
  }, [visible, task]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a task title");
      return;
    }

    const taskData = {
      text: title.trim(),
      priority,
      category,
      progress,
      notes: notes.trim(),
      estimatedDuration: estimatedDuration ? parseInt(estimatedDuration) : undefined,
    };

    if (task) {
      onSave({ id: task._id, ...taskData });
    } else {
      onSave(taskData);
    }
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };

  const handleDelete = () => {
    if (task && onDelete) {
      Alert.alert(
        "Delete Task",
        "Are you sure you want to delete this task?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              onDelete(task._id);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onClose();
            },
          },
        ]
      );
    }
  };

  const handleToggleComplete = () => {
    if (task && onToggleComplete) {
      onToggleComplete(task._id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onClose();
    }
  };

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: modalScale.value }],
    opacity: modalOpacity.value,
  }));

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: colors.spacing.xl,
      backdropFilter: 'blur(10px)',
    },
    modal: {
      width: '100%',
      maxWidth: 380,
      borderRadius: colors.borderRadius.lg,
      padding: colors.spacing.lg,
      maxHeight: '80%',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      ...colors.shadows.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: colors.spacing.xl,
    },
    title: {
      fontSize: 26,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: 0.3,
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: colors.borderRadius.md,
      backgroundColor: colors.bg,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      ...colors.shadows.sm,
    },
    inputSection: {
      marginBottom: colors.spacing.xl,
    },
    label: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: colors.spacing.md,
      letterSpacing: 0.1,
    },
    textInput: {
      borderRadius: colors.borderRadius.lg,
      padding: colors.spacing.lg,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.bg,
      borderWidth: 1,
      borderColor: colors.border,
      ...colors.shadows.sm,
    },
    multilineInput: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    progressSection: {
      marginBottom: 20,
    },
    progressSlider: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    progressValue: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: colors.spacing.xl,
      gap: colors.spacing.md,
    },
    button: {
      flex: 1,
      paddingVertical: colors.spacing.lg,
      paddingHorizontal: colors.spacing.xl,
      borderRadius: colors.borderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      ...colors.shadows.md,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#fff',
      letterSpacing: 0.2,
    },
    secondaryButton: {
      backgroundColor: colors.bg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    secondaryButtonText: {
      color: colors.text,
    },
    deleteButton: {
      backgroundColor: colors.danger,
    },
    completeButton: {
      backgroundColor: colors.success,
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.backgrounds.input,
      borderRadius: 12,
      padding: 12,
      marginTop: 8,
    },
    progressBar: {
      flex: 1,
      height: 6,
      backgroundColor: colors.border,
      borderRadius: 3,
      marginHorizontal: 12,
    },
    progressFill: {
      height: '100%',
      borderRadius: 3,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={modalAnimatedStyle}>
          <LinearGradient
            colors={colors.gradients.surface}
            style={styles.modal}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>
                  {task ? 'Edit Task' : 'Create Task'}
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Ionicons name="close" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              {/* Title Input */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Task Title</Text>
                <TextInput
                  style={styles.textInput}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter task title..."
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              {/* Priority Picker */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Priority</Text>
                <PriorityPicker
                  selectedPriority={priority}
                  onPriorityChange={setPriority}
                />
              </View>

              {/* Category Picker */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Category</Text>
                <CategoryPicker
                  selectedCategory={category as any}
                  onCategoryChange={setCategory as any}
                />
              </View>

              {/* Progress */}
              {task && (
                <View style={styles.progressSection}>
                  <Text style={styles.label}>Progress</Text>
                  <View style={styles.progressContainer}>
                    <Text style={styles.progressValue}>0%</Text>
                    <View style={styles.progressBar}>
                      <LinearGradient
                        colors={colors.gradients.primary}
                        style={[styles.progressFill, { width: `${progress}%` }]}
                      />
                    </View>
                    <Text style={styles.progressValue}>100%</Text>
                  </View>
                  <TextInput
                    style={[styles.textInput, { marginTop: 8 }]}
                    value={progress.toString()}
                    onChangeText={(text) => {
                      const value = parseInt(text) || 0;
                      setProgress(Math.max(0, Math.min(100, value)));
                    }}
                    placeholder="Progress (0-100)"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                  />
                </View>
              )}

              {/* Estimated Duration */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Estimated Duration (hours)</Text>
                <TextInput
                  style={styles.textInput}
                  value={estimatedDuration}
                  onChangeText={setEstimatedDuration}
                  placeholder="e.g., 2"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                />
              </View>

              {/* Notes */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Notes</Text>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add notes..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                {task && (
                  <>
                    <TouchableOpacity
                      style={[styles.button, styles.deleteButton]}
                      onPress={handleDelete}
                    >
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.completeButton]}
                      onPress={handleToggleComplete}
                    >
                      <Text style={styles.buttonText}>
                        {task.isCompleted ? 'Reopen' : 'Complete'}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.primary }]}
                  onPress={handleSave}
                >
                  <Text style={styles.buttonText}>
                    {task ? 'Update' : 'Create'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default TaskEditModal;