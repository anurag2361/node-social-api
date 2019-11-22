import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Comment from "./../Comment/Comment.js";
import axios from "axios";
import Header from "../Header/Header.js";
import ShowComments from "../ShowComments/ShowComments.js";

class PostView extends Component {
    constructor() {
        super();
        this.state = {
            posttext: "",
            updatedAt: "",
            likes: 0,
            comments: 0,
            showCommentBox: false,
            userid: "",
            postid: ""
        };
        this.incrementLike = this.incrementLike.bind(this);
        this.showComment = this.showComment.bind(this);
    }

    showComment() {
        console.log("called");
        this.setState({ showCommentBox: true });
    }

    incrementLike(likes) {
        this.setState({ likes: likes + 1 });
        axios.post("/user/" + this.state.userid + "/post/" + this.state.postid, {
            token: localStorage.getItem("token"),
            params: {
                status: "like"
            }
        }).then((data) => {
            console.log(data);
        }).catch((error) => {
            console.log(error);
            axios.post("/user/" + this.state.userid + "/post/" + this.state.postid, {
                token: localStorage.getItem("token"),
                params: {
                    status: "unlike"
                }
            }).then((data) => {
                this.setState({ likes: likes - 1 });
                console.log(data);
            }).catch((error) => {
                console.log(error);
            });
        });
    }

    componentWillMount() {
        const a = window.location.href.split("/");
        const postid = a[5];
        const userid = a[3];
        this.setState({ userid: userid, postid: postid });
        axios.get("/user/post/" + postid, {})
            .then((data) => {
                if (data.data.message === "Post Exists") {
                    console.log(data.data.data[0].counts.comments);
                    this.setState({ posttext: data.data.data[0].post, updatedAt: data.data.data[0].updatedAt.split("T")[0], comments: data.data.data[0].counts.comment, likes: data.data.data[0].counts.like });
                } else {
                    this.setState({ posttext: null });
                }
            }).catch((error) => {
                console.error(error);
            });
    }

    render() {
        console.log(this.state.likes, this.state.comments);
        return (
            <div>
                <Header></Header>
                <div className="jumbotron jumbotron-fluid" style={{ backgroundColor: "lavender" }}>
                    <div className="container">
                        <h1 className="display-4">{this.state.posttext}</h1>
                        <p className="lead">Modified At: {this.state.updatedAt}</p>
                        <button type="button" className="btn btn-primary" onClick={() => this.incrementLike(this.state.likes)}>
                            Likes <span className="badge badge-light">{this.state.likes}</span>
                        </button>
                        <button onClick={() => this.showComment()} type="button" className="btn btn-primary" style={{ marginLeft: "50px" }}>
                            Comments <span className="badge badge-light">{this.state.comments}</span>
                        </button>
                        {this.state.showCommentBox ? <Comment userid={this.state.userid} postid={this.state.postid}></Comment> : null}
                    </div>
                </div>
                <ShowComments userid={this.state.userid} postid={this.state.postid}></ShowComments>
            </div>
        )
    }
}
withRouter(PostView);
export default PostView;
