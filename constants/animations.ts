import { withSpring, withTiming, Easing } from 'react-native-reanimated';

// Animation presets for consistent timing and easing
export const AnimationPresets = {
  // Spring animations
  spring: {
    gentle: {
      damping: 15,
      stiffness: 150,
      mass: 1,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 2,
    },
    bouncy: {
      damping: 10,
      stiffness: 100,
      mass: 1,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 2,
    },
    snappy: {
      damping: 20,
      stiffness: 200,
      mass: 0.8,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 2,
    },
  },

  // Timing animations
  timing: {
    fast: {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    },
    normal: {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    },
    slow: {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    },
    smooth: {
      duration: 350,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    },
  },
};

// Common animation helpers
export const AnimationHelpers = {
  // Scale animation for press interactions
  pressScale: (pressed: boolean) => {
    'worklet';
    return withSpring(pressed ? 0.96 : 1, AnimationPresets.spring.snappy);
  },

  // Fade animation
  fadeIn: (visible: boolean, duration = 300) => {
    'worklet';
    return withTiming(visible ? 1 : 0, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  },

  // Slide animation
  slideInUp: (visible: boolean, distance = 20, duration = 300) => {
    'worklet';
    return withTiming(visible ? 0 : distance, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  },

  // Rotate animation
  rotate: (active: boolean, duration = 300) => {
    'worklet';
    return withTiming(active ? '180deg' : '0deg', {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  },

  // Elastic scale for success/completion states
  successPulse: () => {
    'worklet';
    return withSpring(1.1, AnimationPresets.spring.bouncy);
  },

  // Smooth height animation
  expandHeight: (expanded: boolean, collapsedHeight = 0, expandedHeight = 100) => {
    'worklet';
    return withTiming(
      expanded ? expandedHeight : collapsedHeight,
      AnimationPresets.timing.smooth
    );
  },
};

// Animation sequences for complex interactions
export const AnimationSequences = {
  // Task completion sequence
  taskComplete: {
    scale: [
      { value: 1.05, config: AnimationPresets.spring.bouncy },
      { value: 1, config: AnimationPresets.spring.gentle },
    ],
    opacity: [
      { value: 0.8, config: AnimationPresets.timing.fast },
      { value: 1, config: AnimationPresets.timing.normal },
    ],
  },

  // Card entry animation
  cardEntry: {
    translateY: [
      { value: 20, config: { duration: 0 } },
      { value: 0, config: AnimationPresets.timing.smooth },
    ],
    opacity: [
      { value: 0, config: { duration: 0 } },
      { value: 1, config: AnimationPresets.timing.normal },
    ],
    scale: [
      { value: 0.95, config: { duration: 0 } },
      { value: 1, config: AnimationPresets.spring.gentle },
    ],
  },

  // Button press feedback
  buttonPress: {
    scale: [
      { value: 0.96, config: AnimationPresets.timing.fast },
      { value: 1, config: AnimationPresets.spring.gentle },
    ],
  },

  // Modal entrance
  modalEntry: {
    translateY: [
      { value: 50, config: { duration: 0 } },
      { value: 0, config: AnimationPresets.timing.smooth },
    ],
    opacity: [
      { value: 0, config: { duration: 0 } },
      { value: 1, config: AnimationPresets.timing.normal },
    ],
  },
};

// Transition configurations for navigation
export const TransitionConfigs = {
  slide: {
    gestureDirection: 'horizontal',
    transitionDuration: 300,
    cardStyleInterpolator: ({ current, layouts }) => {
      return {
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0],
              }),
            },
          ],
        },
      };
    },
  },

  fade: {
    transitionDuration: 250,
    cardStyleInterpolator: ({ current }) => {
      return {
        cardStyle: {
          opacity: current.progress,
        },
      };
    },
  },
};

export default {
  AnimationPresets,
  AnimationHelpers,
  AnimationSequences,
  TransitionConfigs,
};