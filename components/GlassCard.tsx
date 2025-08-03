import { BlurView } from 'expo-blur';
import { ReactNode } from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import useTheme from '@/hooks/useTheme';

interface GlassCardProps {
  children: ReactNode;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  style?: ViewStyle;
  blurStyle?: ViewStyle;
}

const GlassCard = ({ 
  children, 
  intensity = 100, 
  tint = 'default', 
  style, 
  blurStyle 
}: GlassCardProps) => {
  const { isDarkMode, colors } = useTheme();
  
  const defaultTint = isDarkMode ? 'dark' : 'light';
  const effectiveTint = tint === 'default' ? defaultTint : tint;

  const styles = StyleSheet.create({
    container: {
      borderRadius: 20,
      overflow: 'hidden',
      backgroundColor: Platform.OS === 'ios' ? 'transparent' : 
        isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.7)',
      borderWidth: Platform.OS === 'ios' ? 0 : 1,
      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: isDarkMode ? 0.3 : 0.15,
      shadowRadius: 20,
      elevation: 10,
    },
    blurContainer: {
      flex: 1,
    },
    fallbackContainer: {
      backgroundColor: isDarkMode ? 
        'rgba(26, 26, 26, 0.8)' : 
        'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)', // For web
    },
  });

  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.container, style]}>
        <BlurView 
          intensity={intensity} 
          tint={effectiveTint}
          style={[styles.blurContainer, blurStyle]}
        >
          {children}
        </BlurView>
      </View>
    );
  }

  // Fallback for Android and Web
  return (
    <View style={[styles.container, styles.fallbackContainer, style]}>
      {children}
    </View>
  );
};

export default GlassCard;