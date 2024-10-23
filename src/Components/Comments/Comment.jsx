import React from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { AiOutlineDelete } from "react-icons/ai";
import { useSelector } from "react-redux";
import { parseDate } from "../../utils/utils"; // Remplace formatDate par parseDate
import AvatarDisplay from "../Profile/UserAvatar";
import toast, { Toaster } from "react-hot-toast";

const CommentItem = ({ comment, postId }) => {
  const { auth } = useSelector((state) => state);

  // Handle comment deletion
  const handleDeleteComment = async () => {
    try {
      await deleteDoc(doc(db, "posts", postId, "comments", comment.id));
      toast.success("Commentaire supprimé avec succès.");
    } catch (error) {
      toast.error("Erreur lors de la suppression du commentaire.");
    }
  };

  return (
    <>
      <Toaster />
      <div className="flex items-start gap-3 py-3 border-b">
        {/* Avatar */}
        <AvatarDisplay userId={comment.userId} />

        {/* Comment Content */}
        <div className="flex-1 bg-gray-100 p-3 rounded-lg">
          <div className="mb-1">
            <p className="font-semibold text-sm">{comment.user.name}</p>
            <p className="text-xs text-gray-500">
              {parseDate(comment.timestamp.seconds * 1000)}
            </p>{" "}
            {/* Utilisation de parseDate */}
          </div>
          <p className="text-sm text-gray-800">{comment.text}</p>
        </div>

        {/* Delete Button */}
        {auth && auth.userId === comment.userId && (
          <button
            onClick={handleDeleteComment}
            className="text-red-500 hover:text-red-700 transition-colors duration-200"
            aria-label="Supprimer le commentaire"
          >
            <AiOutlineDelete size={20} />
          </button>
        )}
      </div>
    </>
  );
};

export default CommentItem;
