import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

type Priority = "urgent" | "high" | "medium" | "low";

interface PriorityPickerProps {
  selectedPriority: Priority;
  onPriorityChange: (priority: Priority) => void;
  style?: any;
}

const PriorityPicker = ({ selectedPriority, onPriorityChange, style }: PriorityPickerProps) => {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const expandAnimation = useSharedValue(0);
  
  const priorities: { value: Priority; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { value: "urgent", label: "Urgent", icon: "warning" },
    { value: "high", label: "High", icon: "chevron-up" },
    { value: "medium", label: "Medium", icon: "remove" },
    { value: "low", label: "Low", icon: "chevron-down" },
  ];

  const selectedItem = priorities.find(p => p.value === selectedPriority);
  
  // Safety check - if colors or selectedItem not ready, return null
  if (!colors || !selectedItem) {
    return null;
  }

  const toggleExpanded = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpanded(!isExpanded);
    expandAnimation.value = withSpring(isExpanded ? 0 : 1);
  };

  const selectPriority = (priority: Priority) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPriorityChange(priority);
    setIsExpanded(false);
    expandAnimation.value = withSpring(0);
  };

  const expandedStyle = useAnimatedStyle(() => {
    return {
      height: expandAnimation.value * 200,
      opacity: expandAnimation.value,
    };
  });

  const styles = StyleSheet.create({
    container: {
      position: 'relative',
      zIndex: 1000,
    },
    selectedButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: colors.spacing.md,
      paddingVertical: colors.spacing.sm,
      borderRadius: colors.borderRadius.md,
      borderWidth: 1,
      ...colors.shadows.sm,
    },
    selectedText: {
      fontSize: 14,
      fontWeight: '700',
      marginLeft: colors.spacing.md,
      marginRight: colors.spacing.sm,
      color: colors.text,
      letterSpacing: 0.1,
    },
    expandedContainer: {
      position: 'absolute',
      top: 54,
      left: 0,
      right: 0,
      borderRadius: colors.borderRadius.lg,
      padding: colors.spacing.sm,
      overflow: 'hidden',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      ...colors.shadows.lg,
    },
    priorityOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: colors.spacing.lg,
      paddingVertical: colors.spacing.md,
      borderRadius: colors.borderRadius.md,
      marginVertical: colors.spacing.xs,
      backgroundColor: colors.bg,
    },
    priorityText: {
      fontSize: 14,
      fontWeight: '600',
      marginLeft: colors.spacing.md,
      color: colors.text,
      letterSpacing: 0.1,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.8}>
        <LinearGradient
          colors={colors.gradients[selectedPriority]}
          style={[styles.selectedButton, { borderColor: colors.priority[selectedPriority] }]}
        >
          <Ionicons name={selectedItem.icon} size={16} color="#fff" />
          <Text style={[styles.selectedText, { color: '#fff' }]}>{selectedItem.label}</Text>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={16} 
            color="#fff" 
          />
        </LinearGradient>
      </TouchableOpacity>

      {isExpanded && (
        <Animated.View style={[expandedStyle]}>
          <LinearGradient
            colors={colors.gradients.surface}
            style={styles.expandedContainer}
          >
            {priorities.map((priority) => (
              <TouchableOpacity
                key={priority.value}
                onPress={() => selectPriority(priority.value)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={selectedPriority === priority.value ? 
                    colors.gradients[priority.value] : 
                    ['transparent', 'transparent']
                  }
                  style={styles.priorityOption}
                >
                  <Ionicons 
                    name={priority.icon} 
                    size={16} 
                    color={selectedPriority === priority.value ? '#fff' : colors.priority[priority.value]} 
                  />
                  <Text style={[
                    styles.priorityText, 
                    { color: selectedPriority === priority.value ? '#fff' : colors.text }
                  ]}>
                    {priority.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </LinearGradient>
        </Animated.View>
      )}
    </View>
  );
};

export default PriorityPicker;