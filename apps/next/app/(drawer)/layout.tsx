// apps/next/app/(drawer)/layout.tsx
'use client'

// import React from 'react'
import React, { useState, useEffect } from 'react'
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
  DrawerContentComponentProps, // For typing custom drawer content if you add it later
} from '@react-navigation/drawer'
import {
  useNavigation as useReactNativeNavigation, // Renamed to avoid conflict with Next.js useRouter
  DrawerActions,
  // useNavigationState, // We'll use route.name from screenOptions
} from '@react-navigation/native'
import { useRouter as useNextRouter, usePathname } from 'next/navigation' // For back navigation
import { Pressable, Text, View, StyleSheet } from 'react-native'

// Import shared navigation configuration and types
import {
  findNavigatorLayout,
  DrawerNavigatorLayoutConfig,
  ScreenConfig, // ScreenConfig from shared layout
  TabNavigatorLayoutConfig, // For identifying the (tabs) screen config
} from 'app/features/navigation/layout'

// Import the TabsLayout which will be a screen component for the drawer
import TabsLayout from './(tabs)/layout'

// Import page components (these should export the shared screen components)
// The actual components will be sourced from drawerConfig.screens[...].component
// For example, if settings/page.tsx exports SettingsScreen from features:
// import SettingsPage from './settings/page'; // Not strictly needed here if using drawerConfig

const RNDrawer = createDrawerNavigator()

// --- Placeholder Icons (Replace with your actual icon components) ---
const BackIconComponent = () => <Text style={styles.iconText}>‹</Text>
const HamburgerIconComponent = () => <Text style={styles.iconText}>☰</Text>
// --- End Placeholder Icons ---

// Custom HeaderLeft Component for the Drawer Navigator
// Now receives `currentDrawerRouteName` directly
function CustomDrawerHeaderLeft({
  currentDrawerRouteName,
}: {
  currentDrawerRouteName: string
}) {
  // const nextRouter = useNextRouter(); // Use NextRouter for back if needed, but Drawer can navigate itself
  const reactNativeNavigation = useReactNativeNavigation() // Drawer's navigation object

  const isTabsScreenActive = currentDrawerRouteName === '(tabs)'

  // NOTE: For the back button, instead of nextRouter.back(),
  // it's often better for React Navigation to handle its own stack.
  // Here, navigating to '(tabs)' makes sense as it's the "home base" within the drawer.
  // If you wanted true "stack pop" behavior, the screens would need to be in a StackNavigator
  // nested inside the Drawer screen, or the Drawer itself would need to be part of a larger stack.
  // For simplicity, navigating back to '(tabs)' is a clear action.

  if (!isTabsScreenActive) {
    // If Drawer's active screen is NOT (tabs) (e.g., it's 'settings')
    return (
      <Pressable
        onPress={() => reactNativeNavigation.navigate('(tabs)' as never)} // Navigate Drawer to its (tabs) screen
        hitSlop={20}
        style={styles.headerButton}
      >
        <BackIconComponent />
      </Pressable>
    )
  } else {
    // If Drawer's active screen IS (tabs)
    return (
      <Pressable
        onPress={() =>
          reactNativeNavigation.dispatch(DrawerActions.toggleDrawer())
        }
        hitSlop={20}
        style={styles.headerButton}
      >
        <HamburgerIconComponent />
      </Pressable>
    )
  }
}

