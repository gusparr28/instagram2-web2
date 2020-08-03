import React, { useEffect, createContext, useReducer, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import './App.css';

import { reducer, initialState } from './reducers/userReducer';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Profile from './components/Profile';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import CreatePost from './components/CreatePost';
import UserProfile from './components/UserProfile';
import FollowingPosts from './components/FollowingPosts';

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push('signin');
    };
  }, []);

  return (
    <Switch>
      <Route exact path="/" component={Home}></Route>
      <Route exact path="/profile" component={Profile}></Route>
      <Route path="/signin" component={SignIn}></Route>
      <Route path="/signup" component={SignUp}></Route>
      <Route path="/create" component={CreatePost}></Route>
      <Route path="/profile/:userid" component={UserProfile}></Route>
      <Route path="/followingPosts" component={FollowingPosts}></Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Router>
        <Navbar />
        <Routing />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
