import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

class Comment extends Component {
    constructor() {
        super();
        this.state = {
            comment: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const state = this.state;
        state[event.target.name] = event.target.value;
        this.setState(state);
    }

    componentDidMount() {
        console.log(this.props);
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state.comment);
        axios.post("/user/" + this.props.userid + "/post/" + this.props.postid, {
            token: localStorage.getItem("token"),
            params: {
                status: "comment"
            },
            comment: this.state.comment
        }).then((data) => {
            console.log(data.data);
            this.setState({ comment: "" });
            window.location.reload();
        }).catch((error) => {
            console.error(error);
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit} style={{ marginTop: "10px" }}>
                    <input className="form-control" name="comment" value={this.state.comment} onChange={this.handleChange} type="text" placeholder="Enter Comment"></input>
                    <button className="btn btn-success" type="submit" style={{ marginTop: "10px" }}>Comment</button>
                </form>
            </div>
        )
    }
}
withRouter(Comment);
export default Comment;
