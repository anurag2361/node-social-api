import React, { Component } from "react";
import axios from "axios";

class Header extends Component {
    constructor() {
        super();
        this.logout = this.logout.bind(this);
    }

    logout() {
        const token = localStorage.getItem("token");
        const a = window.location.href.split("/");
        console.log(a);
        const headers = {
            "Authorization": token
        }
        axios.get("/" + a[3] + "/logout", { headers }).then((data) => {
            console.log(data);
        }).catch((error) => {
            console.error(error);
        });
        localStorage.removeItem("token");
        window.location = "/";
    }

    render() {
        return (
            <nav className="navbar navbar-dark bg-dark">
                <button type="button" onClick={this.logout} className="btn btn-danger">Log Out</button>
            </nav>
        )
    }
}
export default Header;
