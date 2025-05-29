// apps/next/app/page.tsx
'use client'

import { createStackNavigator } from '@react-navigation/stack'
import DrawerLayout from './(drawer)/layout'

const Stack = createStackNavigator()

// Root stack navigator structure
export default function AppRootStack() {
  return (
    <DrawerLayout/>
    // <Stack.Navigator
    //   screenOptions={{
    //     headerShown: false, // Global setting for this stack, matching Expo
    //   }}
    // >
    //     <Stack.Screen
    //       name="(drawer)"
    //       component={DrawerLayout}
    //     />
    // </Stack.Navigator>
  )
}