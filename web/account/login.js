import * as React from 'react';

import { Form } from './form';

export class Login extends Form {
    constructor(props) {
        super(props);
        this.url = '/login';
        this.submitValue = 'Login';
        this.handleSuccess = this.handleSuccess.bind(this);
    }
    handleSuccess(resp) {
        console.log('success registering', resp);
    }
}
