import React from 'react';
import { View, Image, Button, StyleSheet, TouchableOpacity } from 'react-native';
import GiphyService from '../services/GiphyServices';

const GifItem = ({ item, theme, downloadImage }) => {
  return (
    <View style={styles.gifContainer}>
      <TouchableOpacity onPress={() => {}}>
        <Image
          source={{ uri: item.images.fixed_height.url }}
          style={[styles.gif, { backgroundColor: theme.cardColor }]}
        />
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <Button
          title="Share"
          onPress={() => GiphyService.shareGIF(item.images.fixed_height.url)}
          color={theme.textColor}
        />
        <Button
          title="Download"
          onPress={() => downloadImage(
            item.images.fixed_height.url,
            (localImagePath) => {
              console.log('Image downloaded successfully:', localImagePath);
              // Do something with the downloaded image
            },
            (error) => {
              console.error('Error downloading image:', error);
              // Handle error
            }
          )}
          color={theme.textColor}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gifContainer: {
    flex: 1,
    flexDirection: 'column',
    margin: 5,
    alignItems: 'center',
  },
  gif: {
    width: '100%',
    height: 200,
    aspectRatio: 1,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default GifItem;
