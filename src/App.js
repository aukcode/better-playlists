import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import queryString from 'query-string';

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
        name: 'Discover Weekly',
        songs: [
          {name: 'Beat It', duration: 641},
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
        <img src={playlist.imageUrl} style={{width: '120px'}}/>
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
        <input type="text" onKeyUp={event => this.props
          .onTextChange(event.target.value)} />
        Filter
      </div>
    );
  }
}

class App extends Component {
  constructor(){
    super()
    this.state = {
      serverData: {},
      filterString: ''
    }
  }
  componentDidMount(){
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token
    if(!accessToken){
      return
    }
    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => this.setState({
      user: {
        name: data.id
      }
    }))

    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => this.setState({
      playlists: data.items.map(item => ({
        name: item.name,
        imageUrl: item.images[0].url,
        songs: []
      }))
    }))
  }

  render() {
    let playlistToRender =
      this.state.user &&
      this.state.playlists ?
      this.state.playlists
    .filter(playlist =>
      playlist.name.toLowerCase().includes(
        this.state.filterString.toLowerCase())
    ) : []

    return (
      <div className="App">
        {this.state.user ?
          //This checks if we have a user and if so returns the stuff
          //after. Only workes on one tag, hence the following div
          // ? = turnary operator
          // cat ? 'my favorite cat' : 'something else'
          // If there is a cat, the first argument is returned
          <div>

            <h1 style={{...defaultStyle, 'font-size': '54px'}}>
              {this.state.user.name}
              's Playlists</h1>


            <PlaylistCounter playlists={playlistToRender}/>
            <HoursCounter playlists={playlistToRender}/>

            <Filter onTextChange={text => this.setState({filterString: text})}/>

            {playlistToRender.map(playlist =>
              <Playlist playlist={playlist}/>
            )}

          </div> : <button onClick={() => {
            window.location = window.location.href.includes('localhost')
            ? 'http://localhost:8888/login'
            : 'https://aukbackend.herokuapp.com/login'
            }
          }
            style={{padding: '20px', 'font-size': '50px',
             'margin-top': '20px'}}>Sign in with Spotify</button>
          }
      </div>
    );
  }
}

export default App;
