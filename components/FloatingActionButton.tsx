import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import GlassCard from "./GlassCard";

interface FABAction {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  gradient: [string, string];
  onPress: () => void;
}

interface FloatingActionButtonProps {
  actions?: FABAction[];
  onMainPress?: () => void;
  style?: any;
}

const FloatingActionButton = ({ actions = [], onMainPress, style }: FloatingActionButtonProps) => {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const expandedHeight = useSharedValue(0);

  const toggleExpanded = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsExpanded(!isExpanded);
    
    rotation.value = withSpring(isExpanded ? 0 : 45);
    expandedHeight.value = withTiming(isExpanded ? 0 : actions.length * 60 + 20);
  };

  const handleMainPress = () => {
    if (actions.length > 0) {
      toggleExpanded();
    } else if (onMainPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      scale.value = withSpring(0.9, {}, () => {
        scale.value = withSpring(1);
      });
      onMainPress();
    }
  };

  const handleActionPress = (action: FABAction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    action.onPress();
    setIsExpanded(false);
    rotation.value = withSpring(0);
    expandedHeight.value = withTiming(0);
  };

  const mainButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  const expandedStyle = useAnimatedStyle(() => ({
    height: expandedHeight.value,
    opacity: expandedHeight.value > 0 ? 1 : 0,
  }));

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 100,
      right: 24,
      alignItems: 'center',
      zIndex: 1000,
    },
    expandedContainer: {
      marginBottom: 16,
      alignItems: 'center',
      overflow: 'hidden',
    },
    actionButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      marginBottom: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionLabel: {
      position: 'absolute',
      right: 70,
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    actionLabelText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.text,
    },
    mainButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 12,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {/* Expanded Actions */}
      {actions && actions.length > 0 && (
        <Animated.View style={[styles.expandedContainer, expandedStyle]}>
          {actions.map((action, index) => (
            <View key={index} style={{ position: 'relative' }}>
              <TouchableOpacity
                onPress={() => handleActionPress(action)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={action.gradient}
                  style={styles.actionButton}
                >
                  <Ionicons name={action.icon} size={24} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
              
              {isExpanded && (
                <View style={styles.actionLabel}>
                  <Text style={styles.actionLabelText}>{action.label}</Text>
                </View>
              )}
            </View>
          ))}
        </Animated.View>
      )}

      {/* Main Button */}
      <TouchableOpacity onPress={handleMainPress} activeOpacity={0.8}>
        <Animated.View style={mainButtonStyle}>
          <GlassCard style={styles.mainButton} intensity={80}>
            <LinearGradient
              colors={colors.gradients.primary}
              style={styles.mainButton}
            >
              <Ionicons 
                name={actions.length > 0 ? "add" : "add"} 
                size={28} 
                color="#fff" 
              />
            </LinearGradient>
          </GlassCard>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default FloatingActionButton;