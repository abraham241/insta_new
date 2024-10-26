import { useRef, useState } from "react";
import Modal from "../Modal/Modal";
import { FiSend } from "react-icons/fi";
import MainLoader from "../Loader/MainLoader";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { addDoc, collection, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import AllComments from "../Comments/AllComments";

const PostModal = ({ postData, toggleComments }) => {
    const commentInputRef = useRef();
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const { auth } = useSelector(state => state);

    const submitComment = async () => {
        const commentText = commentInputRef.current.value.trim();

        switch (true) {
            case commentText === '':
                toast.error("Veuillez remplir le champ commentaire.");
                return;

            case isSubmittingComment:
                return;

            default:
                setIsSubmittingComment(true);
                try {
                    const postDocumentRef = doc(db, "posts", postData.id);
                    const newComment = {
                        content: commentText,
                        authorId: auth.userId,
                        createdAt: new Date(),
                        user: {
                            name: auth.name,
                            email: auth.email
                        }
                    };

                    await addDoc(collection(postDocumentRef, "comments"), newComment)
                        .then(() => {
                            commentInputRef.current.value = "";
                            toast.success("Commentaire ajouté avec succès.");
                            setIsSubmittingComment(false);
                        });
                } catch (error) {
                    toast.error("Erreur lors de l'ajout du commentaire.");
                    setIsSubmittingComment(false);
                }
        }
    };

    return (
        <Modal isOpen={true} closeModal={toggleComments}>
            <Toaster />
            <div className="w-[800px] p-2 grid grid-cols-2 bg-white gap-3 rounded h-[500px]">
                <div className="relative">
                    <img
                        className="w-full h-full object-contain"
                        src={postData.photoURL}
                        alt="post"
                    />
                </div>
                <div className="">
                    <div className="overflow-y-scroll h-[400px] py-2 remove-scroll">
                        <AllComments postId={postData.id} />
                    </div>
                    <div className="mt-2 grid grid-cols-[1fr_50px] border rounded overflow-hidden items-center px-3">
                        <textarea
                            className="resize-none py-2 outline-none"
                            ref={commentInputRef}
                            placeholder="Ajouter un commentaire..."
                        ></textarea>
                        <button
                            onClick={submitComment}
                            className="hover:bg-green-600 hover:text-white h-[50px] rounded-[99px] transition-all duration-500 flex justify-center items-center"
                        >
                            {isSubmittingComment ? <MainLoader /> : <FiSend size={20} />}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PostModal;
