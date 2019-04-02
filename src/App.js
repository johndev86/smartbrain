import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';

import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  profileOpen: false,
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    age: 0,
    pet: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    const token = window.sessionStorage.getItem('token');
    if (token) {
      fetch(process.env.REACT_APP_API_URL+'/profile', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(resp => resp.json())
      .then(data => {
        if (data && data.id) {
          this.loadUser(data);
          this.onRouteChange('home');
        }
      })
    }
  }

  calculateFaceLocation = (data) => {
    const regions = data.outputs[0].data.regions;
    return regions.map(region => {
      const clarifaiFace = region.region_info.bounding_box;
      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    });
  }
  
  loadUser = (data) => {
    this.setState({
      user: {
        name: data.name,
        id: data.id,
        email: data.email,
        age: data.age,
        pet: data.pet,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  displayFaceBox = (boxes) => {
    this.setState({boxes: boxes});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  showProfile = () => {
    this.setState({profileOpen: true});
  }
  
  hideProfile = () => {
    this.setState({profileOpen: false});
  }

  onButtonSubmit = () => {
    const token = window.sessionStorage.getItem('token');
    this.setState({imageUrl: this.state.input});
    fetch(process.env.REACT_APP_API_URL+'/imageurl', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch(process.env.REACT_APP_API_URL+'/image', {
          method: 'put',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count }));
        })
        .catch(console.log);
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      window.sessionStorage.removeItem('token');
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  routeComponents = (route) => {
    const {boxes, imageUrl, isSignedIn, user, profileOpen} = this.state;
    switch (route) {
      case 'signin':
        return <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
      case 'register':
        return <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
      default:
        if (isSignedIn) {
          return (
          <div>
            {profileOpen && <Modal>
              <Profile loadUser={this.loadUser} user={user} hideProfile={this.hideProfile}></Profile>
            </Modal>}
            <Logo/>
                <Rank name={user.name} entries={user.entries}/>
                <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                <FaceRecognition boxes={boxes} imageUrl={imageUrl}/>
          </div>
          );
        }
        else {
          return <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        }
    }
  }

  render() {
    const {isSignedIn, route} = this.state;
    return (
      <div className="App">
        <Particles className="particles"
          params={particlesOptions}
          />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} showProfile={this.showProfile}/>
        {this.routeComponents(route)}
        
      </div>
    );
  }
}

export default App;
