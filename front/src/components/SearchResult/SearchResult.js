import React, { Component } from "react";
import Header from "../Header/Header";

class SearchResult extends Component {
    constructor() {
        super();
        this.state = {
        };
        // this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        console.log(this.props.location.payload);
    }

    // handleClick() {
    //     console.log("this was clicked");
    //     this.props.history.push("/" + this.props.location.payload.id + "/profile");
    // }

    render() {
        return (
            <div>
                <Header />
                <div className="container" style={{ marginTop: "10px" }}>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <a href={"/" + this.props.location.payload.id + "/profile"} className="navbar-brand">{this.props.location.payload.name}</a>
                    </nav>
                </div>
            </div>
        )
    }
}
export default SearchResult;
