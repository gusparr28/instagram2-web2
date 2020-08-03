import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';

const SignUp = () => {

    const history = useHistory();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (url) {
            userData();
        }
    }, [url]);

    const profileImage = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "instagram-web2");
        data.append("cloud_name", "instagram-web2");
        fetch("https://api.cloudinary.com/v1_1/instagram-web2/image/upload", {
            method: "post",
            body: data
        }).then(res => res.json())
            .then(data => {
                setUrl(data.url)
            }).catch(err => {
                console.error(err);
            });
    };

    const userData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: 'Invalid email', classes: 'rounded #e53935 red darken-1' });
            return;
        } else {
            fetch("http://localhost:5000/signup", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    image: url
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.error) {
                        M.toast({ html: data.error, classes: 'rounded #e53935 red darken-1' });
                    } else {
                        M.toast({ html: data.message, classes: 'rounded #43a047 green darken-1' });
                        history.push('/signin');
                    };
                }).catch(err => console.error(err));
        }
    };

    const sendData = () => {
        if (image) {
            profileImage();
        } else {
            userData();
        };
    };

    return (
        <div className="my-card">
            <div className="home-image">
                <img src="https://images.unsplash.com/photo-1567502401218-0aa88642ea13?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" />
            </div>
            <div className="card form-card">
                <h2>Instagram</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
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
                <div className="file-field input-field">
                    <div className="btn #42a5f5 blue darken-1">
                        <span>Set profile image</span>
                        <input
                            type="file"
                            onChange={e => setImage(e.target.files[0])}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button onClick={sendData} className="btn waves-effect waves-light #42a5f5 blue darken-1">
                    Sign Up
                </button>
                <h6><Link to="/signin">Already have an account?</Link></h6>
            </div>
        </div>
    );
};

export default SignUp;
