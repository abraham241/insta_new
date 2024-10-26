import React, { useState } from 'react';
import { storage, db } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import MainLoader from '../Loader/MainLoader';

const FormAvatar = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useSelector((state) => state);

  // Gestion de la sélection du fichier
  const handleFileSelection = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile || null);
    if (!selectedFile) {
      toast.error("Aucune image sélectionnée.");
    }
  };

  // Téléchargement du fichier et mise à jour de Firestore
  const handleFileUpload = async () => {
    switch (true) {
      case !file:
        toast.error("Veuillez sélectionner une image.");
        return;
      case isLoading:
        toast("Chargement déjà en cours.");
        return;
      default:
        setIsLoading(true);
        break;
    }

    const storagePath = `users/${auth.userId}/avatar`;

    try {
      const fileRef = ref(storage, storagePath);
      const uploadSnapshot = await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(uploadSnapshot.ref);

      await saveAvatarUrlToFirestore(fileUrl);
      toast.success("Profil mis à jour avec succès !");
      setFile(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast.error("Erreur de mise à jour du profil.");
    } finally {
      setIsLoading(false);
    }
  };

  // Mise à jour de l'URL de l'avatar dans Firestore
  const saveAvatarUrlToFirestore = async (url) => {
    const userRef = doc(db, 'users', auth.userId);

    try {
      const userDoc = await getDoc(userRef);

      // Choix d'options selon l'existence du document
      switch (true) {
        case !userDoc.exists():
          await setDoc(userRef, { avatar: url }, { merge: true });
          break;
        default:
          await updateDoc(userRef, { avatar: url });
          break;
      }
    } catch (error) {
      switch (error.code) {
        case "permission-denied":
          toast.error("Accès refusé. Vérifiez les autorisations.");
          break;
        case "unavailable":
          toast.error("Le service est temporairement indisponible.");
          break;
        default:
          toast.error("Erreur lors de la mise à jour de l'avatar.");
      }
      throw new Error("Erreur lors de la mise à jour de l'avatar dans Firestore");
    }
  };

  return (
    <>
      <Toaster />
      <div className="grid grid-rows-[400px_50px] bg-white p-2 gap-3 rounded w-full max-w-[500px] shadow">
        {/* Sélection de fichier et aperçu */}
        <div className="relative flex justify-center items-center bg-slate-100 rounded">
          <input
            type="file"
            accept="image/*"
            className="w-full h-full cursor-pointer absolute opacity-0"
            onChange={handleFileSelection}
          />
          {file ? (
            <img className="w-full h-full object-cover rounded" src={URL.createObjectURL(file)} alt="Preview" />
          ) : (
            <AiOutlineCloudUpload className="text-gray-400" size={50} />
          )}
        </div>

        {/* Bouton de téléchargement */}
        <button
          onClick={handleFileUpload}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center"
        >
          <span className="ml-2 text-center uppercase w-full">
            {isLoading ? <MainLoader /> : "Mettre à jour l'avatar"}
          </span>
        </button>
      </div>
    </>
  );
};

export default FormAvatar;
