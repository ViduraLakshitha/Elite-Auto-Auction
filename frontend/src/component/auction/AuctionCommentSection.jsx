// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import axios from "axios";

// const socket = io("http://localhost:5555"); // your backend address

// export default function AuctionCommentSection({ auctionId, currentUser }) {
//   const [comments, setComments] = useState([]);
//   const [text, setText] = useState("");
//   const [replyTo, setReplyTo] = useState(null); // parent comment ID

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

//   const renderComments = (parentId = null) => {
//     return comments
//       .filter(c => c.parentId === parentId)
//       .map(c => (
//         <div key={c._id} className={parentId ? "ml-8 mt-4" : "mt-6"}>
//           <div className="flex my-3">
//             <div className="text-sm text-gray-500">{new Date(c.createdAt).  toLocaleString()}</div>
//             <div className="font-bold ml-3 text-gray-500 underline">{c.userId.fName}</div>
//           </div>
//           <p className="ml-10">{c.text}</p>
//           <button
//             onClick={() => setReplyTo(c._id)}
//             className="text-blue-500 text-sm mt-1"
//           >
//             Reply
//           </button>
//           {renderComments(c._id)}
//         </div>
//       ));
//   };

//   return (
//     <div className="max-w-2xl mx-auto mb-20">
//       <h2 className="text-2xl font-bold mb-4">{comments.length} Comments</h2>

//       <form onSubmit={submitComment} className="mb-6">
//         <textarea
//           className="w-full p-2 border rounded"
//           rows="3"
//           placeholder={replyTo ? "Replying..." : "Add a comment..."}
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         />
//         <div className="flex gap-2 mt-2">
//           {replyTo && (
//             <button
//               type="button"
//               onClick={() => setReplyTo(null)}
//               className="px-4 py-2 border rounded"
//             >
//               Cancel
//             </button>
//           )}
//           <button className="px-4 py-2 bg-black text-white rounded" type="submit">
//             {replyTo ? "Reply" : "Submit"}
//           </button>
//         </div>
//       </form>

//       <div>
//         {renderComments()}
//       </div>
//     </div>
//   );
// }













// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import axios from "axios";

// const socket = io("http://localhost:5555"); // your backend address

// export default function AuctionCommentSection({ auctionId, currentUser }) {
//   const [comments, setComments] = useState([]);
//   const [text, setText] = useState("");
//   const [replyTo, setReplyTo] = useState(null); // parent comment ID

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

//   const renderComments = (parentId = null) => {
//     return comments
//       .filter(c => c.parentId === parentId)
//       .map(c => (
//         <div key={c._id} className={`mt-4 ${parentId ? "ml-25" : ""}`}>
//           <div className="bg-gray-100 shadow rounded-lg p-4">
//             <div className="flex items-center mb-2">
//               <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
//               <span className="ml-3 font-semibold text-gray-700">{c.userId?.fName || "Unknown User"}</span>
//             </div>
//             <p className="text-gray-800 ml-2">{c.text}</p>
//             <button
//               onClick={() => setReplyTo(c._id)}
//               className="text-blue-500 text-xs mt-2 ml-2 hover:underline"
//             >
//               Reply
//             </button>
//           </div>
//           {renderComments(c._id)}
//         </div>
//       ));
//   };

//   return (
//     <div className="max-w-2xl mx-auto mb-20 p-4">
//       <h2 className="text-3xl font-bold mb-6 text-center">{comments.length} Comments</h2>

//       <form onSubmit={submitComment} className="mb-8 bg-white p-6 shadow rounded-lg">
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
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

const socket = io("http://localhost:5555"); // your backend address

export default function AuctionCommentSection({ auctionId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null); // parent comment ID
  const [openReplies, setOpenReplies] = useState({}); // Track open replies

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

    await axios.post("http://localhost:5555/comment/comment-create", newComment);
    setText("");
    setReplyTo(null);
  };

  const toggleReplies = (commentId) => {
    setOpenReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const renderComments = (parentId = null) => {
    return comments
      .filter(c => c.parentId === parentId)
      .map(c => {
        const childComments = comments.filter(child => child.parentId === c._id);
        const hasReplies = childComments.length > 0;
        const isOpen = openReplies[c._id];

        return (
          <div key={c._id} className={`mt-4 ${parentId ? "ml-6" : ""}`}>
            <div className="bg-gray-100 shadow rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
                <span className="ml-3 font-semibold text-gray-700 underline">{c.userId?.fName || "Unknown User"}</span>
              </div>
              <p className="text-gray-800 ml-2">{c.text}</p>
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => setReplyTo(c._id)}
                  className="text-blue-500 text-xs hover:underline"
                >
                  Reply
                </button>

                {hasReplies && (
                  <button
                    onClick={() => toggleReplies(c._id)}
                    className="text-gray-500 text-xs hover:underline"
                  >
                    {isOpen ? "Hide Replies" : `View ${childComments.length} Replies`}
                  </button>
                )}
              </div>
            </div>

            {isOpen && (
              <div className="ml-6 mt-2 border-l-2 border-gray-300 pl-4">
                {renderComments(c._id)}
              </div>
            )}
          </div>
        );
      });
  };

  return (
    <div className="max-w-2xl mx-auto mb-20 p-4">
      <h2 className="text-2xl font-bold mb-6 ">{comments.length} Comments</h2>

      <form onSubmit={submitComment} className="mb-8 bg-white p-6 shadow-xl rounded-lg">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="3"
          placeholder={replyTo ? "Replying..." : "Write your comment..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex gap-3 mt-4 justify-end">
          {replyTo && (
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
          >
            {replyTo ? "Reply" : "Submit"}
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {renderComments()}
      </div>
    </div>
  );
}
