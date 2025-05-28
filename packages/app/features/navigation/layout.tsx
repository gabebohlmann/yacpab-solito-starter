// packages/app/features/navigation/layout.tsx
import { ComponentType } from 'react'
import { Text, ViewStyle } from 'react-native'
import { HomeScreen } from '../home/screen'
import { AccountScreen } from '../account/screen'
import { SubsScreen } from '../subs/screen'
import { SettingsScreen } from '../settings/screen' // Assuming you have this
import { OptionsScreen } from '../options/screen' // Assuming you have this

type GenericNavigationOptions = any // Replace with specific types if possible/desired

export const isAutoSaveEnabled = true
export const isEditing = false

// --- Configuration Types ---

export interface ScreenOptionsConfig {
  title?: string
  headerShown?: boolean
  tabBarIconName?: string
  drawerLabel?: string | ((props: { focused: boolean; color: string }) => React.ReactNode)
  drawerIcon?: (props: { focused: boolean; color: string; size: number }) => React.ReactNode
  drawerItemStyle?: ViewStyle
}

export interface ScreenConfig {
  name: string
  component: ComponentType<any>
  options?: ScreenOptionsConfig
  href?: string // Optional: Primarily for Next.js linking
}

export interface TabNavigatorOwnOptions {
  tabBarActiveTintColor?: string
  tabBarInactiveTintColor?: string
  tabBarStyle?: ViewStyle
}

export interface TabNavigatorScreenOptions extends ScreenOptionsConfig {}

export interface TabNavigatorLayoutConfig {
  type: 'tabs'
  name: string
  initialRouteName?: string
  screens: ScreenConfig[] // Screens within tabs are always ScreenConfig
  stackScreenOptions?: ScreenOptionsConfig
  tabNavigatorOptions?: TabNavigatorOwnOptions
  tabScreenOptions?: TabNavigatorScreenOptions
}

// Forward declaration for recursive types
type NavigationSchemaItem = ScreenConfig | TabNavigatorLayoutConfig | DrawerNavigatorLayoutConfig

export interface DrawerNavigatorLayoutConfig {
  type: 'drawer'
  name: string
  initialRouteName?: string
  screens: NavigationSchemaItem[] // Drawer can contain simple screens or other navigators like Tabs
  stackScreenOptions?: ScreenOptionsConfig
  drawerNavigatorOptions?: GenericNavigationOptions
  drawerScreenOptions?: GenericNavigationOptions
}

export interface StackNavigatorLayoutConfig {
  type: 'stack'
  name: string
  initialRouteName?: string
  screens: NavigationSchemaItem[] // Stack can contain Screens, Tabs, or Drawers
  options?: ScreenOptionsConfig & {}
}

export type NavigatorLayout =
  | StackNavigatorLayoutConfig
  | TabNavigatorLayoutConfig
  | DrawerNavigatorLayoutConfig

export type NavigationStructureItem = NavigatorLayout | ScreenConfig // ScreenConfig shouldn't be at top level of appNavigationStructure

// --- Placeholder Components ---
// Used when the component is determined by file-system routing (Expo) or children (Next.js)
const ExpoRouterManagedComponent = () => null

// --- Main Navigation Structure ---
export const appNavigationStructure: NavigatorLayout[] = [
  {
    type: 'stack',
    name: 'Root',
    initialRouteName: '(drawer)',
    options: { headerShown: false },
    screens: [
      {
        type: 'drawer',
        name: '(drawer)',
        initialRouteName: '(tabs)',
        stackScreenOptions: {
          headerShown: false,
        },
        drawerNavigatorOptions: {
          // --- KEY ADDITIONS/MODIFICATIONS HERE ---
          defaultStatus: 'closed', // Explicitly tell the drawer to start closed
          drawerStyle: {
            backgroundColor: 'white', // Set a default background color. Replace 'white' with your theme's color.
            width: 280, // Or your desired drawer width
          },
          overlayColor: 'rgba(0, 0, 0, 0.5)', // Optional: for the screen overlay when drawer is open
          // drawerType: 'front', // 'front', 'back', 'slide'. Default is usually fine.
          // --- END KEY ADDITIONS ---
        },
        drawerScreenOptions: {
          headerShown: true,
          // headerLeft is handled in the platform-specific layout
        },
        screens: [
          // ... your (tabs), settings, options screens ...
          {
            type: 'tabs',
            name: '(tabs)',
            component: ExpoRouterManagedComponent,
            href: '/drawer',
            initialRouteName: 'home',
            options: {
              title: 'Vidream Main',
              drawerItemStyle: { display: 'none' },
            },
            tabNavigatorOptions: {},
            tabScreenOptions: {
              headerShown: false,
            },
            screens: [
              // ... tab screens (home, account, subs)
              {
                name: 'home',
                component: HomeScreen,
                href: '/drawer/home', // Or just /drawer if home is the root of tabs
                options: {
                  title: 'Home',
                  tabBarIconName: 'home',
                },
              },
              {
                name: 'account',
                component: AccountScreen,
                href: '/drawer/account',
                options: {
                  title: 'Account',
                  tabBarIconName: 'person',
                },
              },
              {
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
            name: 'settings',
            component: SettingsScreen,
            href: '/drawer/settings',
            options: {
              title: 'Settings',
              drawerLabel: 'Settings',
            },
          },
          {
            name: 'options',
            component: OptionsScreen,
            href: '/drawer/options',
            options: {
              title: 'Options',
              drawerLabel: 'Options',
            },
          },
        ],
      },
    ],
  },
]

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

export const getRootStackConfig = (): StackNavigatorLayoutConfig | undefined => {
  const rootConfig = appNavigationStructure.find(
    (nav): nav is StackNavigatorLayoutConfig => nav.type === 'stack' && nav.name === 'Root'
  )
  return rootConfig
}

export const PlaceholderIcon = ({
  name,
  color,
  size,
}: {
  name?: string
  color: string
  size: number
}) => {
  if (!name) return null
  return (
    <Text style={{ color, fontSize: size, fontWeight: 'bold' }}>
      {name.substring(0, 2).toUpperCase()}
    </Text>
  )
}

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
