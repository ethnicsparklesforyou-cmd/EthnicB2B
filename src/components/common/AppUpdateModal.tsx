import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { AppIcon } from './AppIcon';
import { AppVersionInfo, openAppStore } from '../../services/appUpdate';

const logoImg = require('../../assets/LogoNew.png');
const { width: W } = Dimensions.get('window');

interface AppUpdateModalProps {
  visible: boolean;
  versionInfo?: AppVersionInfo;
  onDismiss?: () => void;
}

export function AppUpdateModal({
  visible,
  versionInfo,
  onDismiss,
}: AppUpdateModalProps) {
  const { theme, isDark } = useTheme();
  const { colors, fontFamily } = theme;

  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(anim, {
        toValue: 1,
        tension: 65,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  const force = versionInfo?.forceUpdate ?? false;
  const targetVer = versionInfo?.latestVersion || '1.0.13';
  const isIos = Platform.OS === 'ios';

  const handleUpdate = () => {
    openAppStore(versionInfo);
  };

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={() => {
        if (!force && onDismiss) onDismiss();
      }}
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, { opacity }]} />

        {/* Modal Card */}
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: isDark ? '#1A1228' : '#FFFFFF',
              borderColor: isDark ? 'rgba(217, 119, 6, 0.45)' : 'rgba(217, 119, 6, 0.3)',
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          {/* Top Festive Badge */}
          <View style={styles.festiveBadge}>
            <Text style={styles.festiveBadgeText}>🪔 SPECIAL DIWALI UPDATE 🪔</Text>
          </View>

          {/* Logo with circular festive halo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoHalo}>
              <Image source={logoImg} style={styles.logo} resizeMode="contain" />
            </View>
            <View style={styles.versionPill}>
              <Text style={styles.versionPillText}>v{targetVer} Available</Text>
            </View>
          </View>

          {/* Heading & Subtitle */}
          <Text
            style={[
              styles.title,
              {
                color: isDark ? '#FFFFFF' : '#1A1A1A',
                fontFamily: fontFamily.sansBold,
              },
            ]}
          >
            {versionInfo?.title || 'Diwali Festive Update! 🪔'}
          </Text>

          <Text
            style={[
              styles.message,
              {
                color: isDark ? 'rgba(255, 255, 255, 0.72)' : '#4B5563',
                fontFamily: fontFamily.sans,
              },
            ]}
          >
            {versionInfo?.message ||
              'A new version is available with exclusive Diwali designs, festive discounts, and faster performance. Update now for the best experience!'}
          </Text>

          {/* Feature Highlights */}
          <View
            style={[
              styles.highlightsBox,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F9FAFB',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E7EB',
              },
            ]}
          >
            <View style={styles.highlightRow}>
              <Text style={styles.highlightIcon}>✨</Text>
              <Text
                style={[
                  styles.highlightText,
                  { color: isDark ? '#E5E7EB' : '#374151', fontFamily: fontFamily.sans },
                ]}
              >
                Exclusive Diwali Festive Jewellery
              </Text>
            </View>
            <View style={styles.highlightRow}>
              <Text style={styles.highlightIcon}>⚡</Text>
              <Text
                style={[
                  styles.highlightText,
                  { color: isDark ? '#E5E7EB' : '#374151', fontFamily: fontFamily.sans },
                ]}
              >
                Smoother experience & faster ordering
              </Text>
            </View>
            <View style={styles.highlightRow}>
              <Text style={styles.highlightIcon}>🏷️</Text>
              <Text
                style={[
                  styles.highlightText,
                  { color: isDark ? '#E5E7EB' : '#374151', fontFamily: fontFamily.sans },
                ]}
              >
                Special B2B festive pricing & offers
              </Text>
            </View>
          </View>

          {/* Update Action Button */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleUpdate}
            style={styles.updateButton}
          >
            <View style={styles.buttonInner}>
              <AppIcon
                name={isIos ? 'apple' : 'google-play'}
                size={18}
                color="#FFFFFF"
              />
              <Text style={[styles.updateButtonText, { fontFamily: fontFamily.sansBold }]}>
                Update on {isIos ? 'App Store' : 'Play Store'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Dismiss Button (if not force update) */}
          {!force && onDismiss && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onDismiss}
              style={styles.dismissButton}
            >
              <Text
                style={[
                  styles.dismissButtonText,
                  {
                    color: isDark ? 'rgba(255, 255, 255, 0.55)' : '#6B7280',
                    fontFamily: fontFamily.sansMedium,
                  },
                ]}
              >
                Maybe Later
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(5, 3, 10, 0.75)',
  },
  card: {
    width: Math.min(W - 40, 370),
    borderRadius: 24,
    paddingTop: 22,
    paddingBottom: 20,
    paddingHorizontal: 22,
    alignItems: 'center',
    borderWidth: 1.5,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
  },
  festiveBadge: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  festiveBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.8,
  },
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logoHalo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E0E2E',
    overflow: 'hidden',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  logo: {
    width: 94,
    height: 94,
    borderRadius: 47,
  },
  versionPill: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A78BFA',
  },
  versionPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
  message: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 16,
  },
  highlightsBox: {
    width: '100%',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    gap: 8,
    marginBottom: 18,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  highlightIcon: {
    fontSize: 13,
  },
  highlightText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  updateButton: {
    width: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  dismissButton: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  dismissButtonText: {
    fontSize: 13,
  },
});
