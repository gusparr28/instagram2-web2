import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css'

const SignIn = () => {

    const { state, dispatch } = useContext(UserContext);
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const sendData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: 'Invalid email', classes: 'rounded #e53935 red darken-1' });
            return;
        }

        fetch("http://localhost:5000/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: 'rounded #e53935 red darken-1' });
                } else {
                    localStorage.setItem("jwt", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    dispatch({ type: "USER", payload: data.user });
                    M.toast({ html: 'User successfully signed in', classes: 'rounded #43a047 green darken-1' });
                    history.push('/');
                };
            }).catch(err => console.error(err));
    };

    return (
        <div className="my-card">
            <div className="card form-card">
                <h2>Instagram</h2>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button onClick={sendData} className="btn waves-effect waves-light #42a5f5 blue darken-1">
                    Sign In
                </button>
                <h6><Link to="/signup">Don't have an account? Sign up!</Link></h6>
            </div>
        </div>
    );
};

export default SignIn;
