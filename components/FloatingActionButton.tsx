import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  withTiming,
  FadeInUp,
  FadeOutDown,
} from "react-native-reanimated";
import { AnimationPresets } from "@/constants/animations";

interface FloatingActionButtonProps {
  actions: Array<{
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    color: string;
    gradient: string[];
    onPress: () => void;
  }>;
}

const FloatingActionButton = ({ actions }: FloatingActionButtonProps) => {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const handleMainPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setIsExpanded(!isExpanded);
    rotation.value = withSpring(isExpanded ? 0 : 45, AnimationPresets.spring.bouncy);
    scale.value = withSpring(isExpanded ? 1 : 1.1, AnimationPresets.spring.snappy, () => {
      scale.value = withSpring(1, AnimationPresets.spring.gentle);
    });
  };

  const handleActionPress = (action: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpanded(false);
    rotation.value = withSpring(0, AnimationPresets.spring.gentle);
    action.onPress();
  };

  const animatedMainButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value }
    ],
  }));

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 100,
      right: colors.spacing.lg,
      alignItems: 'center',
      zIndex: 1000,
    },
    actionButton: {
      width: 52,
      height: 52,
      borderRadius: 26,
      marginBottom: colors.spacing.md,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.surface,
      ...colors.shadows.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    mainButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      ...colors.shadows.lg,
    },
    buttonText: {
      ...colors.typography.h1,
      color: '#ffffff',
      fontWeight: '300',
    },
  });

  return (
    <View style={styles.container}>
      {/* Action Buttons */}
      {isExpanded && actions.map((action, index) => (
        <Animated.View
          key={index}
          entering={FadeInUp.delay(index * 50).springify()}
          exiting={FadeOutDown.duration(200)}
        >
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleActionPress(action)}
            activeOpacity={0.8}
          >
            <Ionicons name={action.icon} size={22} color={colors.primary} />
          </TouchableOpacity>
        </Animated.View>
      ))}

      {/* Main Button */}
      <Animated.View style={animatedMainButtonStyle}>
        <TouchableOpacity
          onPress={handleMainPress}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={colors.gradients.primary}
            style={styles.mainButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonText}>+</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default FloatingActionButton;