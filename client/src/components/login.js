import React from 'react';
import './static/login.css';
import { Link } from 'react-router-dom';
import Firebase from './firebase';

function Login(){

	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [button, setButton] = React.useState(true);
	const [message, setMessage] = React.useState('');
	const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	// 
	const Emailcheck = (e) => {
		setEmail(e.target.value);
	}

	const Passwordcheck = (e) => {
		setPassword(e.target.value);
	}

	const onLogin = async (e) => {
		e.preventDefault();

		
		await Firebase.login(email, password)
		.then(() => {
			console.log('ok');
			document.location.href = 'http://localhost:3000';
		})
		.catch((err) => {
			setMessage(err.message);
		});	

	}
	
	//
	return (

			<div className="wrapper fadeInDown">
			  <div id="formContent">
			    {/* <!-- Tabs Titles */}

			    <h2 className="active trans"> Sign In </h2>
			    <Link to="/identity/register"><h2 className="inactive underlineHover trans">Sign Up </h2></Link>

		
			    {/* Login Form */}

			    <form>
			      <input type="text" id="login" className="fadeIn second trans" name="email" placeholder="Email" value={email} onChange={Emailcheck} required/>
			      {!pattern.test(email) && email.length !== 0 
			      	? 
			      	<>
			      		<p style={{color : 'red', fontSize : '12px'}}>E-mail is not valid</p>
			      	</>
			      	:
			      	<>  </>
			      }
			      {message.includes('user record corresponding')
			      	? 
			      	<> <p style={{color : 'red', fontSize : '12px'}}>Email doesn't exist</p> </>
			      	:
			      	<>  </>
			      }
			      <input type="password" id="password" className="fadeIn third trans" name="passowrd" placeholder="Password" value={password} onChange={Passwordcheck} required/>
			      {password.length > 0 && password.length < 8
			      	? 
			      	<> <p style={{color : 'red', fontSize : '12px'}}>Password must be 8 characters in length</p> </>
			      	:
			      	<>  </>
			      }
			      {message.includes('password is invalid ')
			      	? 
			      	<> <p style={{color : 'red', fontSize : '12px'}}>Password Invalid</p> </>
			      	:
			      	<>  </>
			      }

			      <input type="submit" className="fadeIn fourth trans" value="Log In" onClick={onLogin} style={ !pattern.test(email) || password.length < 8 ? {background : '#12604f'} : {background : '#36d9b6'}}
			      	disabled={ !pattern.test(email) || password.length < 8 ? button : false}
			       />
			    </form>



			  </div>
			</div>

		);
}

export default Login