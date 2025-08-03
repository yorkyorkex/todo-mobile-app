import { createHomeStyles } from "@/assets/styles/home.styles";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import GlassCard from "./GlassCard";

const Header = () => {
  const { colors } = useTheme();

  const homeStyles = createHomeStyles(colors);

  const todos = useQuery(api.todos.getTodos);
  const stats = useQuery(api.todos.getProductivityStats);

  const completedCount = todos && Array.isArray(todos) ? todos.filter((todo) => todo.isCompleted).length : 0;
  const totalCount = todos && Array.isArray(todos) ? todos.length : 0;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const todayCompleted = stats?.todayCompleted || 0;
  const weekCompleted = stats?.weekCompleted || 0;

  return (
    <View style={homeStyles.header}>
      <GlassCard intensity={60}>
        <View style={{ padding: 24 }}>
          <View style={homeStyles.titleContainer}>
            <LinearGradient colors={colors.gradients.primary} style={homeStyles.iconContainer}>
              <Ionicons name="rocket-outline" size={28} color="#fff" />
            </LinearGradient>

            <View style={homeStyles.titleTextContainer}>
              <Text style={homeStyles.title}>Focus Zone ⚡</Text>
              <Text style={homeStyles.subtitle}>
                {completedCount} of {totalCount} tasks completed
              </Text>
            </View>
          </View>

          {/* Mini Stats */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            marginTop: 16,
            marginBottom: 8 
          }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: colors.success }}>
                {todayCompleted}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textMuted }}>Today</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: colors.primary }}>
                {weekCompleted}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textMuted }}>This Week</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: colors.warning }}>
                {totalCount - completedCount}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textMuted }}>Remaining</Text>
            </View>
          </View>

          <View style={homeStyles.progressContainer}>
            <View style={homeStyles.progressBarContainer}>
              <View style={homeStyles.progressBar}>
                <LinearGradient
                  colors={colors.gradients.success}
                  style={[homeStyles.progressFill, { width: `${progressPercentage}%` }]}
                />
              </View>
              <Text style={homeStyles.progressText}>{Math.round(progressPercentage)}%</Text>
            </View>
          </View>
        </View>
      </GlassCard>
    </View>
  );
};

export default Header;