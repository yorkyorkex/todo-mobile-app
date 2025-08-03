import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from "react-native-reanimated";
import ProgressRing from "./ProgressRing";

interface TaskCardProps {
  title: string;
  category: string;
  priority: "urgent" | "high" | "medium" | "low";
  dueDate?: string;
  progress?: number;
  timeRange?: string;
  isCompleted: boolean;
  onPress?: () => void;
  onToggle?: () => void;
}

const TaskCard = ({
  title,
  category,
  priority,
  dueDate,
  progress = 0,
  timeRange,
  isCompleted,
  onPress,
  onToggle,
}: TaskCardProps) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.98, {}, () => {
      scale.value = withSpring(1);
    });
    onPress?.();
  };

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggle?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getPriorityColor = () => {
    switch (priority) {
      case "urgent":
        return colors.danger;
      case "high":
        return colors.warning;
      case "medium":
        return colors.primary;
      case "low":
        return colors.success;
      default:
        return colors.primary;
    }
  };

  const getPriorityGradient = () => {
    switch (priority) {
      case "urgent":
        return colors.gradients.urgent;
      case "high":
        return colors.gradients.high;
      case "medium":
        return colors.gradients.medium;
      case "low":
        return colors.gradients.low;
      default:
        return colors.gradients.medium;
    }
  };

  const getCategoryIcon = () => {
    switch (category.toLowerCase()) {
      case "work":
        return "briefcase";
      case "personal":
        return "person";
      case "health":
        return "fitness";
      case "learning":
        return "library";
      case "shopping":
        return "bag";
      case "travel":
        return "airplane";
      default:
        return "list";
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginVertical: 8,
      marginHorizontal: 16,
    },
    card: {
      borderRadius: 20,
      padding: 20,
      backgroundColor: colors.surface,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 6,
      borderLeftWidth: 4,
      borderLeftColor: getPriorityColor(),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    leftSection: {
      flex: 1,
      marginRight: 16,
    },
    rightSection: {
      alignItems: 'center',
    },
    priorityBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginBottom: 8,
      alignSelf: 'flex-start',
    },
    priorityText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#fff',
      textTransform: 'capitalize',
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
      lineHeight: 24,
    },
    completedTitle: {
      textDecorationLine: 'line-through',
      opacity: 0.6,
    },
    categoryContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    categoryText: {
      fontSize: 14,
      color: colors.textMuted,
      marginLeft: 6,
      textTransform: 'capitalize',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
    },
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    timeText: {
      fontSize: 12,
      color: colors.textMuted,
      marginLeft: 4,
    },
    dueDateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dueDateText: {
      fontSize: 12,
      color: colors.textMuted,
      marginLeft: 4,
    },
    checkbox: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: getPriorityColor(),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isCompleted ? getPriorityColor() : 'transparent',
    },
  });

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <LinearGradient
          colors={colors.gradients.surface}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.header}>
            <View style={styles.leftSection}>
              <LinearGradient
                colors={getPriorityGradient()}
                style={styles.priorityBadge}
              >
                <Text style={styles.priorityText}>{priority}</Text>
              </LinearGradient>
              
              <Text style={[styles.title, isCompleted && styles.completedTitle]}>
                {title}
              </Text>
              
              <View style={styles.categoryContainer}>
                <Ionicons 
                  name={getCategoryIcon() as keyof typeof Ionicons.glyphMap} 
                  size={16} 
                  color={colors.textMuted} 
                />
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            </View>
            
            <View style={styles.rightSection}>
              {progress > 0 && !isCompleted && (
                <ProgressRing 
                  percentage={progress} 
                  size={60} 
                  strokeWidth={6}
                  gradient={getPriorityGradient()}
                />
              )}
              
              <TouchableOpacity 
                style={styles.checkbox} 
                onPress={handleToggle}
                activeOpacity={0.8}
              >
                {isCompleted && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.footer}>
            {timeRange && (
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                <Text style={styles.timeText}>{timeRange}</Text>
              </View>
            )}
            
            {dueDate && (
              <View style={styles.dueDateContainer}>
                <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                <Text style={styles.dueDateText}>Due: {dueDate}</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default TaskCard;