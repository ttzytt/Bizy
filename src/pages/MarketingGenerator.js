import React from 'react';

const Profile = () => {
    const user = {
        name: "John Doe",
        bio: "Web Developer | Tech Enthusiast | Lifelong Learner",
        location: "San Francisco, CA",
        avatar: "https://via.placeholder.com/150", // Placeholder image
    };

    return (
        <div>
            <img src={user.avatar} alt={`${user.name}'s avatar`} />
            <h2>{user.name}</h2>
            <p>{user.bio}</p>
            <p>{user.location}</p>
        </div>
    );
};

export default Profile;