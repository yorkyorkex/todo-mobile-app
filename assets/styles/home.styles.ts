import { ColorScheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

export const createHomeStyles = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: 20,
      fontSize: 18,
      fontWeight: "500",
      color: colors.text,
    },
    header: {
      paddingHorizontal: 24,
      paddingVertical: 32,
      paddingBottom: 24,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    titleTextContainer: {
      flex: 1,
    },
    title: {
      fontSize: 32,
      fontWeight: "800",
      letterSpacing: -1.2,
      marginBottom: 4,
      color: colors.text,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textMuted,
    },
    progressContainer: {
      marginTop: 8,
    },
    progressBarContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    progressBar: {
      flex: 1,
      height: 12,
      borderRadius: 6,
      overflow: "hidden",
      backgroundColor: colors.border,
    },
    progressFill: {
      height: "100%",
      borderRadius: 6,
    },
    progressText: {
      fontSize: 16,
      fontWeight: "700",
      minWidth: 40,
      textAlign: "right",
      color: colors.success,
    },
    inputSection: {
      paddingHorizontal: colors.spacing.lg,
      paddingBottom: colors.spacing.lg,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: colors.spacing.sm,
      backgroundColor: colors.surface,
      borderRadius: colors.borderRadius.lg,
      padding: colors.spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      ...colors.shadows.md,
    },
    input: {
      flex: 1,
      borderRadius: colors.borderRadius.lg,
      paddingHorizontal: colors.spacing.lg,
      paddingVertical: colors.spacing.lg,
      fontSize: 16,
      maxHeight: 120,
      fontWeight: "600",
      backgroundColor: colors.bg,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      ...colors.shadows.sm,
    },
    inputFocused: {
      borderColor: colors.primary,
      ...colors.shadows.md,
    },
    addButton: {
      width: 44,
      height: 44,
      borderRadius: colors.borderRadius.md,
      justifyContent: "center",
      alignItems: "center",
      ...colors.shadows.sm,
    },
    addButtonDisabled: {
      opacity: 0.6,
    },
    todoList: {
      flex: 1,
    },
    todoListContent: {
      paddingHorizontal: 24,
      paddingBottom: 100,
    },
    emptyListContainer: {
      flexGrow: 1,
      justifyContent: "center",
    },
    todoItemWrapper: {
      marginVertical: 12,
    },
    todoItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      padding: 24,
      borderRadius: 24,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 12,
    },
    checkbox: {
      marginRight: 16,
      marginTop: 2,
    },
    checkboxInner: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
    },
    todoTextContainer: {
      flex: 1,
    },
    todoText: {
      fontSize: 17,
      lineHeight: 24,
      fontWeight: "500",
      marginBottom: 16,
      color: colors.text,
    },
    todoActions: {
      flexDirection: "row",
      gap: 12,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    editContainer: {
      flex: 1,
    },
    editInput: {
      borderWidth: 2,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 17,
      fontWeight: "500",
      marginBottom: 16,
      backgroundColor: colors.backgrounds.editInput,
      borderColor: colors.primary,
      color: colors.text,
    },
    editButtons: {
      flexDirection: "row",
      gap: 12,
    },
    editButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
    },
    editButtonText: {
      color: "#ffffff",
      fontSize: 14,
      fontWeight: "600",
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 80,
    },
    emptyIconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 24,
    },
    emptyText: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 8,
      color: colors.text,
    },
    emptySubtext: {
      fontSize: 17,
      textAlign: "center",
      paddingHorizontal: 40,
      lineHeight: 24,
      color: colors.textMuted,
    },
  });

  return styles;
};