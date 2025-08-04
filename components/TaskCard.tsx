import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  runOnJS,
  FadeInDown,
  FadeOutRight 
} from "react-native-reanimated";
import { AnimationHelpers, AnimationPresets } from "@/constants/animations";

interface TaskCardProps {
  task: {
    _id: string;
    text: string;
    priority: "urgent" | "high" | "medium" | "low";
    category: string;
    progress?: number;
    dueDate?: number;
    isCompleted: boolean;
    estimatedDuration?: number;
  };
  onSave?: (text: string) => void;
  onDelete?: () => void;
  onToggle?: () => void;
  showAvatars?: boolean;
}

const TaskCard = ({
  task,
  onSave,
  onDelete,
  onToggle,
  showAvatars = false,
}: TaskCardProps) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsEditing(true);
    setEditText(task.text);
  };

  const handleSave = () => {
    if (editText.trim()) {
      onSave?.(editText.trim());
      setIsEditing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(task.text);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onDelete?.();
  };

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Success animation for completion
    scale.value = withSpring(1.05, AnimationPresets.spring.bouncy, () => {
      scale.value = withSpring(1, AnimationPresets.spring.gentle);
    });
    
    onToggle?.();
  };

  const handlePressIn = () => {
    scale.value = withTiming(0.98, AnimationPresets.timing.fast);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, AnimationPresets.spring.gentle);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
    opacity: opacity.value,
  }));

  const getPriorityColor = () => {
    switch (task.priority) {
      case "urgent":
        return ["#ef4444", "#dc2626"];
      case "high":
        return ["#f59e0b", "#d97706"];
      case "medium":
        return ["#8b5cf6", "#7c3aed"];
      case "low":
        return ["#10b981", "#059669"];
      default:
        return ["#8b5cf6", "#7c3aed"];
    }
  };

  const getCategoryIcon = () => {
    switch (task.category) {
      case "work": return "briefcase";
      case "personal": return "person";
      case "health": return "fitness";
      case "learning": return "book";
      case "shopping": return "bag";
      case "travel": return "airplane";
      default: return "list";
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginHorizontal: colors.spacing.md,
      marginVertical: colors.spacing.xs,
    },
    card: {
      borderRadius: colors.borderRadius.lg,
      backgroundColor: colors.surface,
      ...colors.shadows.md,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      minHeight: 100,
    },
    priorityIndicator: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 2,
    },
    cardContent: {
      padding: colors.spacing.lg,
      paddingLeft: colors.spacing.lg + colors.spacing.sm,
      flex: 1,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: colors.spacing.md,
    },
    priorityBadge: {
      paddingHorizontal: colors.spacing.sm + 2,
      paddingVertical: colors.spacing.xs + 1,
      borderRadius: colors.borderRadius.md,
      alignSelf: 'flex-start',
      opacity: 0.9,
    },
    priorityText: {
      fontSize: 10,
      fontWeight: '700',
      color: '#ffffff',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    completeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: task.isCompleted ? colors.success : colors.surface,
      borderWidth: 2,
      borderColor: task.isCompleted ? colors.success : colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      ...colors.shadows.sm,
    },
    mainContent: {
      flex: 1,
      marginBottom: colors.spacing.lg,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      lineHeight: 24,
      marginBottom: colors.spacing.md,
      letterSpacing: 0.1,
    },
    completedTitle: {
      textDecorationLine: 'line-through',
      opacity: 0.5,
      color: colors.textMuted,
    },
    editInput: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      backgroundColor: colors.backgrounds.editInput,
      borderRadius: colors.borderRadius.md,
      paddingHorizontal: colors.spacing.md,
      paddingVertical: colors.spacing.sm + 2,
      borderWidth: 1,
      borderColor: colors.primary,
      marginBottom: colors.spacing.md,
      ...colors.shadows.sm,
    },
    categoryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: colors.spacing.md,
    },
    categoryIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: `${colors.primary}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: colors.spacing.sm,
    },
    categoryText: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textMuted,
      textTransform: 'capitalize',
      letterSpacing: 0.2,
    },
    bottomRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      position: 'absolute',
      bottom: colors.spacing.lg,
      right: colors.spacing.lg,
    },
    actionButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: colors.spacing.sm,
    },
    editButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: colors.spacing.sm,
    },
    actionButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      ...colors.shadows.sm,
    },
    deleteButton: {
      backgroundColor: `${colors.danger}10`,
      borderColor: `${colors.danger}30`,
    },
    saveButton: {
      backgroundColor: `${colors.success}10`,
      borderColor: `${colors.success}30`,
    },
    cancelButton: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
  });

  return (
    <Animated.View 
      style={[styles.container, animatedStyle]}
      entering={FadeInDown.delay(100).springify()}
      exiting={FadeOutRight.duration(300)}
    >
      <TouchableOpacity 
        style={styles.card}
        activeOpacity={0.95}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Priority Indicator */}
        <LinearGradient
          colors={getPriorityColor()}
          style={styles.priorityIndicator}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        
        <View style={styles.cardContent}>
          {/* Top Row */}
          <View style={styles.topRow}>
            <LinearGradient
              colors={getPriorityColor()}
              style={styles.priorityBadge}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.priorityText}>{task.priority}</Text>
            </LinearGradient>

            <TouchableOpacity 
              style={styles.completeButton} 
              onPress={handleToggle}
              activeOpacity={0.8}
            >
              {task.isCompleted && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={editText}
                onChangeText={setEditText}
                autoFocus
                multiline
                placeholder="Edit task..."
                placeholderTextColor={colors.textMuted}
              />
            ) : (
              <Text style={[styles.title, task.isCompleted && styles.completedTitle]}>
                {task.text}
              </Text>
            )}

            {/* Category */}
            <View style={styles.categoryRow}>
              <View style={styles.categoryIcon}>
                <Ionicons 
                  name={getCategoryIcon() as keyof typeof Ionicons.glyphMap} 
                  size={14} 
                  color={colors.primary} 
                />
              </View>
              <Text style={styles.categoryText}>
                {task.category || 'personal'}
              </Text>
            </View>
          </View>

          {/* Bottom Actions */}
          {!isEditing && (
            <View style={styles.bottomRow}>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleEdit}
                  activeOpacity={0.7}
                >
                  <Ionicons name="pencil" size={16} color={colors.textMuted} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={handleDelete}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash" size={16} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Edit Mode Actions */}
          {isEditing && (
            <View style={[styles.bottomRow, { position: 'relative', bottom: 0, right: 0, marginTop: colors.spacing.md }]}>
              <View style={styles.editButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={handleSave}
                  activeOpacity={0.7}
                >
                  <Ionicons name="checkmark" size={18} color={colors.success} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={handleCancel}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TaskCard;