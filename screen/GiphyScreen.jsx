import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, StyleSheet, Switch, ActivityIndicator } from 'react-native';
import GifItem from '../components/GiftItem';
import GiphyService from '../services/GiphyServices';

const defaultTheme = {
  backgroundColor: '#FFFFFF',
  textColor: '#000000',
  inputBorderColor: 'gray',
  cardColor: '#F0F0F0',
};

const darkTheme = {
  backgroundColor: 'grey',
  textColor: 'purple',
  inputBorderColor: '#FFFFFF',
  cardColor: '#444444',
};

const GiphyScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [trendingGIFs, setTrendingGIFs] = useState([]);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isFetching, setIsFetching] = useState(false); // State for loader

  const theme = isDarkTheme ? darkTheme : defaultTheme;

  useEffect(() => {
    fetchTrendingGIFs();
  }, []);

  useEffect(() => {
    // Debounce search functionality
    const debounceSearch = setTimeout(() => {
      if (searchText !== '') {
        setOffset(0);
        setSearchResults([]);
        searchGIFs(searchText);
      } else {
        fetchTrendingGIFs();
      }
    }, 500); // Adjust debounce time as needed

    // Clean up the timer
    return () => clearTimeout(debounceSearch);
  }, [searchText]);

  const fetchTrendingGIFs = async () => {
    try {
      setIsFetching(true);
      const data = await GiphyService.fetchTrendingGIFs(offset);
      setTrendingGIFs([...trendingGIFs, ...data]);
      setOffset(offset + 20);
    } catch (error) {
      console.error('Error fetching trending GIFs:', error);
    } finally {
      setIsFetching(false); 
    }
  };

  const searchGIFs = async (text) => {
    try {
      setIsFetching(true); 
      const data = await GiphyService.searchGIFs(text, offset);
      setSearchResults([...searchResults, ...data]);
      setOffset(offset + 20);
    } catch (error) {
      console.error('Error searching GIFs:', error);
    } finally {
      setIsFetching(false); 
    }
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handleEndReached = () => {
    if (!isLoading) {
      setIsLoading(true);
      if (searchText === '') {
        fetchTrendingGIFs();
      } else {
        searchGIFs(searchText);
      }
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.toggleContainer}>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkTheme ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleTheme}
          value={isDarkTheme}
        />
      </View>
      <TextInput
        style={[styles.input, { borderColor: theme.inputBorderColor, color: theme.textColor }]}
        placeholder="Search GIFs..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={searchResults.length > 0 ? searchResults : trendingGIFs}
        renderItem={({ item }) => (
          <GifItem
            item={item}
            theme={theme}
            downloadImage={GiphyService.downloadImage}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        onEndReached={handleEndReached}
        // onEndReachedThreshold={3}
        ListFooterComponent={
          isFetching ? (
            <ActivityIndicator size="large" color={theme.textColor} />
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    padding: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  toggleContainer: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
});

export default GiphyScreen;
