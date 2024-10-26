import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { FiUser } from 'react-icons/fi'; 

const UserAvatar = ({ userId }) => {
  const [avatarUrl, setAvatarUrl] = useState('/asset/profil.png');

  useEffect(() => {
    // Fonction pour gérer les mises à jour du snapshot
    const fetchAvatar = () => 
      onSnapshot(
        doc(db, 'users', userId), 
        (doc) => setAvatarUrl(doc?.data()?.avatar || '/asset/profil.png'),
        () => setAvatarUrl('/asset/profil.png')
      );

    const unsubscribe = userId ? fetchAvatar() : () => {}; // Exécute fetch si userId existe

    return () => unsubscribe(); // Nettoyage de l'abonnement
  }, [userId]);

  return (
    <div className='overflow-hidden w-[50px] h-[50px] rounded-[99px] flex justify-center items-center'>
      {avatarUrl ? (
        <img className='w-[90%] h-[90%] object-contain' src={avatarUrl} alt='user avatar' />
      ) : (
        <FiUser size="26px" className='mb-4 shadow bg-blue-500 text-white p-0 rounded-full hover:bg-blue-600 transition duration-300' />
      )}
    </div>
  );
};

export default UserAvatar;