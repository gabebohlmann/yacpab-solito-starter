// packages/app/features/navigation/layout.tsx
import { ComponentType } from 'react'
import { Text, ViewStyle } from 'react-native' // Keep Text for PlaceholderIcon example
import { HomeScreen } from '../home/screen'
import { AccountScreen } from '../account/screen'
import { SubsScreen } from '../subs/screen'
import { SettingsScreen } from '../settings/screen'
import { OptionsScreen } from '../options/screen'
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { DrawerNavigationOptions } from '@react-navigation/drawer'
import { StackNavigationOptions } from '@react-navigation/stack'

// Generic options type, can be a union of specific navigator options if refined further
type GenericNavigatorSpecificOptions = any // For navigator-level settings like drawerType, tabBarStyle etc.

// --- Configuration Types ---

export interface ScreenOptionsConfig {
  title?: string
  headerShown?: boolean
  // For Tab Screens
  tabBarIconName?: string
  // For Drawer Screens
  drawerLabel?:
    | string
    | ((props: { focused: boolean; color: string }) => React.ReactNode)
  drawerIcon?: (props: {
    focused: boolean
    color: string
    size: number
  }) => React.ReactNode
  drawerItemStyle?: ViewStyle
  // Can also include Stack screen options if needed directly
  // Example: cardStyle, presentation, etc.
  [key: string]: any // Allow other React Navigation options
}

export interface ScreenConfig {
  type: 'screen'
  name: string
  component: ComponentType<any>
  options?: ScreenOptionsConfig
  href?: string // Optional: Primarily for Next.js linking
}

// Options specific to the Tab navigator itself (e.g., tab bar style)
export interface TabNavigatorOwnOptions extends BottomTabNavigationOptions {
  // Keep BottomTabNavigationOptions for full compatibility
  // tabBarActiveTintColor?: string; // Already in BottomTabNavigationOptions
  // tabBarInactiveTintColor?: string; // Already in BottomTabNavigationOptions
  // tabBarStyle?: ViewStyle; // Already in BottomTabNavigationOptions
}

export interface TabNavigatorLayoutConfig {
  type: 'tabs'
  name: string
  initialRouteName?: string
  screens: ScreenConfig[] // Screens within tabs are always ScreenConfig
  options?: ScreenOptionsConfig // Options for this Tab Navigator when it's a screen in a parent (e.g., Drawer label)
  tabNavigatorOptions?: TabNavigatorOwnOptions // Options for the tab bar itself
  tabScreenOptions?: ScreenOptionsConfig // Default options for screens within this tab navigator
}

export interface DrawerNavigatorOwnOptions extends DrawerNavigationOptions {
  // Keep DrawerNavigationOptions for full compatibility
}

export interface DrawerNavigatorLayoutConfig {
  type: 'drawer'
  name: string
  initialRouteName?: string
  screens: NavigationSchemaItem[]
  options?: ScreenOptionsConfig // Options for this Drawer Navigator when it's a screen in a parent
  drawerNavigatorOptions?: DrawerNavigatorOwnOptions // Options for the drawer panel itself
  drawerScreenOptions?: ScreenOptionsConfig // Default options for screens within this drawer
}

export interface StackNavigatorOwnOptions extends StackNavigationOptions {
  // Keep StackNavigationOptions for full compatibility
}
export interface StackNavigatorLayoutConfig {
  type: 'stack'
  name: string
  initialRouteName?: string
  screens: NavigationSchemaItem[]
  options?: ScreenOptionsConfig // Options for this Stack Navigator (e.g. if it's a screen) OR default screen options within it
  stackNavigatorOptions?: StackNavigatorOwnOptions // Options for the stack navigator itself
  // stackScreenOptions?: ScreenOptionsConfig; // If you want a separate prop for default screen options in stack
}

export type NavigationSchemaItem =
  | ScreenConfig
  | TabNavigatorLayoutConfig
  | DrawerNavigatorLayoutConfig
  | StackNavigatorLayoutConfig

export type NavigatorLayout =
  | StackNavigatorLayoutConfig
  | TabNavigatorLayoutConfig
  | DrawerNavigatorLayoutConfig

// Helper to simulate an icon, replace with your actual icon library
export const PlaceholderIcon = ({
  name,
  color,
  size,
}: {
  name: string
  color: string
  size: number
}) => (
  <Text style={{ color: color, fontSize: size }}>
    {name.charAt(0).toUpperCase()}
  </Text>
)

