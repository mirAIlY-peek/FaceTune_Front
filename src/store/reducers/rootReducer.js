import { combineReducers } from 'redux';

import sessionReducer from './sessionReducer';
import userReducer from './userReducer';
import playlistReducer from './playlistReducer';
import browseReducer from './browseReducer';
import libraryReducer from './libraryReducer';
import uiReducer from './uiReducer';
import artistReducer from './artistReducer';
import albumReducer from './albumReducer';
import playerReducer from './playerReducer.js';
import searchReducer from './searchReducer';
import emotionReducer from "./emotionReducer.js";

export default combineReducers({
  sessionReducer,
  userReducer,
  playlistReducer,
  browseReducer,
  libraryReducer,
  uiReducer,
  artistReducer,
  albumReducer,
  searchReducer,
  emotionReducer,
  playerReducer
});
