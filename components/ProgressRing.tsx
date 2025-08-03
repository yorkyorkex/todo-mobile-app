import useTheme from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  showText?: boolean;
  color?: string;
  gradient?: [string, string];
}

const ProgressRing = ({
  percentage,
  size = 80,
  strokeWidth = 8,
  showText = true,
  color,
  gradient,
}: ProgressRingProps) => {
  const { colors } = useTheme();
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withTiming(percentage / 100, { duration: 1000 });
  }, [percentage]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });

  const progressColor = color || colors.primary;
  const progressGradient = gradient || colors.gradients.primary;

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    textContainer: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
    percentageText: {
      fontSize: size * 0.2,
      fontWeight: '700',
      color: colors.text,
    },
    labelText: {
      fontSize: size * 0.1,
      color: colors.textMuted,
      marginTop: 2,
    },
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <SvgLinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={progressGradient[0]} />
            <Stop offset="100%" stopColor={progressGradient[1]} />
          </SvgLinearGradient>
        </Defs>
        
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      {showText && (
        <View style={styles.textContainer}>
          <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
          <Text style={styles.labelText}>Complete</Text>
        </View>
      )}
    </View>
  );
};

export default ProgressRing;