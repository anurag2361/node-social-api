import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            name: "",
            phone: "",
        }
    }

    componentDidMount() {
        const a = window.location.href.split("/");
        const id = this.props.location.payload.data.data._id;
        localStorage.setItem("token", this.props.location.payload.data.token);
        const headers = {
            "Authorization": this.props.location.payload.data.token
        }
        axios.get(`/user/${id}/profile`, { headers })
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
    }

    render() {
        return (
            <div>
                <p>Hello {this.state.name}</p>
            </div>
        )
    }
}
withRouter(Profile);
export default Profile;
