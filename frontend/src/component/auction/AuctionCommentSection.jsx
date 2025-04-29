// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import axios from "axios";

// const socket = io("http://localhost:5555"); // your backend address

// export default function AuctionCommentSection({ auctionId, currentUser }) {
//   const [comments, setComments] = useState([]);
//   const [text, setText] = useState("");
//   const [replyTo, setReplyTo] = useState(null); // parent comment ID
//   const [openReplies, setOpenReplies] = useState({}); // Track open replies

//   useEffect(() => {
//     axios.get(`http://localhost:5555/comment/comment-all/${auctionId}`)
//       .then(res => setComments(res.data))
//       .catch(err => console.error(err));

//     socket.on("newAuctionComment", (comment) => {
//       if (comment.auctionId === auctionId) {
//         setComments(prev => [...prev, comment]);
//       }
//     });

//     return () => socket.off("newAuctionComment");
//   }, [auctionId]);

//   const submitComment = async (e) => {
//     e.preventDefault();
//     if (!text.trim()) return;

//     const newComment = {
//       auctionId,
//       userId: currentUser,
//       text,
//       parentId: replyTo,
//     };

//     await axios.post("http://localhost:5555/comment/comment-create", newComment);
//     setText("");
//     setReplyTo(null);
//   };

//   const toggleReplies = (commentId) => {
//     setOpenReplies(prev => ({
//       ...prev,
//       [commentId]: !prev[commentId],
//     }));
//   };

//   const renderComments = (parentId = null) => {
//     return comments
//       .filter(c => c.parentId === parentId)
//       .map(c => {
//         const childComments = comments.filter(child => child.parentId === c._id);
//         const hasReplies = childComments.length > 0;
//         const isOpen = openReplies[c._id];

//         return (
//           <div key={c._id} className={`mt-4 ${parentId ? "ml-6" : ""}`}>
//             <div className="bg-gray-100 shadow rounded-lg p-4">
//               <div className="flex items-center mb-2">
//                 <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
//                 <span className="ml-3 font-semibold text-gray-700 underline">{c.userId?.fName || "Unknown User"}</span>
//               </div>
//               <p className="text-gray-800 ml-2">{c.text}</p>
//               <div className="flex items-center gap-4 mt-2">
//                 <button
//                   onClick={() => setReplyTo(c._id)}
//                   className="text-blue-500 text-xs hover:underline"
//                 >
//                   Reply
//                 </button>

//                 {hasReplies && (
//                   <button
//                     onClick={() => toggleReplies(c._id)}
//                     className="text-gray-500 text-xs hover:underline"
//                   >
//                     {isOpen ? "Hide Replies" : `View ${childComments.length} Replies`}
//                   </button>
//                 )}
//               </div>
//             </div>

//             {isOpen && (
//               <div className="ml-6 mt-2 border-l-2 border-gray-300 pl-4">
//                 {renderComments(c._id)}
//               </div>
//             )}
//           </div>
//         );
//       });
//   };

//   return (
//     <div className="max-w-2xl mx-auto mb-20 p-4">
//       <h2 className="text-2xl font-bold mb-6 ">{comments.length} Comments</h2>

//       <form onSubmit={submitComment} className="mb-8 bg-white p-6 shadow-xl rounded-lg">
//         <textarea
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           rows="3"
//           placeholder={replyTo ? "Replying..." : "Write your comment..."}
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         />
//         <div className="flex gap-3 mt-4 justify-end">
//           {replyTo && (
//             <button
//               type="button"
//               onClick={() => setReplyTo(null)}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//             >
//               Cancel
//             </button>
//           )}
//           <button
//             type="submit"
//             className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
//           >
//             {replyTo ? "Reply" : "Submit"}
//           </button>
//         </div>
//       </form>

//       <div className="space-y-6">
//         {renderComments()}
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { format } from "date-fns";
import { FaReply, FaHeart, FaUserCircle, FaPaperPlane } from "react-icons/fa";

const socket = io("http://localhost:5555");

export default function AuctionCommentSection({ auctionId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [openReplies, setOpenReplies] = useState({});
  const [likedComments, setLikedComments] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5555/comment/comment-all/${auctionId}`)
      .then(res => setComments(res.data))
      .catch(err => console.error(err));

    socket.on("newAuctionComment", (comment) => {
      if (comment.auctionId === auctionId) {
        setComments(prev => [...prev, comment]);
      }
    });

    return () => socket.off("newAuctionComment");
  }, [auctionId]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newComment = {
      auctionId,
      userId: currentUser,
      text,
      parentId: replyTo,
    };

    try {
      await axios.post("http://localhost:5555/comment/comment-create", newComment);
      setText("");
      setReplyTo(null);
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const toggleReplies = (commentId) => {
    setOpenReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleLike = async (commentId) => {
    try {
      await axios.post(`http://localhost:5555/comment/like/${commentId}`, {
        userId: currentUser
      });
      setLikedComments(prev => [...prev, commentId]);
      setComments(prev => 
        prev.map(c => 
          c._id === commentId 
            ? { ...c, likes: (c.likes || 0) + 1 } 
            : c
        )
      );
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  const Comment = ({ comment, depth = 0 }) => {
    const isLiked = likedComments.includes(comment._id);
    const hasReplies = comments.some(c => c.parentId === comment._id);
    const isOpen = openReplies[comment._id];

    return (
      <div className={`pl-${depth * 4} mb-4 ${depth > 0 ? "border-l-2 border-gray-200" : ""}`}>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <FaUserCircle className="w-8 h-8 text-gray-500" />
            <div className="ml-2">
              <h3 className="font-semibold text-gray-800">
                {comment.userId?.fName || "Anonymous"}
              </h3>
              <p className="text-sm text-gray-500">
                {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
          <p className="text-gray-700 mb-3">{comment.text}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLike(comment._id)}
              className={`flex items-center ${isLiked ? "text-red-500" : "text-gray-500"} hover:text-red-500 transition-colors`}
              disabled={isLiked}
            >
              <FaHeart className="mr-1" />
              <span>{comment.likes || 0}</span>
            </button>
            {depth < 2 && (
              <button
                onClick={() => setReplyTo(comment._id)}
                className="flex items-center text-gray-500 hover:text-blue-500 transition-colors"
              >
                <FaReply className="mr-1" />
                Reply
              </button>
            )}
          </div>
        </div>
        {hasReplies && (
          <div className="mt-2 ml-10">
            <button
              onClick={() => toggleReplies(comment._id)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {isOpen ? "Hide replies" : `Show ${comments.filter(c => c.parentId === comment._id).length} replies`}
            </button>
            {isOpen && (
              <div className="mt-2">
                {comments
                  .filter(c => c.parentId === comment._id)
                  .map(reply => (
                    <Comment key={reply._id} comment={reply} depth={depth + 1} />
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Comments ({comments.filter(c => !c.parentId).length})
          </h2>
        </div>
        <form onSubmit={submitComment} className="space-y-4">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
              maxLength={500}
            />
            <div className="absolute bottom-2 right-2 text-sm text-gray-500">
              {text.length}/500
            </div>
          </div>
          <div className="flex justify-end gap-2">
            {replyTo && (
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!text.trim()}
              className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPaperPlane className="mr-2" />
              {replyTo ? "Reply" : "Comment"}
            </button>
          </div>
        </form>
      </div>
      <div className="space-y-4">
        {comments.filter(c => !c.parentId).length === 0 ? (
          <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          comments
            .filter(c => !c.parentId)
            .map(comment => (
              <Comment key={comment._id} comment={comment} />
            ))
        )}
      </div>
    </div>
  );
}