import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';

export function TopicsScreen(): React.JSX.Element {
  const [topics, setTopics] = useState<{id: string; title: string}[]>([]);

  useEffect(() => {
    fetch('https://cnodejs.org/api/v1/topics')
      .then(response => response.json())
      .then(json => setTopics(json.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <View>
      <Text>Topics</Text>
      <FlatList
        data={topics}
        renderItem={({item}) => (
          <TouchableOpacity>
            <Text>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}
