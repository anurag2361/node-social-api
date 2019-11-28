import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Header from "../Header/Header";
import jwt from "jsonwebtoken";
import AddFriendButton from "../AddFriendButton/AddFriendButton";
import PostSomething from "../PostSomething/PostSomething";

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            name: "",
            phone: "",
            selfProfile: false,
            self_id: ""
        }
    }

    async setBoolean(value) {
        await this.setState({ selfProfile: value });
    }

    async fetchProfileData(a) {
        const headers = {
            "Authorization": localStorage.getItem("token")
        }
        await axios.get("/user/" + a[3] + "/profile", { headers })
            .then((data) => {
                this.setState({
                    name: data.data.data.name,
                    email: data.data.data.email,
                    phone: data.data.data.phone
                });
            }).catch((error) => {
                console.log(error);
            });
    }

    async validateToken(a, value) {
        await this.setBoolean(value);
        if (this.state.selfProfile === true) {
            await this.fetchProfileData(a);
        } else {
            await this.fetchProfileData(a);
        }
    }

    async selfId(jwtobject) {
        await this.setState({ self_id: jwtobject.id });
    }

    async componentWillMount() {
        this._isMounted = true;
        const a = window.location.href.split("/");
        const token = localStorage.getItem("token");
        if (this._isMounted) {
            if (token) {
                const jwtobject = jwt.verify(token, "98ix0b84gs3r@&$#*np9bgkpfjeib1f9ipe");
                await this.selfId(jwtobject).then((value) => {
                    if (jwtobject.id === a[3]) {
                        // this is self profile
                        this.validateToken(a, true).then((value) => {
                            console.log("done");
                        }).catch((error) => {
                            throw new Error(error);
                        });
                    } else {
                        // this is different profile
                        this.validateToken(a, false).then((value) => {
                            console.log("done");
                        }).catch((error) => {
                            throw new Error(error);
                        });
                    }
                });
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
                <Header props={this.props} selfid={this.state.self_id}></Header>
                <div className="jumbotron">
                    <h1 className="display-4">Hello, {this.state.name}!</h1>
                    <hr className="my-4" />
                    <ul>
                        <li>Phone Number: {this.state.phone}</li>
                        <li>Email: {this.state.email}</li>
                    </ul>
                    {this.state.selfProfile ? <PostSomething /> : ""}
                    {this.state.selfProfile ? "" : <AddFriendButton selfid={this.state.self_id} />}
                </div>
            </div>
        )
    }
}
withRouter(Profile);
export default Profile;
