import * as React from 'react';

import { Form } from './form';

export class Register extends Form {
    constructor(props) {
        super(props);
        this.url = '/api/register';
        this.submitValue = 'Register';
        this.handleSuccess = this.handleSuccess.bind(this);
    }
    handleSuccess(resp) {
        console.log('success registering', resp);
    }
}
