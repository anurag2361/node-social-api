import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

class ShowComments extends Component {
    constructor() {
        super();
        this.state = {
            comments: [],
        };
    }

    componentWillMount() {
        const headers = {
            "Authorization": localStorage.getItem("token")
        }
        axios.get("/user/" + this.props.userid + "/post/" + this.props.postid + "/getcomments", { headers })
            .then((data) => {
                console.log(data)
                this.setState({ comments: data.data.data[0].comments });
            }).catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <div className="container">
                <h4>Comments:</h4>
                {this.state.comments.map((comments, index) => {
                    return (
                        <div className="card" style={{ width: "28rem", marginLeft: "10px", marginBottom: "20px" }}>
                            <div key={index} className="card-body">{comments.commentText}</div>
                        </div>
                    )
                })}
            </div>
        )
    }
}
withRouter(ShowComments);
export default ShowComments;
