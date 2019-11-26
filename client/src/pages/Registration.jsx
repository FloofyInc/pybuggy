import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import "./style/Home.css";

class Registration extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email : '',
            username : '',
            password: '',
            firstname: '',
            lastname: '',
            type: 0,
            isLoggedIn: false
        };
    }

    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    }

    onSubmit = (event) => {
        event.preventDefault();
        fetch('/api/signup', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.status === 200) {

                this.props.login();
                this.props.history.push('/');
                return res.json();
            } else {
                const error = new Error(res.error);
                throw error;
            }
        })
        .then(data => {
            this.props.setName(data);
            this.props.setAdmin(data.isAdmin);
        }) 
        .catch(err => {
            console.error(err);
            alert('Error logging in please try again');
        });
    }

    componentDidMount() {
        fetch('/api/checkToken', {
            headers: {
                'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.status === 200) {
                this.setState({
                    isLoggedIn:true
                });
            } else {
                this.setState({
                    isLoggedIn:false
                });
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error checking token');
        });
        
    }

    render() {
        var loginForm = (<form onSubmit={this.onSubmit}>
            <h1>Login Below!</h1>
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={this.state.email}
                onChange={this.handleInputChange}
                required
            />
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={this.state.username}
                onChange={this.handleInputChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={this.state.password}
                onChange={this.handleInputChange}
                required
            />
            <input
                type="text"
                name="firstname"
                placeholder="First Name"
                value={this.state.firstname}
                onChange={this.handleInputChange}
                required
            />
            <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={this.state.lastname}
                onChange={this.handleInputChange}
                required
            />

            <select name='type' value={this.state.type} onChange={this.handleInputChange}>
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
            </select>
            <input type="submit" value="Submit"/>
        </form>);
        var page = this.state.isLoggedIn ? this.props.history.push('/') : loginForm;
        return (
            page
        );
      }
    
}

export default withRouter(Registration);