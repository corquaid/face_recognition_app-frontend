import React, { Component } from 'react';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import SignIn from './Components/SignIn/SignIn'
import Register from './Components/Register/Register'
import './App.css';
import Particles from 'react-particles-js';

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 700
      }
    }
  }
}

const initialState = {
  input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
      }
    }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  // Function to create bounding box 
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  createBox = (box) => {
    console.log(box)
    this.setState({ box });
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }  

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
      fetch('https://stormy-brook-23348.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input 
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://stormy-brook-23348.herokuapp.com/image', {
            method: 'put',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }))
          })
          .catch(console.log)
      }
      this.createBox(this.calculateFaceLocation(response))
      })
      .catch(console.log)
        
  }

  onRouteChange = (route) => {
    if (route === 'signout' || route === 'signin') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({ route });
  }
  
  render() {
    const { isSignedIn, imageUrl, box, route } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
                    params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} 
                    onRouteChange={this.onRouteChange}/>
        {route === 'home' 
          ? <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
               />
              <ImageLinkForm 
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
                />
              <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div> 
          : (
            route === 'signin'
            ? <SignIn 
                loadUser={this.loadUser}
                onRouteChange={this.onRouteChange}/>
            : <Register 
                loadUser={this.loadUser}
                onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
