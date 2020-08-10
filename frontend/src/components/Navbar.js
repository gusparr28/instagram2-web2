import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css';

const NavBar = () => {

    const { state, dispatch } = useContext(UserContext);
    const [userDetails, setUserDetails] = useState([]);
    const [search, setSearch] = useState("");
    const searchModal = useRef(null);
    const history = useHistory();

    useEffect(() => {
        M.Modal.init(searchModal.current);
    }, []);

    const renderList = () => {
        if (state) {
            return [
                <li key="1"><i data-target="modal1" className="large material-icons modal-trigger btn-search">search</i></li>,
                <li key="2"><Link className="nav-link" to="/profile">Profile</Link></li>,
                <li key="3"><Link className="nav-link" to="/create">Create Post</Link></li>,
                <li key="4"><Link className="nav-link" to="/followingPosts">My Following Posts</Link></li>,
                <li key="5">
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
                <li key="6"><Link className="nav-link" to="/signin">Sign In</Link></li>,
                <li key="7"><Link className="nav-link" to="/signup">Sign Up</Link></li>

            ];
        };
    };

    const fetchUsers = (query) => {
        setSearch(query);
        fetch("/searchUsers", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                query
            })
        }).then(res => res.json())
            .then(results => {
                setUserDetails(results.user);
            });
    };

    return (
        <nav className="nav-wrapper #42a5f5 blue lighten-1">
            <div className="container">
                <Link className="brand-logo left" to={state ? "/" : "/signin"}>Instagram</Link>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    {renderList()}
                </ul>
            </div>
            <div id="modal1" className="modal modal-search" ref={searchModal}>
                <div className="modal-content">
                    <input
                        type="text"
                        placeholder="Search users"
                        value={search}
                        onChange={e => fetchUsers(e.target.value)}
                    />
                    <ul className="collection">
                        {
                            userDetails.map(item => {
                                return (
                                    <Link to={item._id !== state._id ? "/profile/" + item._id : "/profile"} onClick={() => {
                                        M.Modal.getInstance(searchModal.current).close()
                                        setSearch("")
                                    }} ><li className="collection-item">{item.email}</li></Link>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="modal-footer">
                    <button onClick={() => setSearch("")} className="modal-close waves-effect waves-red btn-flat">Close</button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;