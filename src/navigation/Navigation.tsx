import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserInfromationScreen, UserListScreen } from '../screen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator initialRouteName="UserListScreen">
      <Stack.Screen name="UserListScreen" component={UserListScreen} />
      <Stack.Screen
        name="UserInfromationScreen"
        component={UserInfromationScreen}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
