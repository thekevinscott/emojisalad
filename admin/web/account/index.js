import * as React from 'react';

import { Login } from './login';
import { Register } from './register';

export class Account extends React.Component {
    constructor(props) {
        super(props);
        this.onToggle = this.onToggle.bind(this);
        this.state = { type: 'login' };
    }
    onToggle() {
        this.setState({
            type : (this.state.type === 'login') ? 'register' : 'login' 
        });
    }
    render() {
        let page, link;
        if ( this.state.type === 'register' ) {
            page = <Register />
            link = 'Login';
        } else {
            page = <Login />
            link = 'Register';
        }

        //<a onClick={this.onToggle}>{link}</a>
        return (
            <div className="account">
                {page}
            </div>
        );
    }
}
