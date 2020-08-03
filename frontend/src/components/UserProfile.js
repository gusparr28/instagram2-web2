import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App';
import { useParams } from 'react-router-dom';

const UserProfile = () => {

    const [userProfile, setUserProfile] = useState(null);
    const { state, dispatch } = useContext(UserContext);
    const { userid } = useParams();
    const [showFollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true);

    useEffect(() => {
        fetch(`http://localhost:5000/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setUserProfile(result);
            })
    }, []);

    const followUser = () => {
        fetch("http://localhost:5000/follow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {
                dispatch({
                    type: "UPDATE",
                    payload: {
                        following: data.following,
                        followers: data.followers
                    }
                })
                localStorage.setItem("user", JSON.stringify(data));
                setUserProfile(prevState => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }
                    };
                });
                setShowFollow(false);
            });
    };

    const unfollowUser = () => {
        fetch("http://localhost:5000/unfollow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {
                dispatch({
                    type: "UPDATE",
                    payload: {
                        following: data.following,
                        followers: data.followers
                    }
                })
                localStorage.setItem("user", JSON.stringify(data));
                setUserProfile(prevState => {
                    const newFollower = prevState.user.followers.filter(item => item !== data._id)
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollower
                        }
                    };
                });
                setShowFollow(true);
            });
    };

    return (
        <>
            {userProfile ?
                <div className="profile-wrapper">
                    <div className="profile-container">
                        <div>
                            <img className="profile-image"
                                src={userProfile.user.image}
                            />
                        </div>
                        <div>
                            <h4>{userProfile.user.name}</h4>
                            <h5>{userProfile.user.email}</h5>
                            <div className="profile-numbers">
                                <h5>{userProfile.posts.length} posts</h5>
                                <h5>{userProfile.user.followers.length} followers</h5>
                                <h5>{userProfile.user.following.length} following</h5>
                            </div>
                            {showFollow
                                ?
                                <button onClick={followUser} className="btn waves-effect waves-light #42a5f5 blue darken-1 btn-follow">
                                    Follow
                            </button>
                                :
                                <button onClick={unfollowUser} className="btn waves-effect waves-light #42a5f5 blue darken-1 btn-unfollow">
                                    Unfollow
                            </button>
                            }
                        </div>
                    </div>
                    <div className="gallery">
                        {
                            userProfile.posts.map(item => {
                                return (
                                    <img key={item._id} className="item" src={item.image} alt={item.title} />
                                )
                            })
                        }
                    </div>
                </div>
                : <h2>Loading...</h2>}
        </>
    );
};

export default UserProfile;

