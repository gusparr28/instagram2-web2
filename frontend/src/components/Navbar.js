import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App'

const NavBar = () => {

    const { state, dispatch } = useContext(UserContext);

    const history = useHistory();

    const renderList = () => {
        if (state) {
            return [
                <li><Link className="nav-link" to="/profile">Profile</Link></li>,
                <li><Link className="nav-link" to="/create">Create Post</Link></li>,
                <li><Link className="nav-link" to="/followingPosts">My Following Posts</Link></li>,
                <li>
                    <a onClick={() => {
                        localStorage.clear()
                        dispatch({ type: "CLEAR" })
                        history.push('/signin')
                    }} className="btn-floating btn-large waves-effect waves-light red"><i className="material-icons">exit_to_app</i>
                        Sign Out
                    </a>
                </li>
            ];
        } else {
            return [
                <li><Link className="nav-link" to="/signin">Sign In</Link></li>,
                <li><Link className="nav-link" to="/signup">Sign Up</Link></li>

            ];
        };
    };

    return (
        <nav className="nav-wrapper #42a5f5 blue lighten-1">
            <div className="container">
                <Link className="brand-logo left" to={state ? "/" : "/signin"}>Instagram</Link>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    {renderList()}
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;