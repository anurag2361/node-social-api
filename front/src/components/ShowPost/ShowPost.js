import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

class ShowPost extends Component {
    constructor() {
        super();
        this.state = {
            posts: [],
        };
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

    render() {
        return (
            <div>
                {this.state.posts.map((posts, index) => {
                    return (
                        <div className="card text-center mx-auto mt-4" style={{ width: "18rem" }}>
                            <div className="card-body">
                                <p key={index} className="card-text">{posts.post}</p>
                                <button className="btn btn-primary" style={{ marginRight: "50px" }}>Like</button>
                                <button className="btn btn-info">Comment</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}
withRouter(ShowPost);
export default ShowPost;
