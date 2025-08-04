import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useSharedValue, withSpring, useAnimatedStyle, FadeInDown } from "react-native-reanimated";
import { AnimationPresets } from "@/constants/animations";

interface CategoryOverviewCardProps {
  category: string;
  taskCount: number;
  completedCount: number;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

const CategoryOverviewCard = ({ 
  category, 
  taskCount, 
  completedCount, 
  icon, 
  onPress 
}: CategoryOverviewCardProps) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.95, AnimationPresets.spring.snappy, () => {
      scale.value = withSpring(1, AnimationPresets.spring.gentle);
    });
    onPress?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const progressPercentage = taskCount > 0 ? (completedCount / taskCount) * 100 : 0;
  const categoryGradient = colors.gradients[category as keyof typeof colors.gradients] || colors.gradients.primary;

  const styles = StyleSheet.create({
    card: {
      borderRadius: colors.borderRadius.md,
      padding: colors.spacing.md,
      margin: colors.spacing.xs,
      minHeight: 100,
      justifyContent: 'space-between',
      ...colors.shadows.md,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: colors.borderRadius.sm + colors.spacing.xs,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      marginBottom: colors.spacing.sm,
      ...colors.shadows.sm,
    },
    categoryName: {
      ...colors.typography.body,
      color: '#ffffff',
      textTransform: 'capitalize',
      marginBottom: colors.spacing.xs,
      letterSpacing: 0.2,
    },
    taskCount: {
      ...colors.typography.caption,
      color: 'rgba(255, 255, 255, 0.85)',
    },
    progressContainer: {
      marginTop: colors.spacing.sm,
    },
    progressBar: {
      height: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: colors.borderRadius.sm / 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#ffffff',
      borderRadius: colors.borderRadius.sm / 2,
    },
    progressText: {
      ...colors.typography.small,
      color: 'rgba(255, 255, 255, 0.85)',
      marginTop: colors.spacing.xs,
      textAlign: 'right',
    },
  });

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Animated.View 
        style={animatedStyle}
        entering={FadeInDown.delay(200).springify()}
      >
        <LinearGradient
          colors={categoryGradient}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View>
            <View style={styles.iconContainer}>
              <Ionicons name={icon} size={20} color="#fff" />
            </View>
            
            <Text style={styles.categoryName}>{category}</Text>
            <Text style={styles.taskCount}>
              {taskCount} {taskCount === 1 ? 'Task' : 'Tasks'}
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progressPercentage}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {completedCount}/{taskCount} completed
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default CategoryOverviewCard;