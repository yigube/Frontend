import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import { Buffer as BufferPolyfill } from 'buffer';
import ScreenBackground from '../components/ScreenBackground';
import HomeRolePanels from './home/HomeRolePanels';
import HomeScreenModals from './home/HomeScreenModals';
import useHomeScreenController from './home/useHomeScreenController';
import { styles } from './home/homeStyles';

if (typeof globalThis !== 'undefined' && typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = BufferPolyfill;
}

export default function HomeScreen() {
  const { rolePanelProps, modalProps } = useHomeScreenController();

  return (
    <ScreenBackground contentStyle={styles.content}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.mainColumn}>
          <View style={styles.hero}>
            <Image source={require('../assets/edusac-header.png')} style={styles.logo} resizeMode="contain" />
          </View>

          <HomeRolePanels {...rolePanelProps} />
        </View>
      </ScrollView>

      <HomeScreenModals {...modalProps} />
    </ScreenBackground>
  );
}