// --- Main Navigation Structure ---
export const appNavigationStructure: NavigatorLayout[] = [
  {
    type: 'stack',
    name: 'Root',
    initialRouteName: '(drawer)',
    options: { headerShown: false }, // This ScreenOptionsConfig applies to the Root stack itself if it were a screen, or default for its screens.
    // stackNavigatorOptions: { headerShown: false }, // More explicit for navigator options
    screens: [
      {
        type: 'drawer',
        name: '(drawer)',
        initialRouteName: '(tabs)',
        // options for (drawer) *as a screen* within the 'Root' stack:
        options: {
          headerShown: false, // Example: Stack header for the drawer screen itself
        },
        drawerNavigatorOptions: {
          defaultStatus: 'closed',
          drawerStyle: {
            backgroundColor: 'white',
            width: 280,
          },
          overlayColor: 'rgba(0, 0, 0, 0.5)',
        },
        drawerScreenOptions: {
          // Default options for screens *inside* the drawer
          headerShown: true,
        },
        screens: [
          {
            type: 'tabs',
            name: '(tabs)',
            // component and href removed as TabsLayout will be used directly in drawer layout
            initialRouteName: 'home',
            // Options for (tabs) *as a screen/item* within the (drawer)
            options: {
              title: 'Vidream Main',
              drawerItemStyle: { display: 'none' }, // Hide it from drawer list if tabs are primary content
              drawerLabel: 'Home Base', // Or some other label if it wasn't hidden
            },
            tabNavigatorOptions: {
              // specific options for the bottom tab bar itself
            },
            tabScreenOptions: {
              // Default options for screens *inside* these tabs
              headerShown: false,
            },
            screens: [
              {
                type: 'screen',
                name: 'home',
                component: HomeScreen,
                href: '/drawer/home',
                options: {
                  title: 'Home',
                  tabBarIconName: 'home',
                },
              },
              {
                type: 'screen',
                name: 'account',
                component: AccountScreen,
                href: '/drawer/account',
                options: {
                  title: 'Account',
                  tabBarIconName: 'person',
                },
              },
              {
                type: 'screen',
                name: 'subs',
                component: SubsScreen,
                href: '/drawer/subs',
                options: {
                  title: 'Subscriptions',
                  tabBarIconName: 'subscriptions',
                },
              },
            ],
          },
          {
            type: 'screen',
            name: 'settings',
            component: SettingsScreen,
            href: '/drawer/settings',
            options: {
              // Options for 'settings' *as a screen/item* within the (drawer)
              title: 'Settings',
              drawerLabel: 'Settings',
            },
          },
          {
            type: 'screen',
            name: 'options',
            component: OptionsScreen,
            href: '/drawer/options',
            options: {
              // Options for 'options' *as a screen/item* within the (drawer)
              title: 'Options',
              drawerLabel: 'Options',
            },
          },
        ],
      },
    ],
  },
]

// --- Helper Functions ---
export const findNavigatorLayout = (
  name: string,
  structureToSearch: NavigationStructureItem[] = appNavigationStructure as NavigationStructureItem[] // Cast to allow top-level items
): NavigationStructureItem | undefined => {
  for (const item of structureToSearch) {
    if (item.name === name) return item

    // Check if it's a navigator type and has screens to search recursively
    if (
      'screens' in item &&
      (item as NavigatorLayout).screens &&
      Array.isArray((item as NavigatorLayout).screens)
    ) {
      const foundInScreens = findNavigatorLayout(
        name,
        (item as NavigatorLayout).screens as NavigationStructureItem[]
      )
      if (foundInScreens) return foundInScreens
    }
  }
  return undefined
}

export const getRootStackConfig = ():
  | StackNavigatorLayoutConfig
  | undefined => {
  const rootConfig = appNavigationStructure.find(
    (nav): nav is StackNavigatorLayoutConfig =>
      nav.type === 'stack' && nav.name === 'Root'
  )
  return rootConfig
}

