import { StatusBar } from 'expo-status-bar';
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import ManageExpense from './screens/ManageExpense';
import RecentExpenses from './screens/RecentExpenses';
import AllExpenses from './screens/AllExpensesScreen';
import IconButton from './components/UI/IconButton';

import { GlobalStyles } from './constants/styles';
import {Ionicons} from '@expo/vector-icons'
import ExpensesContextProvider from './store/expenses-context';

const Stack = createNativeStackNavigator()
const BottomTabs = createBottomTabNavigator()

function ExpensesOverview(){
  return(
    <BottomTabs.Navigator 
      screenOptions={({navigation})=>({
        headerStyle: {backgroundColor: GlobalStyles.colors.primary500}, //bg du header
        headerTintColor: 'white', //couleur ecriture dans header
        tabBarStyle: {backgroundColor: GlobalStyles.colors.primary500}, //bg de la bottom bar
        tabBarActiveTintColor: GlobalStyles.colors.accent500, //couleur de l'icone actif de la bottom bar
        headerRight: ({tintColor})=>{
          return(
            <IconButton 
              icon="add" 
              size={24} 
              color={tintColor} 
              onPress={()=>{
                navigation.navigate('ManageExpense')
              }}
            />
          )
        }
      })}
    >
      <BottomTabs.Screen 
        name={"RecentExpenses"} 
        component={RecentExpenses}
        options={{
          title: "Recent Expenses", //titre de l'écran qui apparat dans le header
          tabBarLabel: "Recent", //titre de l'icone dans la bottom bar
          tabBarIcon: ({color, size}) => <Ionicons name="hourglass" color={color} size={size}/>
        }}
      />
      <BottomTabs.Screen
        name={"AllExpenses"} 
        component={AllExpenses}
        options={{
          title: "All Expenses", //titre de l'écran qui apparat dans le header
          tabBarLabel: "All Expenses", //titre de l'icone dans la bottom bar
          tabBarIcon: ({color, size}) => <Ionicons name="calendar" color={color} size={size}/>
        }}
      />
    </BottomTabs.Navigator>
  )
}

export default function App() {
  return (
      <>
        <StatusBar style="light" />
        <ExpensesContextProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{
              headerStyle: {backgroundColor: GlobalStyles.colors.primary500 },
              headerTintColor: 'white'
            }}>
              <Stack.Screen 
                name="ExpensesOverview" 
                component={ExpensesOverview}
                options={{headerShown: false}} //Permet de cacher le header du stack et de garder celui du bottom tab
              />
              <Stack.Screen 
                name="ManageExpense" 
                component={ManageExpense}
                options={{
                  presentation: 'modal'
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ExpensesContextProvider>
      </> 
  );
}

