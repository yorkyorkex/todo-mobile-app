import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import React, { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface SwipeAction {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  gradient: [string, string];
  action: () => void;
  text: string;
}

interface SwipeableCardProps {
  children: ReactNode;
  leftAction?: SwipeAction;
  rightActions?: SwipeAction[];
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
}

const SwipeableCard = ({
  children,
  leftAction,
  rightActions = [],
  onSwipeStart,
  onSwipeEnd,
}: SwipeableCardProps) => {
  const { colors } = useTheme();
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const SWIPE_THRESHOLD = 80;
  const ACTION_WIDTH = 80;

  const hapticFeedback = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const resetPosition = () => {
    translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
  };

  const executeAction = (action: SwipeAction) => {
    // Slide out animation
    translateX.value = withTiming(translateX.value > 0 ? 400 : -400, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(action.action)();
      // Reset position after action
      translateX.value = 0;
      opacity.value = 1;
    });
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      onSwipeStart?.();
    })
    .onUpdate((event) => {
      const newTranslateX = event.translationX;
      
      // Limit swipe distance based on available actions
      const maxLeft = leftAction ? ACTION_WIDTH * 1.2 : 0;
      const maxRight = rightActions && rightActions.length > 0 ? -ACTION_WIDTH * rightActions.length * 1.2 : 0;
      
      translateX.value = Math.max(maxRight, Math.min(maxLeft, newTranslateX));
      
      // Haptic feedback at threshold
      if (Math.abs(newTranslateX) > SWIPE_THRESHOLD && Math.abs(event.velocityX) > 500) {
        runOnJS(hapticFeedback)();
      }
    })
    .onEnd((event) => {
      const { translationX, velocityX } = event;
      
      // Determine if swipe was significant enough
      const shouldTriggerAction = Math.abs(translationX) > SWIPE_THRESHOLD || Math.abs(velocityX) > 1000;
      
      if (shouldTriggerAction) {
        if (translationX > 0 && leftAction) {
          runOnJS(executeAction)(leftAction);
        } else if (translationX < 0 && rightActions && rightActions.length > 0) {
          // Determine which right action based on swipe distance
          const actionIndex = Math.min(
            Math.floor(Math.abs(translationX) / ACTION_WIDTH),
            rightActions.length - 1
          );
          runOnJS(executeAction)(rightActions[actionIndex]);
        } else {
          resetPosition();
        }
      } else {
        resetPosition();
      }
      
      onSwipeEnd?.();
    });

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  const leftActionStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      [0, ACTION_WIDTH],
      [0.8, 1],
      'clamp'
    );
    const opacity = interpolate(
      translateX.value,
      [0, ACTION_WIDTH * 0.5],
      [0, 1],
      'clamp'
    );
    
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const rightActionsStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      [-ACTION_WIDTH, 0],
      [1, 0.8],
      'clamp'
    );
    const opacity = interpolate(
      translateX.value,
      [-ACTION_WIDTH * 0.5, 0],
      [1, 0],
      'clamp'
    );
    
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const styles = StyleSheet.create({
    container: {
      position: 'relative',
    },
    actionsContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      flexDirection: 'row',
      alignItems: 'center',
    },
    leftActions: {
      left: 0,
      paddingLeft: 16,
    },
    rightActions: {
      right: 0,
      paddingRight: 16,
    },
    actionButton: {
      width: ACTION_WIDTH,
      height: 60,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 4,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    actionText: {
      fontSize: 10,
      fontWeight: '600',
      color: '#fff',
      marginTop: 4,
    },
  });

  return (
    <View style={styles.container}>
      {/* Left Action */}
      {leftAction && (
        <Animated.View style={[styles.actionsContainer, styles.leftActions, leftActionStyle]}>
          <LinearGradient
            colors={leftAction.gradient}
            style={styles.actionButton}
          >
            <Ionicons name={leftAction.icon} size={20} color="#fff" />
            <Text style={styles.actionText}>{leftAction.text}</Text>
          </LinearGradient>
        </Animated.View>
      )}

      {/* Right Actions */}
      {rightActions && rightActions.length > 0 && (
        <Animated.View style={[styles.actionsContainer, styles.rightActions, rightActionsStyle]}>
          {rightActions.map((action, index) => (
            <LinearGradient
              key={index}
              colors={action.gradient}
              style={styles.actionButton}
            >
              <Ionicons name={action.icon} size={20} color="#fff" />
              <Text style={styles.actionText}>{action.text}</Text>
            </LinearGradient>
          ))}
        </Animated.View>
      )}

      {/* Main Card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={cardStyle}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default SwipeableCard;