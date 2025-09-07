import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserInfromationScreen, UserListScreen } from '../screen';
import UserProfilePicture from '../screen/UserProfilePicture';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator initialRouteName="UserProfilePicture">
      <Stack.Screen name="UserListScreen" component={UserListScreen} />
      <Stack.Screen
        name="UserInfromationScreen"
        component={UserInfromationScreen}
      />
      <Stack.Screen name="UserProfilePicture" component={UserProfilePicture} />
    </Stack.Navigator>
  );
};

export default Navigation;
