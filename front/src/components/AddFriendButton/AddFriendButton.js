import React, { Component } from "react";
import axios from "axios";

class AddFriendButton extends Component {
    constructor() {
        super();
        this.state = {
            "requestStatus": "",
            "requesterid": "",
            "buttonValue": "Add Friend"
        }
        this.handleClick = this.handleClick.bind(this);
    }

    async checkSentStatus(recipientId, headers) {
        try {
            const data = await axios.get("/user/" + this.props.selfid + "/sentstatus/" + recipientId, { headers });
            console.log(data.data[0].friendcoll);
            if (this.props.selfid === data.data[0].friendcoll[0].requester && data.data[0].friendcoll[0].status === "requested") {
                console.log("hehe");
                this.setState({ buttonValue: "Friend Request Sent" });
                this.setState({ requestStatus: "requester" });
                return true;
            }
        } catch (error) {
            console.error(error);
        }
    }

    async checkRecievedStatus(recipientId, headers) {
        try {
            const data = await axios.get("/user/" + recipientId + "/recvdstatus/" + this.props.selfid, { headers });
            console.log(data.data[0].friendcoll);
            if (this.props.selfid === data.data[0].friendcoll[0].recipient && data.data[0].friendcoll[0].status === "pending") {
                console.log("huhu");
                this.setState({ buttonValue: "Accept Request" });
                this.setState({ requestStatus: "recipient" });
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
        }
    }

    async componentWillMount() {
        console.log(this.props);
        const a = window.location.href.split("/");
        const recipientId = a[3];
        const headers = {
            "Authorization": localStorage.getItem("token")
        }
        const isRequester = await this.checkSentStatus(recipientId, headers);
        console.log(isRequester);
        if (isRequester) {
            console.log("requester");
        } else if (isRequester === false || isRequester === undefined) {
            console.log("fasle")
            const isReciever = await this.checkRecievedStatus(recipientId, headers);
            if (isReciever) {
                console.log("reciever");
            }
        }
    }

    async handleClick() {
        const a = window.location.href.split("/");
        const recipientId = a[3];
        const headers = {
            "Authorization": localStorage.getItem("token")
        }
        console.log(this.state.buttonValue);
        if (this.state.buttonValue !== "Accept Request") {
            console.log("hii");
            const data = await axios.get("/user/" + this.state.requesterid + "/request/" + recipientId, { headers });
            console.log(data.data);
            if (data.data.message === "Friend Request sent") {
                this.setState({ requestStatus: true });
            }
        } else {
            console.log("hello");
            const accept = await axios.get("/user/" + recipientId + "/accept/" + this.props.selfid, { headers });
            console.log(accept.data);
            this.setState({ buttonValue: "Friends" });
        }
    }

    render() {
        return (
            <div>
                {/* {this.state.requestStatus === "requester" ? <button disabled={this.state.requestStatus === "requester"} onClick={this.handleClick} type="button" style={{ marginTop: "10px" }} className="btn btn-info">{this.state.buttonValue}</button> : <button onClick={this.handleClick} type="button" style={{ marginTop: "10px" }} className="btn btn-info">{this.state.buttonValue}</button>} */}
                {
                    (() => {
                        switch (this.state.requestStatus) {
                            case "requester":
                                return <button disabled={this.state.requestStatus === "requester"} onClick={this.handleClick} type="button" style={{ marginTop: "10px" }} className="btn btn-info">{this.state.buttonValue}</button>;
                            case "recipient":
                                return <button onClick={this.handleClick} type="button" style={{ marginTop: "10px" }} className="btn btn-info">{this.state.buttonValue}</button>;
                        }
                    })()
                }
            </div>
        );
    }
}

export default AddFriendButton
