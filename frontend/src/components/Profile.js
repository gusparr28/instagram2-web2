import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App';

const Profile = () => {

    const [images, setImages] = useState([]);
    const [image, setImage] = useState("");
    const { state, dispatch } = useContext(UserContext);

    useEffect(() => {
        fetch("http://localhost:5000/userPosts", {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setImages(result.userPosts)
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    useEffect(() => {
        if (image) {
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "instagram-web2");
            data.append("cloud_name", "instagram-web2");
            fetch("https://api.cloudinary.com/v1_1/instagram-web2/image/upload", {
                method: "post",
                body: data
            }).then(res => res.json())
                .then(data => {
                    fetch("http://localhost:5000/updatePhoto", {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            image: data.url
                        })
                    }).then(res => res.json())
                        .then(result => {
                            localStorage.setItem("user", JSON.stringify({
                                ...state,
                                image: result.image
                            }));
                            dispatch({
                                type: "UPDATEPHOTO",
                                paylaod: result.image
                            });
                            window.location.reload();
                        })
                }).catch(err => {
                    console.error(err);
                });
        }
    }, [image]);

    const updatePhoto = (file) => {
        setImage(file);
    };

    return (
        <div className="profile-wrapper">
            <div className="profile-container">
                <div>
                    <img className="profile-image"
                        src={state ? state.image : ""}
                    />
                </div>
                <div>
                    <h4>{state ? state.name : "Loading..."}</h4>
                    <h5>{state ? state.email : "Loading..."}</h5>
                    <div className="file-field input-field">
                        <div className="btn #42a5f5 blue darken-1">
                            <span>Change profile photo</span>
                            <input
                                type="file"
                                onChange={e => updatePhoto(e.target.files[0])}
                            />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>
                    <div className="profile-numbers">
                        <h5>{images.length} posts</h5>
                        <h5>{state ? state.followers.length : ""} followers</h5>
                        <h5>{state ? state.following.length : ""} following</h5>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    images.map(item => {
                        return (
                            <img key={item._id} className="item" src={item.image} alt={item.title} />
                        )
                    })
                }
            </div>
        </div>
    );
};

export default Profile;