export default function DrawerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const drawerConfig = findNavigatorLayout('(drawer)') as
    | DrawerNavigatorLayoutConfig
    | undefined

  if (!drawerConfig || drawerConfig.type !== 'drawer') {
    console.error(
      "Drawer configuration '(drawer)' not found or is not the correct type!"
    )
    return <View style={styles.container}>{children}</View>
  }

  // Determine the title for the header based on the current React Navigation Drawer route,
  // then try Next.js pathname matching as a fallback if titles are meant to be page-specific.
  // For this setup, React Navigation route's title is more direct.
  const getHeaderTitle = (currentDrawerRouteName: string): string => {
    const screenConf = drawerConfig.screens.find(
      (s) => s.name === currentDrawerRouteName
    )
    if (screenConf?.options?.title) {
      return screenConf.options.title
    }
    // If it's the (tabs) route, and it has a specific title in drawer config
    if (currentDrawerRouteName === '(tabs)') {
      const tabsGroupInDrawer = drawerConfig.screens.find(
        (s) => s.name === '(tabs)'
      ) as TabNavigatorLayoutConfig | ScreenConfig | undefined
      if (tabsGroupInDrawer?.options?.title) {
        return tabsGroupInDrawer.options.title
      }
      // If (tabs) has no title, but an active tab within TabsLayout should set it:
      // This requires TabsLayout to communicate its active tab's title up to the Drawer.
      // This is more complex. For now, we'll use the title set for the (tabs) screen in Drawer.
    }
    return drawerConfig.name // Fallback
  }

  return (
    <RNDrawer.Navigator
      initialRouteName={drawerConfig.initialRouteName || '(tabs)'}
      screenOptions={({ route }) => ({
        // `route` here is the Drawer's route object
        ...(drawerConfig.drawerScreenOptions as DrawerNavigationOptions),
        headerShown: true,
        headerLeft: () => (
          <CustomDrawerHeaderLeft currentDrawerRouteName={route.name} />
        ),
        title: getHeaderTitle(route.name), // Dynamically set title based on Drawer's active screen
      })}
      {...(drawerConfig.drawerNavigatorOptions as DrawerNavigationOptions)}
    >
      {drawerConfig.screens.map((screenOrNavConfig) => {
        // Handle the nested (tabs) navigator
        if (
          screenOrNavConfig.type === 'tabs' &&
          screenOrNavConfig.name === '(tabs)'
        ) {
          const tabNavConfig = screenOrNavConfig as TabNavigatorLayoutConfig
          return (
            <RNDrawer.Screen
              key={tabNavConfig.name}
              name={tabNavConfig.name}
              component={TabsLayout} // Directly use the imported TabsLayout
              options={{
                ...(tabNavConfig.options as DrawerNavigationOptions), // Drawer item options
                // title: is handled by screenOptions.title above for dynamic update
                drawerItemStyle: tabNavConfig.options?.drawerItemStyle || {
                  display: 'none',
                },
                drawerLabel:
                  tabNavConfig.options?.drawerLabel ||
                  tabNavConfig.options?.title ||
                  'Home',
              }}
            />
          )
        } else if (!('type' in screenOrNavConfig)) {
          // It's a ScreenConfig
          const screenConfig = screenOrNavConfig as ScreenConfig
          // Ensure your Next.js pages (e.g., app/(drawer)/settings/page.tsx)
          // export the component defined in screenConfig.component.
          return (
            <RNDrawer.Screen
              key={screenConfig.name}
              name={screenConfig.name}
              component={screenConfig.component} // e.g., SettingsScreen from shared features
              options={{
                ...(screenConfig.options as DrawerNavigationOptions),
                // title: is handled by screenOptions.title above
                drawerLabel:
                  screenConfig.options?.drawerLabel ||
                  screenConfig.options?.title,
              }}
            />
          )
        }
        return null
      })}
    </RNDrawer.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    paddingHorizontal: 15,
    justifyContent: 'center',
    height: '100%',
  },
  iconText: {
    fontSize: 22, // Consistent size
    color: '#007AFF',
  },
})

// apps/next/app/(drawer)/layout.tsx
// 'use client'

// import React from 'react'
// import { createDrawerNavigator, DrawerNavigationOptions } from '@react-navigation/drawer'
// import { useNavigation, DrawerActions, useNavigationState } from '@react-navigation/native'
// import { Pressable, Text, View, StyleSheet } from 'react-native' // Using react-native for consistency

