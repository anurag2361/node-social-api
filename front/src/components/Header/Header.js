import React, { Component } from "react";
import axios from "axios";
import SearchResult from "../SearchResult/SearchResult";

class Header extends Component {
    constructor() {
        super();
        this.state = {
            search: "",
            name: "",
            id: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.logout = this.logout.bind(this);
        this.home = this.home.bind(this);
        this.getFriends = this.getFriends.bind(this);
    }

    handleChange(event) {
        const state = this.state;
        state[event.target.name] = event.target.value;
        this.setState(state);
    }

    async deleteredistoken() {
        const a = window.location.href.split("/");
        const token = localStorage.getItem("token");
        const headers = {
            "Authorization": token
        }
        await axios.get("/user/" + a[3] + "/logout", { headers }).then((data) => {
            console.log(data);
        }).catch((error) => {
            console.error(error);
        });
    }

    home() {
        const a = window.location.href.split("/");
        window.location = "/" + this.props.selfid + "/profile";
    }

    async logout() {
        await this.deleteredistoken();
        localStorage.removeItem("token");
        window.location = "/";
    }

    async getFriends() {
        const a = window.location.href.split("/");
        window.location = "/" + a[3] + "/getfriends";
    }

    fetchData() {
        const a = window.location.href.split("/");
        axios({
            method: "POST",
            url: "/user/" + a[3] + "/search/",
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            data: {
                searchid: this.state.search
            }
        }).then((response) => {
            this.setState({
                name: response.data.data.body.hits.hits[0]._source.profile.name,
                id: response.data.data.body.hits.hits[0]._source.profile._id
            });
            const data = {
                name: this.state.name,
                id: this.state.id
            };
            this.props.props.history.push({ pathname: "/" + a[3] + "/search/result", payload: data });
        }).catch((error) => {
            console.error(error);
        });
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-dark bg-dark">
                    <button type="button" onClick={this.logout} className="btn btn-danger">Log Out</button>
                    <button type="button" onClick={this.home} className="btn btn-primary">Home</button>
                    <button type="button" className="btn btn-info" onClick={this.getFriends} style={{ marginLeft: "10px" }}>Friends</button>
                    <form className="form-inline" onSubmit={this.fetchData()}>
                        <input className="form-control mr-sm-2" value={this.state.search} type="search" name="search" onChange={this.handleChange} placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                    </form>
                </nav>
            </div>
        )
    }
}
export default Header;
