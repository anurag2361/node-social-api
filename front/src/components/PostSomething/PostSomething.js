import React, { Component } from "react";

class PostSomething extends Component {
    constructor() {
        super();
        this.gotoPost = this.gotoPost.bind(this);
    }

    gotoPost() {
        const a = window.location.href.split("/");
        console.log(a);
        console.log(this);
        //this.props.history.push("/" + a[3] + "/post");
        window.location = "/" + a[3] + "/post";
    }

    render() {
        return (
            <div>
                <button type="button" onClick={this.gotoPost} className="btn btn-primary">Post Something</button>
            </div>
        )
    }
}

export default PostSomething
