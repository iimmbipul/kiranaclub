import { Share } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { token } from './token';



const GiphyService = {
  fetchTrendingGIFs: async offset => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/trending?api_key=${token}&limit=20&offset=${offset}`,
      );
      const {data} = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching trending GIFs:', error);
      throw error;
    }
  },

  searchGIFs: async (text, offset) => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?q=${text}&api_key=${token}&limit=20&offset=${offset}`,
      );
      const {data} = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching GIFs:', error);
      throw error;
    }
  },
  shareGIF : async (url) => {
    try {
      const result = await Share.share({
        message: url,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared via', result.activityType);
        } else {
          console.log('Shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing GIF:', error);
    }
  },

  downloadImage: (imageUrl, onSuccess, onError) => {
    const {dirs} = RNFetchBlob.fs;
    const fileName = imageUrl.split('/').pop();
    const path = `${dirs.DocumentDir}/${fileName}`;

    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'png',
      path,
    })
      .fetch('GET', imageUrl)
      .then(res => {
        if (res.respInfo.status === 200) {
          onSuccess(path);
        } else {
          onError('Failed to download image');
        }
      })
      .catch(err => {
        console.error(err);
        onError(err.message || 'An error occurred while downloading the image');
      });
  },
};

export default GiphyService;
