import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Signup from './components/Signup/Signup';
import Profile from "./components/Profile/profile";
import Login from "./components/Login/Login";
import Post from "./components/Post/Post";
import PostView from "./components/PostView/PostView"
import SearchResult from './components/SearchResult/SearchResult';
import GetFriends from './components/GetFriends/GetFriends';

class Router extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path='/' component={Signup} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/:userid/profile" component={Profile} />
                    <Route exact path="/:userid/post" component={Post} />
                    <Route exact path="/:userid/post/:postid" component={PostView} />
                    <Route exact path="/:userid/search/result" component={SearchResult} />
                    <Route exact path="/:userid/getfriends" component={GetFriends} />
                </Switch>
            </div>
        )
    }
}
export default Router;