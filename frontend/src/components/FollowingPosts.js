import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../App';
import { Link } from 'react-router-dom';

const FollowingPosts = () => {

    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(UserContext);

    useEffect(() => {
        fetch("http://localhost:5000/followingPosts", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                setData(result.posts);
            })
    }, []);

    const likePost = (id) => {
        fetch("http://localhost:5000/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    };
                });
                setData(newData);
            }).catch(err => console.error(err));
    };

    const unlikePost = (id) => {
        fetch("http://localhost:5000/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    };
                });
                setData(newData);
            }).catch(err => console.error(err));
    };

    const makeComment = (text, postId) => {
        fetch("http://localhost:5000/comments", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                text,
                postId
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    };
                });
                setData(newData);
            }).catch(err => console.error(err));
    };

    const deletePosts = (postId) => {
        fetch(`http://localhost:5000/deletePost/${postId}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData);
            }).catch(err => console.error(err));
    };



    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5 className="profile-name"><Link to={item.author._id !== state._id ? "/profile/" + item.author._id : "/profile/"}>{item.author.name}</Link>
                                {
                                    item.author._id === state._id &&
                                    <i
                                        className="material-icons delete-icon"
                                        onClick={() => deletePosts(item._id)}>
                                        delete_forever
                                    </i>
                                }
                            </h5>
                            <div className="card-image">
                                <img src={item.image} />
                            </div>
                            <div className="card-content">
                                {item.likes.includes(state._id)
                                    ? <i
                                        onClick={() => unlikePost(item._id)}
                                        className="material-icons favorite-icon">
                                        favorite
                                    </i>
                                    :
                                    <i
                                        onClick={() => likePost(item._id)}
                                        className="material-icons">
                                        favorite_border
                                    </i>
                                }
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.description}</p>
                                {
                                    item.comments.map(record => {
                                        console.log(record);
                                        return (
                                            <h6 key={record._id}><span className="comment-author">{record.author.name}</span> {record.text} </h6>
                                        )
                                    })
                                }
                                <form onSubmit={e => {
                                    e.preventDefault();
                                    makeComment(e.target[0].value, item._id);
                                }}>
                                    <input type="text" placeholder="Add a comment" />
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
};

export default FollowingPosts;
