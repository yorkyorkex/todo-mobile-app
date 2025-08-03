import { ThemeProvider } from "@/hooks/useTheme";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { Platform } from "react-native";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL || "https://bold-otter-585.convex.cloud";
const convex = new ConvexReactClient(convexUrl, {
  unsavedChangesWarning: false,
});

function MobileWebStyles() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        /* 手機版樣式 - 讓網頁版看起來像真的手機APP */
        @media screen and (min-width: 768px) {
          body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 40px 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          #root {
            width: 390px !important;
            height: 844px !important;
            max-width: 390px !important;
            max-height: 844px !important;
            border-radius: 40px !important;
            overflow: hidden !important;
            box-shadow: 
              0 0 0 8px #1a1a1a,
              0 0 0 9px #333,
              0 20px 40px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.1);
            position: relative !important;
            margin: 0 auto !important;
          }

          #root::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 150px;
            height: 30px;
            background: #1a1a1a;
            border-radius: 0 0 20px 20px;
            z-index: 1000;
          }

          #root::after {
            content: '';
            position: absolute;
            bottom: 8px;
            left: 50%;
            transform: translateX(-50%);
            width: 140px;
            height: 5px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
            z-index: 1000;
          }
        }

        @media screen and (max-width: 767px) {
          body {
            margin: 0;
            padding: 0;
          }
          
          #root {
            width: 100% !important;
            height: 100vh !important;
            max-width: none !important;
            max-height: none !important;
          }
        }

        * {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
        }

        ::-webkit-scrollbar {
          width: 0;
          background: transparent;
        }

        html {
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
          touch-action: manipulation;
        }
      `;
      document.head.appendChild(style);
      
      // 設置viewport meta標籤
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
        document.head.appendChild(meta);
      }
    }
  }, []);

  return null;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ConvexProvider client={convex}>
        <ThemeProvider>
          <MobileWebStyles />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </ThemeProvider>
      </ConvexProvider>
    </GestureHandlerRootView>
  );
}