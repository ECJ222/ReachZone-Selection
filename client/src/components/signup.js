import React from 'react';
import { Link } from 'react-router-dom';
import Firebase from './firebase';

function Register(){

	const [name, setName] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [button, setButton] = React.useState(true);
	const [message, setMessage] = React.useState('');
	const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    //
	const Emailcheck = (e) => {
		setEmail(e.target.value);
	}

	const Namecheck = (e) => {
		setName(e.target.value);	
	}

	const Passwordcheck = (e) => {
		setPassword(e.target.value);
	}

	const onRegister = async (e) => {
		e.preventDefault();

		
		await Firebase.register(name, email, password)
		.then(() => {
			console.log('ok')
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

			    <Link to="/identity/login"><h2 className="inactive underlineHover trans"> Sign In </h2></Link>
			    <h2 className="active trans">Sign Up </h2>

			

			    {/* Login Form */}

			    <form>
			      <input type="text" id="login" className="fadeIn second trans" name="email" placeholder="E-mail" value={email} onChange={Emailcheck} required/>
			      {!pattern.test(email) && email.length !== 0 
			      	? 
			      	<>
			      		<p style={{color : 'red', fontSize : '12px'}}>E-mail is not valid</p>
			      	</>
			      	:
			      	<>  </>
			      }

			      {message !== '' 
			      	? 
			      	<>
			      
			      		<p style={{color : 'red', fontSize : '12px'}}>E-mail already exists</p>
			      	</>
			      	:
			      	<>  </>
			      }

			      <input type="text" id="login" className="fadeIn second trans" name="name" placeholder="name" value={name} onChange={Namecheck} required/>		      
			      <input type="password" id="password" className="fadeIn third trans" name="password" placeholder="Password" value={password} onChange={Passwordcheck} required/>
			      {password.length > 0 && password.length < 8
			      	? 
			      	<> <p style={{color : 'red', fontSize : '12px'}}>Password must be 8 characters in length</p> </>
			      	:
			      	<>  </>
			      }
			      <input type="submit" className="fadeIn fourth trans" style={name === '' || !pattern.test(email) || password.length < 8 ? {background : '#12604f'} : {background : '#36d9b6'}} value="Register" onClick={onRegister}
			        disabled={name === '' || !pattern.test(email) || password.length < 8 ? button : false}
			      />
			    </form>

			    {/* Login */}

			    <div id="formFooter">
			      <Link to="/identity/login"><a className="underlineHover trans">Already have an account ?</a></Link>
			    </div>

			  </div>
			</div>

		);
}

export default Register