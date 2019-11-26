import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Header from "../Header/Header";
import jwt from "jsonwebtoken";

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            name: "",
            phone: "",
        }
        this.gotoPost = this.gotoPost.bind(this);
    }

    gotoPost() {
        const a = window.location.href.split("/");
        console.log(a);
        console.log(this);
        this.props.history.push("/" + a[3] + "/post");
    }

    componentDidMount() {
        this._isMounted = true;
        const a = window.location.href.split("/");
        const token = localStorage.getItem("token");
        if (this._isMounted) {
            if (token) {
                const jwtobject = jwt.verify(token, "98ix0b84gs3r@&$#*np9bgkpfjeib1f9ipe");
                if (jwtobject.id === a[3]) {
                    const headers = {
                        "Authorization": localStorage.getItem("token")
                    }
                    axios.get(`/user/${a[3]}/profile`, { headers })
                        .then((data) => {
                            console.log(data);
                            this.setState({
                                name: data.data.data.name,
                                email: data.data.data.email,
                                phone: data.data.data.phone
                            });
                        }).catch((error) => {
                            console.log(error);
                        });
                } else {
                    window.location = "/";
                }
            } else {
                window.location = "/";
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <div>
                <Header props={this.props}></Header>
                <div className="jumbotron">
                    <h1 className="display-4">Hello, {this.state.name}!</h1>
                    <hr className="my-4" />
                    <ul>
                        <li>Phone Number: {this.state.phone}</li>
                        <li>Email: {this.state.email}</li>
                    </ul>
                    <button type="button" onClick={this.gotoPost} className="btn btn-primary">Post Something</button>
                </div>
            </div>
        )
    }
}
withRouter(Profile);
export default Profile;
