import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRef, useState } from "react";
import { GrGallery } from "react-icons/gr";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { db, storage } from "../../config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import MainLoader from "../Loader/MainLoader";
import toast, { Toaster } from "react-hot-toast";
import UserAvatar from "../Profile/UserAvatar";

const CreatePostForm = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { auth } = useSelector((state) => state);
    const postTextRef = useRef();

    const handleImageSelection = (e) => {
        console.log(e.target.files[0]);
        setSelectedImage(e.target.files[0]);
    };

    const handleImageRemoval = () => {
        setSelectedImage(null);
    };

    const handlePostSubmission = async () => {
        setIsLoading(true);
        if (!selectedImage) {
            toast.error('Veuillez ajouter une image');
            setIsLoading(false);
            return;
        }
        try {
            const imageRef = ref(storage, `${auth.userId}/posts/${Date.now()}_${selectedImage.name}`);
            const imageSnapshot = await uploadBytes(imageRef, selectedImage);
            const uploadedImageURL = await getDownloadURL(imageSnapshot.ref);
      
            await addDoc(collection(db, 'posts'), {
                photoURL: uploadedImageURL,
                caption: postTextRef.current.value,
                userId: auth.userId,
                user: {
                    email: auth.email,
                    firstName: auth.name,
                    lastName: auth.family_name,
                },
                userProfilePic: auth?.photoURL ?? "none",
                timestamp: serverTimestamp(),
                likes: 0,
                comments: 0,
                likedBy: []
            }).then(() => {
                console.log("Post successfully added");
                window.location.reload();
            }).catch((error) => {
                console.error('Failed to add post: ', error);
                setIsLoading(false);
            });
        } catch (error) {
            console.error('Error while creating post: ', error);
            setIsLoading(false);
        }
    };

    return (
        <>
        <Toaster/>
        <div className="bg-gray-50 rounded-lg w-full max-w-[850px] shadow-lg">
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-300">
                <div></div>
                <p className="font-semibold text-lg">Créer un nouveau post</p>
                {isLoading ? (
                    <MainLoader />
                ) : (
                    <button onClick={handlePostSubmission} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-all">
                        Publier
                    </button>
                )}
            </div>
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 flex justify-center items-center p-5 relative border-r border-gray-200">
                    {selectedImage ? (
                        <img className="max-w-full max-h-[300px] object-cover rounded-md" src={URL.createObjectURL(selectedImage)} alt="chosen" />
                    ) : (
                        <p className="text-gray-400 text-5xl"><GrGallery/></p>
                    )}
                    <div className="absolute right-5 bottom-5 flex space-x-3">
                        <button onClick={handleImageRemoval} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-500 transition-all">
                            <IoClose/>
                        </button>
                        <label className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-500 transition-all cursor-pointer">
                            <GrGallery size={12} />
                            <input onChange={handleImageSelection} className="hidden" type="file" accept="image/*" />
                        </label>
                    </div>
                </div>
                <div className="md:w-1/2 flex flex-col justify-between p-5">
                    <div className="flex items-center space-x-4 mb-4">
                        <UserAvatar userId={auth.userId} />
                        <div>
                            <p className="text-lg font-semibold">{auth?.name}</p>
                            <p className="text-sm text-gray-500">{auth?.email}</p>
                        </div>
                    </div>
                    <textarea ref={postTextRef} className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 bg-gray-100 text-gray-700 placeholder-gray-400" rows="5" placeholder="Quoi de neuf ?"></textarea>
                </div>
            </div>
        </div>
        </>
    );
};

export default CreatePostForm;
