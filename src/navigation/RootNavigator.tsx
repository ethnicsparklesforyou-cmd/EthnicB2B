import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { AppUpdateModal } from '../components/common/AppUpdateModal';
import {
  CURRENT_APP_VERSION,
  fetchAppVersionConfig,
  isUpdateAvailable,
  type AppVersionInfo,
} from '../services/appUpdate';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme, isDark } = useTheme();
  const { colors } = theme;

  const [showSplash, setShowSplash] = useState(true);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [versionConfig, setVersionConfig] = useState<AppVersionInfo | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const info = await fetchAppVersionConfig();
        if (!isMounted) return;
        setVersionConfig(info);
        const targetVer = info.minVersion || info.latestVersion;
        if (isUpdateAvailable(CURRENT_APP_VERSION, targetVer)) {
          setUpdateModalVisible(true);
        }
      } catch (_) {}
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const navTheme = {
    dark: isDark,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.primary,
    },
    fonts: {
      regular: { fontFamily: theme.fontFamily.sans, fontWeight: '400' as const },
      medium: { fontFamily: theme.fontFamily.sansMedium, fontWeight: '500' as const },
      bold: { fontFamily: theme.fontFamily.sansBold, fontWeight: '700' as const },
      heavy: { fontFamily: theme.fontFamily.sansBold, fontWeight: '700' as const },
    },
  };

  if (showSplash || isLoading) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  const AuthScreen = () => <AuthNavigator />;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ animation: 'fade' }}
          />
        )}
      </Stack.Navigator>
      <AppUpdateModal
        visible={updateModalVisible}
        versionInfo={versionConfig}
        onDismiss={() => setUpdateModalVisible(false)}
      />
    </NavigationContainer>
  );
}