// export const appNavigationStructure: NavigatorLayout[] = [
//   {
//     type: 'stack',
//     name: 'Root',
//     initialRouteName: '(drawer)', // Default to the drawer group
//     options: { headerShown: false },
//     screens: [
//       {
//         type: 'drawer',
//         name: '(drawer)', // Matches folder names: app/(drawer)
//         initialRouteName: '(tabs)', // The tabs are the default view inside the drawer
//         stackScreenOptions: {
//           // How (drawer) appears if Root stack showed headers
//           headerShown: false,
//         },
//         drawerNavigatorOptions: {
//           // Options for the Drawer.Navigator itself
//         },
//         drawerScreenOptions: {
//           // Default options for screens presented by the Drawer's header
//           headerShown: true,
//           // headerLeft will be platform-specific (Expo vs Next hooks)
//         },
//         screens: [
//           // 1. The Tabs Navigator, nested within the Drawer
//           {
//             type: 'tabs',
//             name: '(tabs)', // Route name for the Tabs group within the Drawer
//             component: ExpoRouterManagedComponent, // For Expo: app/(drawer)/(tabs)/_layout.tsx handles this
//             // For Next: href implies page at /drawer/(tabs) or /drawer
//             href: '/drawer', // Base path for tabs in Next.js (assuming it's root of /drawer)
//             initialRouteName: 'home',
//             options: {
//               // Options for how (tabs) appears AS A DRAWER ITEM
//               title: 'Vidream Main', // Fallback title for Drawer header if active tab has no title
//               drawerItemStyle: { display: 'none' }, // Hide this from the drawer panel
//             },
//             // stackScreenOptions: not applicable here as it's not in a stack directly
//             tabNavigatorOptions: {
//               // tabBarActiveTintColor: 'dodgerblue',
//             },
//             tabScreenOptions: {
//               // Default options for screens *inside* these tabs
//               headerShown: false, // Tabs screens don't show their own headers; Drawer's header is used
//             },
//             screens: [
//               // Actual tab screens
//               {
//                 name: 'home',
//                 component: HomeScreen,
//                 href: '/drawer/home', // Or just /drawer if home is the root of tabs
//                 options: {
//                   title: 'Home',
//                   tabBarIconName: 'home',
//                 },
//               },
//               {
//                 name: 'account',
//                 component: AccountScreen,
//                 href: '/drawer/account',
//                 options: {
//                   title: 'Account',
//                   tabBarIconName: 'person',
//                 },
//               },
//               {
//                 name: 'subs',
//                 component: SubsScreen,
//                 href: '/drawer/subs',
//                 options: {
//                   title: 'Subscriptions',
//                   tabBarIconName: 'subscriptions',
//                 },
//               },
//             ],
//           },
//           // 2. Other direct screens of the Drawer
//           {
//             name: 'settings',
//             component: SettingsScreen,
//             href: '/drawer/settings',
//             options: {
//               title: 'Settings', // Used for Drawer header title
//               drawerLabel: 'Settings', // Used for Drawer panel item
//             },
//           },
//           {
//             name: 'options',
//             component: OptionsScreen,
//             href: '/drawer/options',
//             options: {
//               title: 'Options',
//               drawerLabel: 'Options',
//             },
//           },
//         ],
//       },
//     ],
//   },
// ]

// // --- Helper Functions ---
// export const findNavigatorLayout = (
//   name: string,
//   structureToSearch: NavigationStructureItem[] = appNavigationStructure as NavigationStructureItem[] // Cast to allow top-level items
// ): NavigationStructureItem | undefined => {
//   for (const item of structureToSearch) {
//     if (item.name === name) return item

//     // Check if it's a navigator type and has screens to search recursively
//     if (
//       'screens' in item &&
//       (item as NavigatorLayout).screens &&
//       Array.isArray((item as NavigatorLayout).screens)
//     ) {
//       const foundInScreens = findNavigatorLayout(
//         name,
//         (item as NavigatorLayout).screens as NavigationStructureItem[]
//       )
//       if (foundInScreens) return foundInScreens
//     }
//   }
//   return undefined
// }

// export const getRootStackConfig = ():
//   | StackNavigatorLayoutConfig
//   | undefined => {
//   const rootConfig = appNavigationStructure.find(
//     (nav): nav is StackNavigatorLayoutConfig =>
//       nav.type === 'stack' && nav.name === 'Root'
//   )
//   return rootConfig
// }

// export const PlaceholderIcon = ({
//   name,
//   color,
//   size,
// }: {
//   name?: string
//   color: string
//   size: number
// }) => {
//   if (!name) return null
//   return (
//     <Text style={{ color, fontSize: size, fontWeight: 'bold' }}>
//       {name.substring(0, 2).toUpperCase()}
//     </Text>
//   )
// }

