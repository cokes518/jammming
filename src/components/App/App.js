import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: '',
      playlistTracks: [],
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    }


  // add track only if song doesn't exist in playlist
  addTrack(track) {
    let playlistNow = this.state.playlistTracks;
    if (playlistNow.find(savedTrack => savedTrack.id === track.id)) {
      return playlistNow;
    }
    else {
      playlistNow.push(track)
      this.setState({playlistTracks: playlistNow}) 
    }
  }

  removeTrack(track) {
    let playlistNow = this.state.playlistTracks;
    let newPlaylist = playlistNow.filter(removeTrack => removeTrack.id !== track.id);
    this.setState({playlistTracks: newPlaylist})
  }

  // update playlist name
  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  // save playlist to account
  savePlaylist(){
    let trackURIs = [];
    this.state.playlistTracks.forEach(playlistTrack => {trackURIs.push(playlistTrack.uri)});
  Spotify.savePlaylist(this.state.playlistName, trackURIs);
  this.setState({
    playlistTracks:[],
    playlistName: 'New Playlist',
    searchResults: [],
  })
  
  }


  // search spotify for songs
  search(term) {
    Spotify.search(term).then(tracks => {
      this.setState({searchResults: tracks});
    })
  }
  
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
           <SearchBar
              onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults 
                searchResults={this.state.searchResults}
                onAdd={this.addTrack} />
            <Playlist
                playlistName={this.state.playlistName}
                playlistTracks={this.state.playlistTracks}
                onNameChange={this.updatePlaylistName}
                onRemove={this.removeTrack}
                onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
} 


export default App;
