import React, { Component } from "react";
import Header from "../Header/Header";

class SearchResult extends Component {
    constructor() {
        super();
        this.state = {
        };
    }

    componentDidMount() {
        console.log(this.props.location.payload);
    }

    render() {
        return (
            <div>
                <Header />
                <div className="container" style={{ marginTop: "10px" }}>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <a className="navbar-brand">{this.props.location.payload.name}</a>
                    </nav>
                </div>
            </div>
        )
    }
}
export default SearchResult;
