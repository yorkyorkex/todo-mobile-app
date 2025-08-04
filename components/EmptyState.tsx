import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

const EmptyState = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: colors.spacing.xxl + colors.spacing.lg,
      paddingHorizontal: colors.spacing.xxl,
    },
    iconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: colors.spacing.lg,
      ...colors.shadows.md,
    },
    title: {
      fontSize: 26,
      fontWeight: '800',
      color: colors.text,
      textAlign: 'center',
      marginBottom: colors.spacing.md,
      letterSpacing: 0.4,
    },
    subtitle: {
      fontSize: 17,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: 26,
      fontWeight: '500',
      letterSpacing: 0.1,
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={colors.gradients.primary} 
        style={styles.iconContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name="checkmark-circle" size={48} color="#ffffff" />
      </LinearGradient>
      <Text style={styles.title}>All Done! 🎉</Text>
      <Text style={styles.subtitle}>You've completed all your tasks. Time to add some new goals!</Text>
    </View>
  );
};

export default EmptyState;