import { createHomeStyles } from "@/assets/styles/home.styles";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const styles = StyleSheet.create({
    headerContainer: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    greetingContainer: {
      flex: 1,
    },
    greeting: {
      fontSize: 16,
      color: colors.textMuted,
      fontWeight: '500',
    },
    userName: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.text,
      marginTop: 4,
    },
    profileButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleSection: {
      marginBottom: 20,
    },
    mainTitle: {
      fontSize: 32,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textMuted,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.headerContainer}>
      <GlassCard intensity={40}>
        <View style={{ padding: 24 }}>
          {/* Top greeting row */}
          <View style={styles.topRow}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>Rakib 👋</Text>
            </View>
            
            <TouchableOpacity activeOpacity={0.8}>
              <LinearGradient
                colors={colors.gradients.primary}
                style={styles.profileButton}
              >
                <Ionicons name="notifications-outline" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Main title section */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Manage Your{'\n'}Daily Task</Text>
          </View>

          {/* Mini Stats */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            marginBottom: 16 
          }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: colors.success }}>
                {todayCompleted}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>Today</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: colors.primary }}>
                {weekCompleted}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>This Week</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: colors.warning }}>
                {totalCount - completedCount}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>Remaining</Text>
            </View>
          </View>

          {/* Progress bar */}
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