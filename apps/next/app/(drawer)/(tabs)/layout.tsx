// apps/next/app/(drawer)/(tabs)/layout.tsx
'use client'

import React from 'react'
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs'
import { useColorScheme } from 'react-native'

import {
  findNavigatorLayout,
  TabNavigatorLayoutConfig,
  PlaceholderIcon, // Make sure PlaceholderIcon is exported from layout.tsx or imported correctly
  ScreenConfig,
  ScreenOptionsConfig, // Import if needed for casting, or rely on structure
} from 'app/features/navigation/layout'

const Tab = createBottomTabNavigator()

const TabBarIcon = (props: {
  name?: string
  focused: boolean
  color: string
  size: number
}) => {
  if (!props.name) return null
  return (
    <PlaceholderIcon
      name={props.name}
      color={props.color}
      size={props.focused ? props.size + 2 : props.size}
    />
  )
}

export default function TabsLayout() {
  const colorScheme = useColorScheme() // Retained if used for theming
  const tabsConfig = findNavigatorLayout('(tabs)') as
    | TabNavigatorLayoutConfig
    | undefined

  if (!tabsConfig || tabsConfig.type !== 'tabs') {
    console.error(
      "Tabs configuration '(tabs)' not found or is not a tab navigator for Next.js!"
    )
    return <div>Error: Tabs configuration missing.</div>
  }

  return (
    <Tab.Navigator
      initialRouteName={tabsConfig.initialRouteName}
      // Spread options for the tab navigator itself (e.g., tabBarStyle)
      // Ensure TabNavigatorOwnOptions is compatible with what createBottomTabNavigator expects
      {...(tabsConfig.tabNavigatorOptions as BottomTabNavigationOptions)} // Cast if tabNavigatorOptions is your custom blend
      screenOptions={({ route }) => {
        const baseScreenOptions: BottomTabNavigationOptions = {
          // Apply global screen options from config, ensure compatibility with BottomTabNavigationOptions
          ...(tabsConfig.tabScreenOptions as BottomTabNavigationOptions),
        }

        const screen = tabsConfig.screens.find((s) => s.name === route.name)

        return {
          ...baseScreenOptions,
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon
              name={screen?.options?.tabBarIconName}
              focused={focused}
              color={color}
              size={size}
            />
          ),
          // title: screen?.options?.title, // Handled by spread below if options are compatible
          // headerShown: screen?.options?.headerShown, // Handled by spread below
        }
      }}
    >
      {tabsConfig.screens.map((screenConfig: ScreenConfig) => (
        <Tab.Screen
          key={screenConfig.name}
          name={screenConfig.name}
          component={screenConfig.component}
          // Spread screen-specific options from config
          // Ensure ScreenOptionsConfig is compatible with BottomTabNavigationOptions
          options={{
            ...(screenConfig.options as BottomTabNavigationOptions), // Cast if your options are custom
          }}
        />
      ))}
    </Tab.Navigator>
  )
}
