import React, { useState, useEffect } from 'react';
import './App.css';
import { Route, Redirect } from "react-router-dom";


import SignIn from './components/Login';
import SignUp from "./components/SignUp";
import SearchDashboard from "./components/SearchDashboard";
import SavedSongs from "./components/SavedSongs";
import SearchHistory from "./components/SearchHistory";
import ExportToSpotify from "./components/ExportToSpotify";
import Moods from "./components/Moods";

import Home from "./components/Home";
import axiosWithAuth from './utils/axiosWithAuth';

// authorization
const protectRoute = Component => props => {
  if (localStorage.getItem("token")) {
    return <Component {...props} />;
  } else {
    return <Redirect to="/" />;
  }
};

const ProtectedHome = protectRoute(Home);
const ProtectedSearchDashboard = protectRoute(SearchDashboard);
const ProtectedSavedSongs = protectRoute(SavedSongs);
const ProtectedSearchHistory = protectRoute(SearchHistory);
const ProtectedExportToSpotify = protectRoute(ExportToSpotify);



function App() {

  const [data, setData] = useState([]);
  const [songs, setSongs] = useState([]);
  const [recs, setRecs] = useState([]);
  const [mainGraphUrl, setMainGraphUrl] = useState("initialState")
  const [recommendedIsChecked, setRecommendedIsChecked] = useState(false);
  const [updatedFavorites, setUpdatedFavorites] = useState(true);
  const [favoritesIdOnly, setFavoritesIdOnly] = useState([]);
  const [favorites, setFavorites] = useState([
    // { "artist": "Antonio Vivaldi", "id": "5N82c9RY2k4VeAel1pl5bJ", "large_image": "https://i.scdn.co/image/ab67616d0000b27325327b51212e48eecc13a39f", "med_image": "https://i.scdn.co/image/ab67616d00001e0225327b51212e48eecc13a39f", "small_image": "https://i.scdn.co/image/ab67616d0000485125327b51212e48eecc13a39f", "song_name": "Four Seasons op.8 (1987 Digital Remaster), Summer: Presto", "uri": "spotify:track:5N82c9RY2k4VeAel1pl5bJ" },
    // { "artist": "Jacques Offenbach", "id": "1ntwYN2nT0Dl3c8lne15ii", "large_image": "https://i.scdn.co/image/ab67616d0000b273aaedcd61fea6d0764fbbdcfd", "med_image": "https://i.scdn.co/image/ab67616d00001e02aaedcd61fea6d0764fbbdcfd", "small_image": "https://i.scdn.co/image/ab67616d00004851aaedcd61fea6d0764fbbdcfd", "song_name": "Can Can", "uri": "spotify:track:1ntwYN2nT0Dl3c8lne15ii" },
    // { "artist": "Antonio Vivaldi", "id": "3qwVqJyXKNiPZLz9VBMd6r", "large_image": "https://i.scdn.co/image/ab67616d0000b27381106b7ade8ee85b56545f71", "med_image": "https://i.scdn.co/image/ab67616d00001e0281106b7ade8ee85b56545f71", "small_image": "https://i.scdn.co/image/ab67616d0000485181106b7ade8ee85b56545f71", "song_name": "The Four Seasons, Violin Concerto No. 2 in G Minor, RV 315 \"Summer\": III. Presto", "uri": "spotify:track:3qwVqJyXKNiPZLz9VBMd6r" },
    // { "artist": "Wolfgang Amadeus Mozart", "id": "51xHvAUYQfhY29GcGlBM0n", "large_image": "https://i.scdn.co/image/ab67616d0000b273bf4b533ee6e9634a6fcd8882", "med_image": "https://i.scdn.co/image/ab67616d00001e02bf4b533ee6e9634a6fcd8882", "small_image": "https://i.scdn.co/image/ab67616d00004851bf4b533ee6e9634a6fcd8882", "song_name": "Piano Sonata No. 16 in C Major, K. 545 \"Sonata facile\": 1. Allegro", "uri": "spotify:track:51xHvAUYQfhY29GcGlBM0n" },
    // { "artist": "Hector Berlioz", "id": "1SHixA41Vy0TTlJJSX9Gbo", "large_image": "https://i.scdn.co/image/ab67616d0000b27394d21d1170f5ee91a039ae84", "med_image": "https://i.scdn.co/image/ab67616d00001e0294d21d1170f5ee91a039ae84", "small_image": "https://i.scdn.co/image/ab67616d0000485194d21d1170f5ee91a039ae84", "song_name": "Symphonie fantastique, Op. 14: Symphonie fantastique, Op. 14: IV. Marche au supplice", "uri": "spotify:track:1SHixA41Vy0TTlJJSX9Gbo" },
    // { "artist": "Dinah Jane", "id": "2LHIwubgdCjbbBaoP9gkWB", "large_image": "https://i.scdn.co/image/ab67616d0000b27386e227d3280fa2474f35c130", "med_image": "https://i.scdn.co/image/ab67616d00001e0286e227d3280fa2474f35c130", "small_image": "https://i.scdn.co/image/ab67616d0000485186e227d3280fa2474f35c130", "song_name": "Bottled Up", "uri": "spotify:track:2LHIwubgdCjbbBaoP9gkWB" },
    // { "artist": "Betty Who", "id": "2sCMZJOgQSMDWL1so9726y", "large_image": "https://i.scdn.co/image/ab67616d0000b273bce8baa37fb3db5c938be7f1", "med_image": "https://i.scdn.co/image/ab67616d00001e02bce8baa37fb3db5c938be7f1", "small_image": "https://i.scdn.co/image/ab67616d00004851bce8baa37fb3db5c938be7f1", "song_name": "Taste", "uri": "spotify:track:2sCMZJOgQSMDWL1so9726y" },
    // { "artist": "JoJo", "id": "4fcldiaLuLtByymqHk8XDX", "large_image": "https://i.scdn.co/image/ab67616d0000b2736f22f9db8574f06adc23ec4e", "med_image": "https://i.scdn.co/image/ab67616d00001e026f22f9db8574f06adc23ec4e", "small_image": "https://i.scdn.co/image/ab67616d000048516f22f9db8574f06adc23ec4e", "song_name": "Vibe.", "uri": "spotify:track:4fcldiaLuLtByymqHk8XDX" },
    // { "artist": "Fifth Harmony", "id": "2vHDurkzJ8dhCzoPzqiE2C", "large_image": "https://i.scdn.co/image/ab67616d0000b2737698096fb3a8beeeca3c6087", "med_image": "https://i.scdn.co/image/ab67616d00001e027698096fb3a8beeeca3c6087", "small_image": "https://i.scdn.co/image/ab67616d000048517698096fb3a8beeeca3c6087", "song_name": "Por Favor - Spanglish Version", "uri": "spotify:track:2vHDurkzJ8dhCzoPzqiE2C" },
    // { "artist": "Camila Cabello", "id": "5HwnezK198pJCEj1l2Adjy", "large_image": "https://i.scdn.co/image/ab67616d0000b2736eb0b9e73adcf04e4ed3eca4", "med_image": "https://i.scdn.co/image/ab67616d00001e026eb0b9e73adcf04e4ed3eca4", "small_image": "https://i.scdn.co/image/ab67616d000048516eb0b9e73adcf04e4ed3eca4", "song_name": "She Loves Control", "uri": "spotify:track:5HwnezK198pJCEj1l2Adjy" }
  ])

  useEffect(() => {
    axiosWithAuth()
      .get('https://spotify-song-suggester-app.herokuapp.com/users/user/favorites/images')
      .then(res => {
        console.log("DATA INFO HERE", res.data);
        setFavorites(res.data);
        setFavoritesIdOnly(res.data.map((object) => (object.trackid)))
        console.log("IM UR FAVORITE", favoritesIdOnly);
      })
      .catch(err => {
        console.log("axios error", err);
      })

  }, [updatedFavorites]);
  useEffect(() => {
    console.log(favoritesIdOnly, "res for myCurrentTopFiveArray on HomePage")
  }, [favoritesIdOnly])

  return (
    <div className="App">

      <Route exact path="/" render={(props) => <SignIn {...props} />}></Route>
      <Route exact path="/signup" render={(props) => <SignUp {...props} />}></Route>


      <Route path="/home" render={(props) => <ProtectedHome {...props} setUpdatedFavorites={setUpdatedFavorites} updatedFavorites={updatedFavorites} favoritesIdOnly={favoritesIdOnly} setSongs={setSongs} recommendedIsChecked={recommendedIsChecked} setRecommendedIsChecked={setRecommendedIsChecked} setRecs={setRecs} setMainGraphUrl={setMainGraphUrl} />}></Route>
      <Route exact path="/search" render={(props) => <ProtectedSearchDashboard {...props} setUpdatedFavorites={setUpdatedFavorites} updatedFavorites={updatedFavorites} songs={songs} setSongs={setSongs} recommendedIsChecked={recommendedIsChecked} setRecommendedIsChecked={setRecommendedIsChecked} setRecs={setRecs} recs={recs} mainGraphUrl={mainGraphUrl} setMainGraphUrl={setMainGraphUrl} />}></Route>
      <Route path="/saved-songs" render={(props) => <ProtectedSavedSongs {...props} setUpdatedFavorites={setUpdatedFavorites} updatedFavorites={updatedFavorites} favorites={favorites} setSongs={setSongs} setRecommendedIsChecked={setRecommendedIsChecked} recommendedIsChecked={recommendedIsChecked} setRecs={setRecs} setMainGraphUrl={setMainGraphUrl} />}></Route>
      <Route path="/search-history" render={(props) => <ProtectedSearchHistory {...props} setUpdatedFavorites={setUpdatedFavorites} updatedFavorites={updatedFavorites} setSongs={setSongs} recommendedIsChecked={recommendedIsChecked} setRecommendedIsChecked={setRecommendedIsChecked} setRecs={setRecs} setMainGraphUrl={setMainGraphUrl} />}></Route>
      <Route path="/moods" render={(props) => <Moods {...props} favoritesIdOnly={favoritesIdOnly} setUpdatedFavorites={setUpdatedFavorites} updatedFavorites={updatedFavorites} setSongs={setSongs} recommendedIsChecked={recommendedIsChecked} setRecommendedIsChecked={setRecommendedIsChecked} setRecs={setRecs} setMainGraphUrl={setMainGraphUrl} />}></Route>
      <Route path="/export-to-spotify" render={(props) => <ProtectedExportToSpotify  {...props} setUpdatedFavorites={setUpdatedFavorites} updatedFavorites={updatedFavorites} setSongs={setSongs} recommendedIsChecked={recommendedIsChecked} setRecommendedIsChecked={setRecommendedIsChecked} setRecs={setRecs} setMainGraphUrl={setMainGraphUrl} />}></Route>
    </div>
  );
}

export default App;