// import { ComponentType } from 'react'
// import { Text } from 'react-native' // For placeholder icon
// import { HomeScreen } from '../home/screen'
// import { AccountScreen } from '../account/screen'
// import { SubsScreen } from '../subs/screen'
// export const isAutoSaveEnabled = true
// export const isEditing = false
// // --- Configuration Types ---
// /**
//  * Generic options applicable to any screen in any navigator.
//  */
// export interface ScreenOptionsConfig {
//   title?: string
//   headerShown?: boolean
//   tabBarIconName?: string // Used for tab icons
// }
// /**
//  * Configuration for a single screen.
//  */
// export interface ScreenConfig {
//   name: string
//   component: ComponentType<any> // TODO: Consider a more specific type if possible
//   options?: ScreenOptionsConfig // Options specific to this screen
// }
// /**
//  * Options specific to the Tab.Navigator component itself (e.g., tab bar styling).
//  * These are props that would be passed directly to the <Tab.Navigator> component.
//  */
// export interface TabNavigatorOwnOptions {
//   tabBarActiveTintColor?: string
//   tabBarInactiveTintColor?: string
//   tabBarStyle?: object // Should be StyleProp<ViewStyle> in practice
// }
// /**
//  * Default screen options for screens *within* a TabNavigator.
//  * These are passed to the `screenOptions` prop of the <Tab.Navigator>.
//  */
// export interface TabNavigatorScreenOptions extends ScreenOptionsConfig {}
// /**
//  * Configuration for a Tab Navigator.
//  */
// export interface TabNavigatorLayoutConfig {
//   type: 'tabs'
//   name: string // Name of the tab group (e.g., '(tabs)')
//   initialRouteName?: string
//   screens: ScreenConfig[]
//   /** Options for this TabNavigator when it acts as a screen in a parent StackNavigator. */
//   stackScreenOptions?: ScreenOptionsConfig // e.g., { headerShown: false } for the (tabs) group in RootStack
//   /** Options for the <Tab.Navigator> component itself (e.g., tab bar styling). */
//   tabNavigatorOptions?: TabNavigatorOwnOptions
//   /** Default options for all screens *within* this TabNavigator (passed to <Tab.Navigator screenOptions={...}>). */
//   tabScreenOptions?: TabNavigatorScreenOptions // e.g., { headerShown: true } for all tab screens
// }
// /**
//  * Configuration for a Stack Navigator.
//  */
// export interface StackNavigatorLayoutConfig {
//   type: 'stack'
//   name: string
//   initialRouteName?: string
//   screens: (ScreenConfig | TabNavigatorLayoutConfig)[]
//   /** Default options for all screens *within* this StackNavigator, and for the navigator itself if nested. */
//   options?: ScreenOptionsConfig & {}
// }
// export type NavigatorLayout = StackNavigatorLayoutConfig | TabNavigatorLayoutConfig
// // --- Main Navigation Structure ---
// export const appNavigationStructure: NavigatorLayout[] = [
//   {
//     type: 'stack',
//     name: 'Root',
//     initialRouteName: '(tabs)',
//     options: { headerShown: false },
//     screens: [
//       {
//         type: 'tabs',
//         name: '(tabs)',
//         initialRouteName: 'home',
//         stackScreenOptions: {
//           // Options for how '(tabs)' group appears in 'Root' Stack
//           headerShown: false, // Header for the '(tabs)' group itself is hidden
//         },
//         tabNavigatorOptions: {
//           // Options for the <Tab.Navigator> component
//           // Example: tabBarActiveTintColor: 'dodgerblue',
//         },
//         tabScreenOptions: {
//           // Default options for screens *inside* this TabNavigator
//           headerShown: false, // Headers for 'index', 'account' screens will be shown by default
//           // Example: default header options for all tab screens
//         },
//         screens: [
//           {
//             name: 'home',
//             component: HomeScreen,
//             options: {
//               title: 'Home',
//               tabBarIconName: 'home',
//               headerShown: false, // Example: could override tabScreenOptions.headerShown for this specific tab
//             },
//           },
//           {
//             name: 'account',
//             component: AccountScreen,
//             options: {
//               title: 'Account',
//               tabBarIconName: 'person',
//               headerShown: false,
//             },
//           },
//           {
//             name: 'subs',
//             component: SubsScreen,
//             options: {
//               title: 'Subscriptions',
//               tabBarIconName: 'subscriptions',
//               headerShown: false,
//             },
//           },
//         ],
//       },
//     ],
//   },
// ]
// // --- Helper Functions ---
// export const findNavigatorLayout = (
//   name: string,
//   structure: (NavigatorLayout | ScreenConfig)[] = appNavigationStructure
// ): NavigatorLayout | ScreenConfig | undefined => {
//   for (const item of structure) {
//     if (item.name === name) return item
//     if ('screens' in item && Array.isArray(item.screens)) {
//       const foundInScreens = findNavigatorLayout(name, item.screens)
//       if (foundInScreens) return foundInScreens
//     }
//   }
//   return undefined
// }
// export const getRootStackConfig = (): StackNavigatorLayoutConfig | undefined => {
//   return appNavigationStructure.find((nav) => nav.type === 'stack' && nav.name === 'Root') as
//     | StackNavigatorLayoutConfig
//     | undefined
// }
// export const PlaceholderIcon = ({
//   name,
//   color,
//   size,
// }: {
//   name?: string
//   color: string
//   size: number
// }) => {
//   if (!name) return null
//   return (
//     <Text style={{ color, fontSize: size, fontWeight: 'bold' }}>
//       {name.substring(0, 2).toUpperCase()}
//     </Text>
//   )
// }
