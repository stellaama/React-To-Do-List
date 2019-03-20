import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Cookies from 'js-cookie';

class App extends Component {
  constructor(){
    super();
    this.state = {
      loggedIn: false
    };
  }

  handleLogin(){
    let user = this.refs.username.value;
    axios.post('https://hunter-todo-api.herokuapp.com/auth', { username: user})
    .then(res => {
      console.log(res);
      if (res.data.token){
        Cookies.set('token', res.data.token)
        Cookies.set('username', user);
        this.setState({loggedIn: true});
        console.log("ok done logging in")
      }
    })
    .catch((error) => {
      console.log(error)
      console.log("That user doesn't exist")
    })
  }

  handleLogout(){
    this.setState({loggedIn: false})
    Cookies.remove('token')
    Cookies.remove('username')
  }

  render() {
    let header =
    <div>
    <h2>To-Do List App</h2>
    <h2>Welcome! Sign In or Register!</h2>
    </div>

    const { loggedIn } = this.state;
    let display;
    if (loggedIn){
      header = <h2>{Cookies.get('username')}'s To-Do List</h2>
      display = <div> <h1>you are logged in!</h1>
      <button type = "submit" name= "submit" value = "Logout" onClick={() => this.handleLogout()}>Log out</button> </div>

    }
    else{
      display =
      <div>
        Login or Register: <br/>
        <input type="text" name="username" placeholder="username" ref="username"></input>
        <button type = "submit" name= "submit" value = "Login" onClick={() => this.handleLogin()}>Login</button>
        <button type = "submit" name="submit" value= "Register">Register</button>
      </div>
    }

    return (
      <div className="App">
      {header}
      {display}
      </div>
    );
  }
}

export default App;