// // Import the TabsLayout which will be a screen in the drawer
// // This path assumes your tabs layout is correctly located relative to this file.
// // Given your existing tabs layout is at apps/next/app/(drawer)/(tabs)/layout.tsx,
// // this means TabsLayout is a child route of this drawer layout.
// import TabsLayout from './(tabs)/layout'

// // Import the page components for other drawer screens
// import SettingsPage from './settings/page'
// import OptionsPage from './options/page'

// // --- Placeholder Icons (Replace with your actual icon components) ---
// const BackIcon = () => <Text style={styles.iconText}>‹ Back</Text>
// const HamburgerIcon = () => <Text style={styles.iconText}>☰</Text>
// // --- End Placeholder Icons ---

// // Custom HeaderLeft Component for the Drawer Navigator
// function CustomDrawerHeaderLeft() {
//   const navigation = useNavigation() // Drawer's navigation object

//   // Get the current route name within the drawer navigator
//   const currentRouteName = useNavigationState((state) => {
//     if (state === undefined || state.index === undefined || !state.routes[state.index]) {
//       return '(tabs)' // Default to '(tabs)' if state is not fully resolved
//     }
//     return state.routes[state.index].name
//   })

//   const isTabsScreenActive = currentRouteName === '(tabs)'

//   if (!isTabsScreenActive) {
//     return (
//       <Pressable
//         onPress={() => navigation.navigate('(tabs)' as never)} // Navigate to the main tabs screen
//         hitSlop={20}
//         style={styles.headerButton}
//       >
//         <BackIcon />
//       </Pressable>
//     )
//   } else {
//     return (
//       <Pressable
//         onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
//         hitSlop={20}
//         style={styles.headerButton}
//       >
//         <HamburgerIcon />
//       </Pressable>
//     )
//   }
// }

// const Drawer = createDrawerNavigator()

// export default function DrawerLayout() {
//   // const colorScheme = useColorScheme(); // For theming if needed

//   return (
//     <Drawer.Navigator
//       initialRouteName="(tabs)" // Start on the screen that contains the tabs
//       screenOptions={{
//         headerShown: true,
//         headerLeft: () => <CustomDrawerHeaderLeft />,
//         // Example: Apply general drawer styling
//         // drawerStyle: {
//         //   backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff',
//         // },
//         // drawerActiveTintColor: colorScheme === 'dark' ? 'lightblue' : 'blue',
//         // drawerInactiveTintColor: colorScheme === 'dark' ? 'gray' : 'darkgray',
//       }}
//     >
//       <Drawer.Screen
//         name="(tabs)"
//         component={TabsLayout} // Your existing TabsLayout for Next.js
//         options={{
//           title: 'Vidream', // Title shown in header when (tabs) is active, might be overridden by active tab's title
//           drawerLabel: 'Home', // Label for the drawer item if you decide to show it
//           // To hide this item from the drawer list (recommended if (tabs) is the main content area):
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="settings"
//         component={SettingsPage}
//         options={{
//           title: 'Settings', // Header title for the settings screen
//           drawerLabel: 'Settings', // Label in the drawer menu
//         }}
//       />
//       <Drawer.Screen
//         name="options"
//         component={OptionsPage}
//         options={{
//           title: 'Options', // Header title for the options screen
//           drawerLabel: 'Options', // Label in the drawer menu
//         }}
//       />
//       {/* Add other drawer screens here as needed */}
//     </Drawer.Navigator>
//   )
// }

// const styles = StyleSheet.create({
//   headerButton: {
//     paddingHorizontal: 15,
//     justifyContent: 'center',
//     height: '100%',
//   },
//   iconText: {
//     fontSize: 18, // Adjust size as needed
//     color: '#007AFF', // Example color, align with your theme
//   },
//   // Styles for placeholder screens if you keep them simple like above
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
// })
