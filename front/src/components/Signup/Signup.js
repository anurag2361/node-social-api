import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            phone: "",
            email: "",
            password: "",
            response: ""
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
        console.log(this.props.history);
    }

    handleSubmit(event) {
        event.preventDefault();
        const { name, phone, email, password } = this.state;
        axios.post("user/signup", {
            name: this.state.name,
            phone: this.state.phone,
            email: this.state.email,
            password: this.state.password
        }).then((data) => {
            this.setState({ response: data });
            this.props.history.push({ pathname: `${data.data.data._id}/profile`, payload: data });
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        const { name, phone, email, password } = this.state;
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <p>Enter Name</p>
                    <input type="text" id="name" name="name" value={this.state.name} onChange={this.handleChange} />
                    <p>Enter Phone</p>
                    <input type="number" id="phone" name="phone" value={this.state.phone} onChange={this.handleChange} />
                    <p>Enter Email</p>
                    <input type="email" id="email" name="email" value={this.state.email} onChange={this.handleChange} />
                    <p>Enter Password</p>
                    <input type="password" id="password" name="password" value={this.state.password} onChange={this.handleChange} />
                    <button className="btn btn-success" type="submit">Submit</button>
                    <br />
                    <p>Already a user? <a href="/login">Log In</a></p>
                </form>
            </div>
        )
    }
}
withRouter(Signup);
export default Signup;
