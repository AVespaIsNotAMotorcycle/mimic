'use client';

import { useEffect, useState } from 'react';

import axios from 'axios';
import { useParams } from 'next/navigation';

import InteractButton from './InteractButton';
import Image from '../../components/Image';
import Loading from '../../components/Loading';
import Post from '../../components/Post';
import './page.css';

const Heading = ({ user, reloadUser = () => {} }) => {
  const {
    displayName,
    userName,
    backgroundPicture,
    profilePicture,
    bio,
    followers = [],
  } = user;
  const imagesURL = 'http://localhost:8000/images/';
  return (
    <div className="profile">
      <Image
        className="background-picture"
        source={backgroundPicture}
      />
      <div className="profile-heading">
        <div className="profile-picture-container">
          <Image
            className="profile-picture"
            source={profilePicture}
          />
        </div>
        <div className="names">
          <h1>{displayName}</h1>
          <div>{`@${userName}`}</div>
          <div>{`${followers.length} followers`}</div>
        </div>
        <div className="follow-button-container">
          <InteractButton reloadUser={reloadUser} user={user} />
        </div>
      </div>
      <div className="profile-bio">
        {bio}
      </div>
    </div>
  );
};

export default function Profile() {
  const { userName } = useParams();
  const [user, setUser] = useState();

  function loadUser() {
    axios.get(`/user/${userName}`).then(({ data }) => {
      setUser(data);
    });
  }
  function reloadUser() {
    setUser(null); loadUser();
  }
  useEffect(() => {
    loadUser();
  }, []);

  if (!user) return <Loading />;
  return (
    <React.Fragment>
      <Heading reloadUser={reloadUser} user={user} />
      {user.posts.map((post) => <Post key={post._id} {...post} />)}
    </React.Fragment>
  );
}
