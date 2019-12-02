import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import "./style/Home.css";

import Badge from 'react-bootstrap/Badge'

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
            isLoggedIn: false,
            working:false
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

        if (!this.state.working) {
            this.setState({working:true});
            fetch('/api/signup', {
                method: 'POST',
                body: JSON.stringify(this.state),
                headers: {
                    'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                this.setState({working:false});
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
                this.props.setId(data.id);
            }) 
            .catch(err => {
                console.error(err);
                alert('Error logging in please try again');
            });
        }
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
                placeholder="Student #"
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
            <div>
                <h2>Informed Consent Form & Registration </h2>

                <div><strong>Title:</strong> PYBUGGY Study</div> 
                <div><strong>Investigators:</strong> Brian Harrington, Rachel D’souza, Angela Zavaleta Burney, Aditi Damale</div>

                <p>I hereby consent to participate in a usability study conducted by the Investigators (listed above) as part of research conducted by the Department of Computer & Mathematical Sciences at the University of Toronto Scarborough.</p>

                <p>By clicking “Submit”, I <strong>agree</strong> to participate in this study and the purpose of this study is to evaluate the usability and effectiveness of a new web application. Activity on this web application will be recorded. </p>

                <p>By clicking “Submit”, I <strong>understand</strong> that:</p>
                <ul>
                    <li>The procedures to be used are the coding problems on the app and the questionnaires that will be filled out.</li>
                    <li>The risks incurred by participating is possibly some frustration when completing the series of tasks.</li>
                    <li>I may receive compensation in the form of a bonus mark in <strong>CSCA20</strong></li>
                    <li>I am free to withdraw at any time during the study without the need to give any explanation or penalty.</li>
                    <li>All materials and results will be kept confidential. Identifying information is collected for the sole purpose of attributing bonus marks. </li>
                    <li>I can contact the course instructor, Brian Harrington (brian.harrigton@utsc.utoronto.ca) or invigilator Rachel (rachel.dsouza@mail.utoronto.ca) with any questions or concerns.</li>
                </ul>

                {this.state.working ?
                    <Badge pill variant="danger">Registering...</Badge>
                :
                    <span></span>
                }

                {page}
            </div>
            
        );
      }
    
}

export default withRouter(Registration);