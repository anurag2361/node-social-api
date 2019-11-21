import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PostView from "./../PostView/PostView";
import axios from "axios";

class ShowPost extends Component {
    constructor() {
        super();
        this.state = {
            posts: [],
        };
        this.ShowPostView = this.ShowPostView.bind(this);
    }

    componentWillMount() {
        const headers = {
            "Authorization": localStorage.getItem("token")
        }
        const a = window.location.href.split("/");
        const id = a[3];
        axios.get("/user/" + id + "/posts", { headers })
            .then((data) => {
                this.setState({ posts: data.data.data[0].posts });
            }).catch((error) => {
                console.error(error);
            });
    }

    ShowPostView(id) {
        const a = window.location.href.split("/");
        console.log(a[3]);
        console.log("called");
        console.log(id);
        window.location = "/" + a[3] + "/post/" + id;
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    {this.state.posts.map((posts, index) => {
                        return (
                            <div className="col-sm-4" style={{ marginBottom: "20px" }}>
                                <div className="card text-center" style={{ width: "18rem" }}>
                                    <div className="card-body">
                                        <p key={index} class="card-text">{posts.post}</p>
                                        <button type="button" className="btn btn-primary" onClick={() => this.ShowPostView(posts._id)}>View Post</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}
withRouter(ShowPost);
export default ShowPost;
