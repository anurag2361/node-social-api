import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import ShowPost from "./../ShowPost/ShowPost"
import axios from "axios";
import Header from "../Header/Header";
import jwt from "jsonwebtoken";

class Post extends Component {
    constructor() {
        super();
        this.state = {
            post: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const state = this.state;
        state[event.target.name] = event.target.value;
        this.setState(state);
    }

    componentWillMount() {
        const a = window.location.href.split("/");
        const token = localStorage.getItem("token");
        if (token) {
            const jwtobject = jwt.verify(token, "98ix0b84gs3r@&$#*np9bgkpfjeib1f9ipe");
            if (jwtobject.id === a[3]) {
                console.log("user validated");
            } else {
                window.location = "/";
            }
        } else {
            window.location = "/";
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const { post } = this.state;
        const a = window.location.href.split("/");
        console.log(localStorage.getItem("token"));
        axios.post("/user/" + a[3] + "/post", { token: localStorage.getItem("token"), post: this.state.post })
            .then((data) => {
                console.log(data);
                this.setState({ post: "" });
            }).catch((error) => {
                console.error(error);
            });
    }

    render() {
        const { post } = this.state;
        return (
            <div>
                <Header></Header>
                <form onSubmit={this.handleSubmit}>
                    <div className="jumbotron jumbotron-fluid">
                        <div className="container">
                            <h1 className="display-4">Write Your Post</h1>
                            <div className="form-group">
                                <textarea className="form-control" id="exampleFormControlTextarea1" name="post" value={this.state.post} onChange={this.handleChange} rows="3"></textarea>
                            </div>
                            <button className="btn btn-success" type="submit">Post</button>
                        </div>
                    </div>
                </form>
                <div>
                    <ShowPost />
                </div>
            </div>
        )
    }
}
withRouter(Post);
export default Post;
