import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View 
} from "react-native";

interface HeaderProps {
  onSearch?: (text: string) => void;
  onAddTask?: () => void;
  activeFilter?: "active" | "done";
  onFilterChange?: (filter: "active" | "done") => void;
}

const Header = ({ 
  onSearch, 
  onAddTask, 
  activeFilter = "active", 
  onFilterChange 
}: HeaderProps) => {
  const { colors } = useTheme();
  const [searchText, setSearchText] = useState("");

  const todos = useQuery(api.todos.getTodos);
  const activeTodos = todos?.filter(todo => !todo.isCompleted) || [];
  const totalActiveCount = activeTodos.length;

  const handleSearch = (text: string) => {
    setSearchText(text);
    onSearch?.(text);
  };

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: colors.spacing.lg,
      paddingTop: colors.spacing.md,
    },
    topSection: {
      borderRadius: colors.borderRadius.lg,
      padding: colors.spacing.lg,
      marginBottom: colors.spacing.lg,
      ...colors.shadows.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: colors.spacing.xl,
    },
    userSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      marginRight: colors.spacing.lg,
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.1)',
    },
    greetingContainer: {
      flex: 1,
    },
    greeting: {
      fontSize: 14,
      fontWeight: '500',
      color: 'rgba(255,255,255,0.8)',
      marginBottom: 4,
    },
    userName: {
      fontSize: 20,
      fontWeight: '700',
      color: '#ffffff',
      letterSpacing: 0.3,
    },
    addButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      paddingHorizontal: colors.spacing.lg + 4,
      paddingVertical: colors.spacing.md,
      borderRadius: colors.borderRadius.lg,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
    },
    addButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#ffffff',
      marginLeft: colors.spacing.sm,
    },
    taskCountSection: {
      marginBottom: colors.spacing.xl + 4,
    },
    taskCountText: {
      fontSize: 28,
      fontWeight: '800',
      color: '#ffffff',
      marginBottom: colors.spacing.sm,
      letterSpacing: 0.5,
    },
    taskCountSubtext: {
      fontSize: 15,
      fontWeight: '500',
      color: 'rgba(255,255,255,0.7)',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      borderRadius: colors.borderRadius.lg,
      paddingHorizontal: colors.spacing.lg,
      paddingVertical: colors.spacing.md,
      marginBottom: colors.spacing.lg,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(20px)',
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      fontWeight: '500',
      color: '#ffffff',
      marginLeft: colors.spacing.sm,
    },
    filterButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      paddingHorizontal: colors.spacing.md + 2,
      paddingVertical: colors.spacing.sm + 2,
      borderRadius: colors.borderRadius.md,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    myTasksSection: {
      paddingHorizontal: colors.spacing.xl,
      marginBottom: colors.spacing.xl,
    },
    myTasksHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: colors.spacing.lg + 4,
    },
    myTasksTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      letterSpacing: 0.2,
    },
    filterTabs: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: colors.borderRadius.lg,
      padding: colors.spacing.xs + 2,
      borderWidth: 1,
      borderColor: colors.border,
      ...colors.shadows.sm,
    },
    filterTab: {
      paddingHorizontal: colors.spacing.lg + 2,
      paddingVertical: colors.spacing.sm + 2,
      borderRadius: colors.borderRadius.md,
      marginHorizontal: 2,
    },
    activeFilterTab: {
      backgroundColor: colors.primary,
      ...colors.shadows.md,
    },
    filterTabText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textMuted,
    },
    activeFilterTabText: {
      color: '#ffffff',
    },
  });

  return (
    <View style={styles.container}>
      {/* Hero Section */}
      <LinearGradient
        colors={['#6c63ff', '#9333ea', '#a855f7']}
        style={styles.topSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Top Row */}
        <View style={styles.topRow}>
          <View style={styles.userSection}>
            <LinearGradient
              colors={['#ff9500', '#f85149']}
              style={styles.avatar}
            />
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>Hey Jammy!</Text>
              <Text style={styles.userName}>Welcome back</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.addButton} onPress={onAddTask}>
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.addButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>

        {/* Task Count */}
        <View style={styles.taskCountSection}>
          <Text style={styles.taskCountText}>
            You have got {totalActiveCount} Tasks
          </Text>
          <Text style={styles.taskCountSubtext}>today to complete 👋</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={22} color="rgba(255,255,255,0.7)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Tasks"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={searchText}
            onChangeText={handleSearch}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options" size={20} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* My Tasks Section */}
      <View style={styles.myTasksSection}>
        <View style={styles.myTasksHeader}>
          <Text style={styles.myTasksTitle}>My Tasks</Text>
          
          <View style={styles.filterTabs}>
            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === "active" && styles.activeFilterTab,
              ]}
              onPress={() => onFilterChange?.("active")}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === "active" && styles.activeFilterTabText,
                ]}
              >
                Active
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === "done" && styles.activeFilterTab,
              ]}
              onPress={() => onFilterChange?.("done")}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === "done" && styles.activeFilterTabText,
                ]}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Header;