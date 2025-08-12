/* eslint-disable react-native/no-inline-styles */
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { FlatList } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

function generateJsonData(count: number) {
  const data = [];

  for (let i = 0; i < count; i++) {
    data.push({
      id: i + 1,
      name: `User_${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: Math.floor(Math.random() * 50) + 18, // Random age between 18 and 67
      createdAt: new Date().toISOString(),
    });
  }

  return data;
}

const UserListScreen = () => {
  const navigation: any = useNavigation();

  const list = generateJsonData(1000);

  const handleUserPress = (user: any) => {
    console.log('User--->', user);
    navigation.navigate('UserInfromationScreen', user);
  };

  const renderListItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => handleUserPress(item)}
        style={styles.userContaienr}
      >
        <Text>Name is : {item?.name}</Text>
        <Text>Age is : {item?.age}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
          }}
        >
          <FlatList data={list} renderItem={renderListItem} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  userContaienr: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'grey',
    margin: 8,
  },
});

export default UserListScreen;
