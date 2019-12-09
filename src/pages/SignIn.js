import React from 'react';
import { Button } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom'
import Login from '../components/Login'
import Register from '../components/Register'

const SignIn = (props) => {
    return (
        <div className="login-section">
            <Switch>
                <Route exact path='/' render={(props) => <Login {...props} />} />
                <Route path='/register' render={(props) => <Register {...props} />} />
            </Switch>
            <Button className="fbloginbt mt-2" variant="primary" size="lg" block onClick={() => window.location.replace('https://127.0.0.1:5000/login/facebook')}> Login with Facebook</Button>
        </div >
            );
        }
        
export default SignIn