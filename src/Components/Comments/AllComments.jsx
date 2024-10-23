import React, { useState, useEffect } from "react";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../config/firebase";
import Comment from "./Comment";

const CommentsSection = ({ postId }) => {
  const [commentsList, setCommentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch comments from Firestore
  useEffect(() => {
    const fetchCommentsData = async () => {
      try {
        const commentsRef = collection(db, "posts", postId, "comments");
        const commentsQuery = query(commentsRef, orderBy("timestamp", "asc")); // Ascending order
        const querySnapshot = await getDocs(commentsQuery);
        const fetchedComments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCommentsList(fetchedComments);
      } catch (err) {
        setError("Erreur lors du chargement des commentaires.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommentsData();
  }, [postId]);

  // Render loading, error or comments
  if (loading) {
    return (
      <div className="text-center py-4">Chargement des commentaires...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-4">{error}</div>;
  }

  return (
    <div className="comments-container space-y-4">
      {commentsList.length === 0 ? (
        <div className="text-gray-500 text-center">
          Aucun commentaire pour l'instant.
        </div>
      ) : (
        commentsList.map((comment) => (
          <Comment key={comment.id} postId={postId} comment={comment} />
        ))
      )}
    </div>
  );
};

export default CommentsSection;
