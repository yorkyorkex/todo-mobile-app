import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface CelebrationAnimationProps {
  visible: boolean;
  onComplete?: () => void;
  type?: "confetti" | "sparkles" | "stars";
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const CelebrationAnimation = ({ 
  visible, 
  onComplete, 
  type = "confetti" 
}: CelebrationAnimationProps) => {
  const { colors } = useTheme();
  
  // Create multiple animated particles
  const particles = Array.from({ length: 12 }, (_, index) => ({
    translateX: useSharedValue(0),
    translateY: useSharedValue(0),
    scale: useSharedValue(0),
    rotation: useSharedValue(0),
    opacity: useSharedValue(0),
    index,
  }));

  const containerOpacity = useSharedValue(0);

  // Create animated styles for each particle
  const particleAnimatedStyles = particles.map((particle) => 
    useAnimatedStyle(() => ({
      transform: [
        { translateX: particle.translateX.value },
        { translateY: particle.translateY.value },
        { scale: particle.scale.value },
        { rotate: `${particle.rotation.value}deg` },
      ],
      opacity: particle.opacity.value,
    }))
  );

  useEffect(() => {
    if (visible) {
      startAnimation();
    } else {
      resetAnimation();
    }
  }, [visible]);

  const startAnimation = () => {
    containerOpacity.value = withTiming(1, { duration: 200 });

    particles.forEach((particle, index) => {
      const delay = index * 50;
      const startX = (Math.random() - 0.5) * screenWidth * 0.6;
      const endX = startX + (Math.random() - 0.5) * 200;
      const endY = -100 - Math.random() * 200;

      // Initial pop-in
      particle.scale.value = withDelay(
        delay,
        withSequence(
          withTiming(1.2, { duration: 200, easing: Easing.out(Easing.back(1.7)) }),
          withTiming(1, { duration: 100 })
        )
      );

      particle.opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));

      // Movement animation
      particle.translateX.value = withDelay(
        delay,
        withSequence(
          withTiming(startX, { duration: 0 }),
          withTiming(endX, { duration: 2000, easing: Easing.out(Easing.quad) })
        )
      );

      particle.translateY.value = withDelay(
        delay,
        withSequence(
          withTiming(-50, { duration: 300, easing: Easing.out(Easing.quad) }),
          withTiming(endY, { duration: 1700, easing: Easing.in(Easing.quad) })
        )
      );

      // Rotation
      particle.rotation.value = withDelay(
        delay,
        withRepeat(
          withTiming(360, { duration: 1000, easing: Easing.linear }),
          -1,
          false
        )
      );

      // Fade out
      if (index === particles.length - 1) {
        particle.opacity.value = withDelay(
          delay + 1500,
          withTiming(0, { duration: 500 }, (finished) => {
            if (finished) {
              runOnJS(handleAnimationComplete)();
            }
          })
        );
      } else {
        particle.opacity.value = withDelay(
          delay + 1500,
          withTiming(0, { duration: 500 })
        );
      }
    });
  };

  const resetAnimation = () => {
    containerOpacity.value = 0;
    particles.forEach((particle) => {
      particle.translateX.value = 0;
      particle.translateY.value = 0;
      particle.scale.value = 0;
      particle.rotation.value = 0;
      particle.opacity.value = 0;
    });
  };

  const handleAnimationComplete = () => {
    resetAnimation();
    onComplete?.();
  };

  const getParticleIcon = (index: number) => {
    const icons = {
      confetti: ["star", "heart", "diamond", "flash", "trophy"],
      sparkles: ["sparkles", "star-outline", "diamond-outline"],
      stars: ["star", "star-outline", "star-half"],
    };
    const iconSet = icons[type];
    return iconSet[index % iconSet.length] as keyof typeof Ionicons.glyphMap;
  };

  const getParticleColor = (index: number) => {
    const colorSet = [
      colors.primary,
      colors.success,
      colors.warning,
      "#ff6b9d",
      "#4ecdc4",
      "#45b7d1",
      "#f9ca24",
      "#f0932b",
    ];
    return colorSet[index % colorSet.length];
  };

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, containerStyle]} pointerEvents="none">
      {particles.map((particle, index) => (
        <Animated.View key={particle.index} style={[styles.particle, particleAnimatedStyles[index]]}>
          <Ionicons
            name={getParticleIcon(particle.index)}
            size={24}
            color={getParticleColor(particle.index)}
          />
        </Animated.View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  particle: {
    position: 'absolute',
  },
});

export default CelebrationAnimation;