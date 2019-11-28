import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Header from "../Header/Header";

class GetFriends extends Component {
    constructor() {
        super();
        this.state = {
            "friends": []
        }
    }

    GotToProfile(id) {
        console.log(id);
        this.props.history.push("/" + id + "/profile");
    }

    async componentDidMount() {
        console.log(this.props);
        try {
            const headers = {
                "Authorization": localStorage.getItem("token")
            }
            const friends = await axios.get("/user/" + this.props.selfid + "/getfriends", { headers });
            console.log(friends.data);
            this.setState({ friends: friends.data });
        } catch (error) {
            throw new Error(error);
        }
    }

    render() {
        this.state.friends.map((friends, index) => {
            console.log(friends.recipient);
        })
        return (
            <div>
                <Header props={this.props}></Header>
                <div className="container" style={{ marginTop: "30px" }}>
                    <h1>Friends</h1>
                    <div className="row" style={{ marginTop: "10px" }}>
                        {this.state.friends.map((friends, index) => {
                            return (
                                <div key={friends.recipient._id + 2} className="col-sm-4" style={{ marginBottom: "20px" }}>
                                    <div key={friends.recipient._id + 3} className="card text-center" style={{ width: "18rem" }}>
                                        <div key={friends.recipient._id + 4} className="card-body">
                                            <p key={friends.recipient._id} className="card-text">{friends.recipient.name}</p>
                                            <button key={friends.recipient._id + 1} type="button" className="btn btn-primary" onClick={() => this.GotToProfile(friends.recipient._id)}>View Profile</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

withRouter(GetFriends)
export default GetFriends;