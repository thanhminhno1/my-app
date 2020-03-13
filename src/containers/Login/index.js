import React from 'react';
import { FormGroup } from '../../components/untils/index';

function Login() {
  return (
    <>
      <h2>Login</h2>
      <form>
        <FormGroup>
          <>
            <label> Email </label>
            <input type="email"></input>
          </>
        </FormGroup>
        <FormGroup>
          <>
            <label> Password </label>
            <input type="password"></input>
          </>
        </FormGroup>
      </form>
    </>
  )
}

export default Login;