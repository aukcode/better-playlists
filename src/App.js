import React, { Component } from 'react';
//import logo from './logo.svg';
import 'reset-css/reset.css';
import './App.css';
import queryString from 'query-string';

let textColor = '#fff';
let defaultStyle = {
  color: textColor,
  'font-family': 'Papyrus'
};

let counterStyle = {...defaultStyle,
  width: '40%',
  display: 'inline-block',
  'margin-bottom': '20px',
  'font-size': '20px',
  'line-height': '20px'
}

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
    let playlistCounterStyle = {counterStyle}
    return(
      <div style={playlistCounterStyle}>
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
    let totalDurationHours = Math.round(totalDuration/60)
    let isTooLow = totalDurationHours < 40
    let hoursCounterStyle = {...counterStyle,
      color: isTooLow ? 'red' : 'white',
      'font-weight': isTooLow ? 'bold' : 'normal',
    }
    return(
      <div style={hoursCounterStyle}>
        <h2>{totalDurationHours} Hours</h2>
      </div>
    );
  }
}

class Playlist extends Component{
  render(){
    let playlist = this.props.playlist
    return(
      <div style={{...defaultStyle,
          display: "inline-block",
          width: "25%",
          padding: '10px',
          background: this.props.index % 2
            ? '#C0C0C0'
            : '#808080'
        }}>
        <img src={playlist.imageUrl} style={{width: '120px'}}/>
        <h3>{playlist.name}</h3>
        <ul style={{'margin-top': '10px', 'font-weight': 'bold'}}>
          {playlist.songs.map(song =>
            <li style={{'padding-top': '2px'}}>{song.name}</li>
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
        <input type="text" onKeyUp={event =>
            this.props.onTextChange(event.target.value)}
            style={{...defaultStyle,
              color: 'black',
              'font-size': '20px',
              padding: '10px'}}/>
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
    .then(playlistData => {
      let playlists = playlistData.items
      let trackDataPromises = playlists.map(playlist => {
        let responsePromise = fetch(playlist.tracks.href, {
          headers: {'Authorization': 'Bearer ' + accessToken}
        })
        let trackDataPromise = responsePromise
        .then(response => response.json())
        return trackDataPromise
      })
      let allTracksDataPromises =
       Promise.all(trackDataPromises)
       let playlistsPromise = allTracksDataPromises.then(trackDatas => {
        trackDatas.forEach((trackData, i) => {
          playlists[i].trackDatas = trackData.items
          .map(item => item.track)
          .map(trackData => ({
            name: trackData.name,
            duration: trackData.duration_ms / 1000
          }))
        })
        return playlists
      })
      return playlistsPromise
    })
    .then(playlists => this.setState({
      playlists: playlists.map(item => {
        return{
          name: item.name,
          imageUrl: item.images[0].url,
          songs: item.trackDatas.slice(0,3)
        }
      })
    }))
  }

  render() {
    let playlistToRender =
      this.state.user &&
      this.state.playlists
      ? this.state.playlists.filter(playlist => {
        let matchesPlaylists = playlist.name.toLowerCase().includes(
          this.state.filterString.toLowerCase())
          let matchesSong = playlist.songs.find(song => song.name.toLowerCase()
          .includes(this.state.filterString.toLowerCase()))
        return matchesPlaylists || matchesSong
        }) : []

    return (
      <div className="App">
        {this.state.user ?
          //This checks if we have a user and if so returns the stuff
          //after. Only workes on one tag, hence the following div
          // ? = turnary operator
          // cat ? 'my favorite cat' : 'something else'
          // If there is a cat, the first argument is returned
          <div>

            <h1 style={{...defaultStyle,
                'font-size': '54px',
                'margin-top': '5px'
            }}>
              {this.state.user.name}
              s Playlists</h1>


            <PlaylistCounter playlists={playlistToRender}/>
            <HoursCounter playlists={playlistToRender}/>

            <Filter onTextChange={text => this.setState({filterString: text})}/>

            {playlistToRender.map((playlist, i) =>
              <Playlist playlist={playlist} index={i}/>
            )}

          </div> : <button onClick={() => window.location="http://localhost:8888/login"}
              style={{padding: '20px', 'font-size': '50px',
              'margin-top': '20px'}}>Sign in with Spotify</button>


          /*<button onClick={() => {
            window.location = window.location.includes('localhost')
            ? 'http://localhost:8888/login'
            : 'https://aukplaylists.herokuapp.com/login'
            }
          }
            style={{padding: '20px', 'font-size': '50px',
             'margin-top': '20px'}}>Sign in with Spotify</button>*/
          }
      </div>
    );
  }
}

export default App;
