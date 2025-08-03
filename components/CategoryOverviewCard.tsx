import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from "react-native-reanimated";

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
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
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
      borderRadius: 20,
      padding: 20,
      margin: 8,
      minHeight: 120,
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      marginBottom: 12,
    },
    categoryName: {
      fontSize: 18,
      fontWeight: '700',
      color: '#fff',
      textTransform: 'capitalize',
      marginBottom: 4,
    },
    taskCount: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.8)',
      fontWeight: '500',
    },
    progressContainer: {
      marginTop: 12,
    },
    progressBar: {
      height: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#fff',
      borderRadius: 2,
    },
    progressText: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.7)',
      marginTop: 4,
      textAlign: 'right',
    },
  });

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Animated.View style={animatedStyle}>
        <LinearGradient
          colors={categoryGradient}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View>
            <View style={styles.iconContainer}>
              <Ionicons name={icon} size={24} color="#fff" />
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