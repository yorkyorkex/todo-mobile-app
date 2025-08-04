import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import React from "react";
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ScrollView,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Settings = () => {
  const { colors } = useTheme();

  const handlePress = (action: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Coming Soon", `${action} feature will be available in the next update.`);
  };

  const settingSections = [
    {
      title: "Account",
      items: [
        { icon: "person-circle", title: "Profile", subtitle: "Manage your account", action: "Profile" },
        { icon: "notifications", title: "Notifications", subtitle: "Push notifications", action: "Notifications" },
        { icon: "shield-checkmark", title: "Privacy", subtitle: "Data and privacy", action: "Privacy" },
      ]
    },
    {
      title: "Preferences",
      items: [
        { icon: "moon", title: "Dark Mode", subtitle: "Theme settings", action: "Theme" },
        { icon: "language", title: "Language", subtitle: "English", action: "Language" },
        { icon: "time", title: "Time Zone", subtitle: "Auto-detect", action: "TimeZone" },
      ]
    },
    {
      title: "Support",
      items: [
        { icon: "help-circle", title: "Help Center", subtitle: "Get support", action: "Help" },
        { icon: "chatbubble-ellipses", title: "Feedback", subtitle: "Share your thoughts", action: "Feedback" },
        { icon: "star", title: "Rate App", subtitle: "Leave a review", action: "Rate" },
      ]
    }
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      flex: 1,
    },
    header: {
      padding: 20,
      paddingTop: 16,
    },
    headerGradient: {
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    userName: {
      fontSize: 20,
      fontWeight: '600',
      color: '#fff',
      marginBottom: 4,
      letterSpacing: 0.3,
    },
    userEmail: {
      fontSize: 13,
      color: 'rgba(255, 255, 255, 0.8)',
      fontWeight: '400',
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 100,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
      paddingHorizontal: 4,
      letterSpacing: 0.2,
    },
    settingItem: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      marginBottom: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
      borderWidth: 0.5,
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    settingItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    itemTitle: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 2,
    },
    itemSubtitle: {
      fontSize: 12,
      color: colors.textMuted,
      fontWeight: '400',
    },
    chevron: {
      marginLeft: 8,
    },
    versionContainer: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    versionText: {
      fontSize: 12,
      color: colors.textMuted,
      fontWeight: '400',
    },
  });

  return (
    <LinearGradient colors={colors.gradients.background} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={['#8b5cf6', '#7c3aed']}
              style={styles.headerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <LinearGradient
                colors={['#ff6b6b', '#ee5a6f']}
                style={styles.avatar}
              />
              <Text style={styles.userName}>Jammy</Text>
              <Text style={styles.userEmail}>jammy@example.com</Text>
            </LinearGradient>
          </View>

          {/* Settings Content */}
          <View style={styles.content}>
            {settingSections.map((section, sectionIndex) => (
              <View key={sectionIndex} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    style={styles.settingItem}
                    onPress={() => handlePress(item.action)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.settingItemContent}>
                      <View style={styles.iconContainer}>
                        <Ionicons 
                          name={item.icon as keyof typeof Ionicons.glyphMap} 
                          size={16} 
                          color="#8b5cf6" 
                        />
                      </View>
                      <View style={styles.textContainer}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                      </View>
                      <Ionicons 
                        name="chevron-forward" 
                        size={14} 
                        color={colors.textMuted} 
                        style={styles.chevron}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            {/* Version */}
            <View style={styles.versionContainer}>
              <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Settings;