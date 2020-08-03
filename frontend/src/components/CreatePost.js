import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

const CreatePost = () => {

    const history = useHistory();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");

    const postDetails = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "instagram-web2");
        data.append("cloud_name", "instagram-web2");
        fetch("https://api.cloudinary.com/v1_1/instagram-web2/image/upload", {
            method: "post",
            body: data
        }).then(res => res.json())
            .then(data => {
                fetch("http://localhost:5000/create", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("jwt")
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        image: data.url
                    })
                }).then(res => res.json())
                    .then(data => {
                        if (data.error) {
                            M.toast({ html: data.error, classes: 'rounded #e53935 red darken-1' });
                        } else {
                            M.toast({ html: 'Post successfully created', classes: 'rounded #43a047 green darken-1' });
                            history.push('/');
                        };
                    }).catch(err => console.error(err));
            })
            .catch(err => {
                console.error(err);
            });
    };

    return (
        <div className="card input-field">
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn #42a5f5 blue darken-1">
                    <span>Search image</span>
                    <input
                        type="file"
                        onChange={e => setImage(e.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button onClick={postDetails} className="btn waves-effect waves-light #42a5f5 blue darken-1">
                Upload post
            </button>
        </div>
    );
};

export default CreatePost;