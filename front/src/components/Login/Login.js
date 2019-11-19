import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const state = this.state;
        state[event.target.name] = event.target.value;
        this.setState(state);
    }

    handleSubmit(event) {
        event.preventDefault();
        const { email, password } = this.state;
        axios.post("/user/login", {
            email: this.state.email,
            password: this.state.password
        }).then((data) => {
            console.log(data);
            localStorage.setItem("token", data.data.token);
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
                    <p>Enter Email</p>
                    <input type="email" id="email" name="email" value={this.state.email} onChange={this.handleChange} />
                    <p>Enter Password</p>
                    <input type="password" id="password" name="password" value={this.state.password} onChange={this.handleChange} />
                    <button className="btn btn-success" type="submit">Submit</button>
                    <br />
                    <p>New User? <a href="/">Sign Up</a></p>
                </form>
            </div>
        )
    }
}
withRouter(Login);
export default Login;
