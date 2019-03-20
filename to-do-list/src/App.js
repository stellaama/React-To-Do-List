import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Cookies from 'js-cookie';

class App extends Component {
  constructor(){
    super();
    this.state = {
      loggedIn: false,
      feedback:"",
      toDoList: []
    };
  }

  componentDidMount(){
    if (Cookies.get('token')){
      this.setState({loggedIn: true});
      this.printToDoList();
    }
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
        this.printToDoList();
      }
    })
    .catch((error) => {
      console.log(error)
      this.setState({feedback: "That user doesn't exist"})
    })
    this.refs.username.value = "";
  }

  handleLogout(){
    this.setState({loggedIn: false})
    Cookies.remove('token')
    Cookies.remove('username')
  }

  handleRegister(){
    let user = this.refs.username.value;
    axios.post('https://hunter-todo-api.herokuapp.com/user', { username: user})
    .then(res => {
      //LOGGING NEW USER IN
      axios.post('https://hunter-todo-api.herokuapp.com/auth', { username: user})
      .then(res => {
        console.log(res);
        if (res.data.token){
          Cookies.set('token', res.data.token)
          Cookies.set('username', user);
          this.setState({loggedIn: true});
          console.log("ok done logging in")
          this.printToDoList();
        }
      })
      .catch((error) => {
        console.log(error)
        this.setState({feedback: "That user doesn't exist"});
      })
    })
    .catch((error) => {
      console.log(error)
      this.setState({feedback: "That user already exists"})
    })
    this.refs.username.value = "";
  }


  handleAddTask(){
    let task = this.refs.new_task.value;
    axios.post('https://hunter-todo-api.herokuapp.com/todo-item', {'content': task}, {headers: {'sillyauth': Cookies.get('token')}})
    .then(res => {
      this.printToDoList();
    })
    this.refs.new_task.value = "";
  }

  handleDeleteTask(task_id){
    console.log(task_id)
    axios.delete('https://hunter-todo-api.herokuapp.com/todo-item/'+ task_id, {headers: {'sillyauth': Cookies.get('token')}})
    .then(res => {
      this.printToDoList();
    })
  }

  handleChangeStatus(task_id, status){
    console.log(task_id)
    console.log(status)
    if (status == false)
    axios.put('https://hunter-todo-api.herokuapp.com/todo-item/' + task_id, {'completed': true }, {headers: {'sillyauth': Cookies.get('token')}})
    .then(res => {
      this.printToDoList();
    })
    else
    axios.put('https://hunter-todo-api.herokuapp.com/todo-item/' + task_id, {'completed': false }, {headers: {'sillyauth': Cookies.get('token')}})
    .then(res => {
      this.printToDoList();
    })
  }

  printToDoList(){
    axios.get('https://hunter-todo-api.herokuapp.com/todo-item', {headers: {'sillyauth': Cookies.get('token')}})
    .then(res => {
      this.setState({toDoList: res.data})
      console.log(res.data)
    })
  }

  render() {
    const { loggedIn, toDoList, feedback } = this.state;
    //HEADER MESSAGE (NOT LOGGED IN)
    let header =
    <div>
    <h2>To-Do List App</h2>
    <h2>Welcome! Sign in or Register!</h2>
    <h3>{feedback}</h3>
    </div>

    let display;
    if (loggedIn){
      header = <h1>{Cookies.get('username')} To-Do List</h1>
      display = <div>
      <table align="center">
        <thead>
          <tr>
            <th>Task</th>
            <th>Status</th>
            <th>Other Actions:</th>
          </tr>
        </thead>
        <tbody>
          {toDoList.map((data, i) => {
            let completed = "Need to Do"
            let actionButton = "Mark as Complete"
            if (data.completed){
              completed = "Completed"
              actionButton = "Mark as Incomplete"
            }
            return(
              <tr key={i}>
                <td>{data.content}</td>
                <td>{completed}</td>
                <td>
                  <button class="status" id="complete"type = "submit" name= "submit" value = "Status" onClick={() => this.handleChangeStatus(data.id, data.completed)}>{actionButton}</button>
                  <br/>
                  <button class= "status" id="delete" type = "submit" name= "submit" value = "Delete" onClick={() => this.handleDeleteTask(data.id)}>Delete</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <h2>New Task to be Completed:</h2>
      <input class="textbox" type="text" name="new_task" placeholder="Enter new task here" ref="new_task"></input>
      <button class="submit" type = "submit" name= "submit" value = "Submit" onClick={() => this.handleAddTask()}>Add Task</button>
      <br/>
      <button class="space" type = "submit" name= "submit" value = "Logout" onClick={() => this.handleLogout()}>Log out</button>
      </div>
    }
    else{
      display =
      <div>
        <input class="textbox" type="text" name="username" placeholder="username" ref="username"></input>
        <br/>
        <button class="submit" type = "submit" name= "submit" value = "Login" onClick={() => this.handleLogin()}>Login</button>
        <button class="submit" type = "submit" name="submit" value= "Register" onClick={() => this.handleRegister()}>Register</button>
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
