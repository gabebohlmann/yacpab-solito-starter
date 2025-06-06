// packages/app/features/options/screen.tsx
'use client';

import { View, Text } from 'react-native';
import { useColorScheme } from "react-native"

export function OptionsScreen() {
  const colorScheme = useColorScheme()

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF' }}>
      <Text style={{ fontSize: 24, marginBottom: 10, color: colorScheme === 'dark' ? 'white' : 'black' }}>
        Options
      </Text>
      <Text style={{ fontSize: 12, color: colorScheme === 'dark' ? 'white' : 'black' }}>
        This screen was auto-generated by the CLI.
      </Text>
    </View>
  )
}
