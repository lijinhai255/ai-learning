/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Platform, StatusBar} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {HomeScreen} from '../screens/Home';
import {DetailScreen} from '../screens/Detail';
import { TopicsScreen } from '../screens/Topics';

const TabBar = createBottomTabNavigator();

function BottomBar() {
  return (
    <TabBar.Navigator
      // sceneContainerStyle={{backgroundColor: '#F7F7F7'}}
      screenOptions={{
        headerShown: false,
      }}>
      <TabBar.Screen
        name="TabHome"
        component={HomeScreen}
        options={{
          tabBarLabel: '首页',
        }}
      />
      <TabBar.Screen
        name="TabOther"
        component={DetailScreen}
        options={{
          tabBarLabel: '其他',
        }}
      />
    </TabBar.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          ...Platform.select({
            android: {
              headerStatusBarHeight: StatusBar.currentHeight,
            },
          }),
          headerStyle: {
            backgroundColor: Colors.primary,
          },
        }}>
        <Stack.Screen name="BottomBar" component={BottomBar} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={HomeScreen} />
        <Stack.Screen name="Topics" component={TopicsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigator;
