// apps/next/app/page.tsx
'use client'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import DrawerLayout from './(drawer)/layout'

const Stack = createNativeStackNavigator()

// Root stack navigator structure
export default function AppRootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Global setting for this stack, matching Expo
      }}
    >
      <Stack.Screen
        name="(drawer)"
        component={DrawerLayout}
      />
    </Stack.Navigator>
  )
}

;<AppRootStack />