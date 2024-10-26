import { useRef, useState } from 'react';
import { db } from '../../config/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, deleteDoc, addDoc, collection } from 'firebase/firestore';
import AvatarDisplay from '../Profile/UserAvatar';
import { FaTrashAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { AiOutlineComment } from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import toast, { Toaster } from 'react-hot-toast';
import MainLoader from '../Loader/MainLoader';
import { parseDate } from '../../utils/utils';
import PostDetails from './PostDetails';

const PostCard = ({ post }) => {
    const { auth } = useSelector(state => state);
    const [loadingComment, setLoadingComment] = useState(false);
    const [isLiked, setIsLiked] = useState(post.likedBy.includes(auth?.userId));
    const commentInputRef = useRef();
    const [commentSectionVisible, setCommentSectionVisible] = useState(false);

    const handleLikeToggle = async () => {
        const postRef = doc(db, "posts", post.id);
        switch (post.likedBy.includes(auth?.userId)) {
            case true:
                try {
                    await updateDoc(postRef, { likedBy: arrayRemove(auth.userId) })
                        .then(() => setIsLiked(!isLiked))
                        .catch(() => toast.error("Erreur lors du retrait du like."));
                } catch (error) {
                    toast.error("Problème de connexion.");
                }
                break;

            case false:
                try {
                    await updateDoc(postRef, { likedBy: arrayUnion(auth.userId) })
                        .then(() => setIsLiked(!isLiked))
                        .catch(() => toast.error("Erreur lors de l'ajout du like."));
                } catch (error) {
                    toast.error("Problème de connexion.");
                }
                break;

            default:
                toast.error("Action inconnue lors du like.");
        }
    };

    const removePost = async () => {
        const postDocumentRef = doc(db, "posts", post.id);
        try {
            await deleteDoc(postDocumentRef)
                .then(() => {
                    toast.success("Publication supprimée avec succès.");
                })
                .catch((err) => {
                    toast.error("Erreur lors de la suppression de la publication.");
                    console.error("Erreur :", err);
                });
        } catch (err) {
            toast.error("Impossible de supprimer la publication.");
            console.error("Erreur :", err);
        }
    };
    
    const handleCommentSubmit = async () => {
        const commentValue = commentInputRef.current.value.trim();

        switch (true) {
            case commentValue === '':
                toast.error("Veuillez écrire un commentaire.");
                return;

            case loadingComment:
                return;

            default:
                setLoadingComment(true);
                try {
                    const postRef = doc(db, "posts", post.id);
                    const newComment = {
                        text: commentValue,
                        userId: auth.userId,
                        timestamp: new Date(),
                        user: {
                            name: auth.name,
                            email: auth.email
                        }
                    };
                    await addDoc(collection(postRef, "comments"), newComment)
                        .then(() => {
                            commentInputRef.current.value = "";
                            toast.success("Commentaire ajouté.");
                            setLoadingComment(false);
                        });
                } catch (error) {
                    toast.error("Impossible d'ajouter le commentaire.");
                    setLoadingComment(false);
                }
        }
    };

    return (
        <>
        <Toaster/>
        <div className="bg-white rounded-lg shadow-md max-w-lg mx-auto mb-6 p-4">
            <div className="flex items-center mb-4">
                <AvatarDisplay userId={post.userId} />
                <div className="ml-3">
                    <p className="font-semibold text-gray-800">{post?.user?.name}</p>
                    <p className="text-sm text-gray-500">{post?.user?.email}</p>
                </div>
            </div>
            <div className="relative">
                <img src={post.photoURL} alt="Post" className="w-full rounded-lg object-cover mb-4" />
                <div className="absolute top-3 right-3">
                    {auth?.uid === post.userId && (
                        <button onClick={removePost} className="text-red-600 hover:text-red-700 transition-all duration-200">
                            <FaTrashAlt size={20} />
                        </button>
                    )}
                </div>
            </div>
            <div className="flex justify-between items-center mb-3">
                <div className="flex space-x-5">
                    <button onClick={handleLikeToggle} disabled={!auth} className="focus:outline-none">
                        {isLiked ? <FaHeart size={25} color='red' /> : <CiHeart size={25} color='#000' />}
                    </button>
                    <button onClick={() => setCommentSectionVisible(!commentSectionVisible)} className="focus:outline-none">
                        <AiOutlineComment size={25} />
                    </button>
                </div>
                <p className="text-sm text-gray-500">{parseDate(post.timestamp)}</p>
            </div>
            <p className="text-gray-800 mb-4">{post.caption}</p>
            <div className="border-t pt-3">
                <div className="flex space-x-3 items-center">
                    <textarea ref={commentInputRef} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition" placeholder="Ajouter un commentaire..."></textarea>
                    <button onClick={handleCommentSubmit} className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-all duration-300 focus:outline-none">
                        {loadingComment ? <MainLoader /> : <FiSend size={18} />}
                    </button>
                </div>
            </div>
            {commentSectionVisible && (
                <PostDetails post={post} setShowComments={setCommentSectionVisible} />
            )}
        </div>
        </>
    );
};

export default PostCard;
