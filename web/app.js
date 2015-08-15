require("./base.less");

import * as React from 'react';
import { Account } from './account';
import { Header } from './header';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { page: <Account /> };
    }
    render() {
        return (
            <div className="zdate">
            <Header />
            {this.state.page}
            </div>
        );
    }
}
