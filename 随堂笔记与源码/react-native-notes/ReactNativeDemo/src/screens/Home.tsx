import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useColorScheme, View, Text, TouchableOpacity} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

// View div
// Text span
// TextInput input

export function HomeScreen(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handlePress = () => {
    navigation.navigate('Topics');
  };

  return (
    <View style={backgroundStyle}>
      <TouchableOpacity onPress={handlePress}>
        <Text>Go to Topics</Text>
      </TouchableOpacity>

      <Text>Home Screen</Text>
    </View>
  );
}


// const commonStyles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
//   header: {
//     fontSize: 32,
//     color: 'blue',
//     backgroundColor: 'yellow',
//   },
// });
// const headerStyles = StyleSheet.create({
//   header: {
//     fontSize: 24,
//     color: 'red',
//   },
// });
// const styles = StyleSheet.compose(commonStyles.header, headerStyles.header);
