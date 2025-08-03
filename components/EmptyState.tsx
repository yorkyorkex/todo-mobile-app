import { createHomeStyles } from "@/assets/styles/home.styles";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

const EmptyState = () => {
  const { colors } = useTheme();

  const homeStyles = createHomeStyles(colors);

  return (
    <View style={homeStyles.emptyContainer}>
      <LinearGradient colors={colors.gradients.empty} style={homeStyles.emptyIconContainer}>
        <Ionicons name="sparkles-outline" size={60} color={colors.textMuted} />
      </LinearGradient>
      <Text style={homeStyles.emptyText}>Ready to Focus? 🎯</Text>
      <Text style={homeStyles.emptySubtext}>Add your first task to start crushing your goals!</Text>
    </View>
  );
};
export default EmptyState;
