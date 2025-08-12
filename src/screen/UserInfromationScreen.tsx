/* eslint-disable react-native/no-inline-styles */
import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const UserInfromationScreen = () => {
  const route = useRoute();
  const { params }: any = route;
  console.log('Prev scren data-->', params);

  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error(
      `Manually crashed from button press! For user ${params?.name}`,
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <TouchableOpacity
        style={{ padding: 12 }}
        onPress={() => {
          setShouldCrash(true);
        }}
      >
        <Text style={{ color: 'black' }}>
          Click here to check error boundry
        </Text>
      </TouchableOpacity>
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text>Name is : {params?.name}</Text>
        <Text>Age is : {params?.age}</Text>
      </View>
    </SafeAreaView>
  );
};

export default UserInfromationScreen;
