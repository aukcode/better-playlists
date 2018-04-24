import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

let textColor = '#fff';
let defaultStyle = {
  color: textColor
};
let fakeServerData = {
  user: {
    name: 'Øyvind',
    playlists: [
      {
        name: 'Chill',
        songs: [
          {name: 'Beat It', duration: 1235},
          {name: 'Rosa Helikopter', duration: 1235},
          {name: 'Cannelloni Makaroni', duration: 1235}
        ]
      },
      {
        name: 'Baluba',
        songs: [
          {name: 'Beat It', duration: 1235},
          {name: 'Rosa Helikopter', duration: 1235},
          {name: 'Cannelloni Makaroni', duration: 1235}
        ]
      },
      {
        name: 'Rock',
        songs: [
          {name: 'Beat It', duration: 1235},
          {name: 'Rosa Helikopter', duration: 1235},
          {name: 'Cannelloni Makaroni', duration: 1235}
        ]
      },
      {
        name: 'Allvers',
        songs: [
          {name: 'Beat It', duration: 641},
          {name: 'Rosa Helikopter', duration: 1235},
          {name: 'Cannelloni Makaroni', duration: 1235}
        ]
      }
    ]
  }
}

class PlaylistCounter extends Component{
  render(){
    return(
      <div style={{...defaultStyle, width: "40%", display: "inline-block"}}>
        <h2>{this.props.playlists && this.props.playlists.length} Playlists</h2>
      </div>
    );
  }
}

class HoursCounter extends Component{
  render(){
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs)
    },[])
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0)
    return(
      <div style={{...defaultStyle, width: "40%", display: "inline-block"}}>
        <h2>{Math.round(totalDuration/60)} Hours</h2>
      </div>
    );
  }
}

class Playlist extends Component{
  render(){
    let playlist = this.props.playlist
    return(
      <div style={{...defaultStyle, display: "inline-block", width: "25%"}}>
        <img/>
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.map(song =>
            <li>{song.name}</li>
          )}
        </ul>
      </div>
    );
  }
}

class Filter extends Component{
  render(){
    return(
      <div style={defaultStyle}>
        <img/>
        <input type="text"/>
        Filter
      </div>
    );
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = {serverData: {}}
  }
  componentDidMount(){
    setTimeout(() => {
        this.setState({serverData: fakeServerData})
    }, 1000)
  }
  render() {
    return (
      <div className="App">
        {this.state.serverData.user ?
          //This checks if we have a user and if so returns the stuff
          //after. Only workes on one tag, hence the following div
          // ? = turnary operator
          // cat ? 'my favorite cat' : 'something else'
          // If there is a cat, the first argument is returned
          <div>

            <h1 style={{...defaultStyle, 'font-size': '54px'}}>
              {this.state.serverData.user.name}
              's Playlists</h1>

            <PlaylistCounter playlists={this.state.serverData.user.playlists}/>
            <HoursCounter playlists={this.state.serverData.user.playlists}/>

            <Filter/>

            {this.state.serverData.user.playlists.map(playlist =>
              <Playlist playlist={playlist}/>
            )}



          </div>: <h1>Loading...</h1>
        }
      </div>
    );
  }
}

export default App;
