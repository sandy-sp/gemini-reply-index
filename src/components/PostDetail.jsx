import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Import updateDoc
import { db } from '../firebaseConfig';

function PostDetail() {
  const { postId } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setError('No post ID provided.');
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'posts', postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });

          // Increment view count
          // IMPORTANT: Check if `views` field exists before incrementing.
          // If a post is created without `views` (e.g., from older code),
          // it might be undefined. Initialize it to 0 if it doesn't exist.
          const currentViews = docSnap.data().views || 0;
          await updateDoc(docRef, {
            views: currentViews + 1
          });
          console.log(`View count for post ${postId} incremented to ${currentViews + 1}`);

        } else {
          setError('Post not found.');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]); // Re-fetch if postId changes

  if (loading) {
    return <div className="post-detail-container"><h2>Loading Post...</h2><p>Please wait while we fetch the content.</p></div>;
  }

  if (error) {
    return <div className="post-detail-container"><h2 className="error-message">{error}</h2><p><Link to="/">Go back to Feed</Link></p></div>;
  }

  // Safely render content, especially from rich text editor output (HTML)
  const renderContent = () => {
    // Using dangerouslySetInnerHTML is necessary for rendering HTML strings directly.
    // Ensure the content is sanitized on the server-side in a production environment
    // to prevent XSS attacks if user-submitted HTML is directly displayed.
    return { __html: post.content };
  };

  return (
    <div className="post-detail-container">
      <h2 className="post-title">{post.topicTitle}</h2>
      <p className="post-author">By: {post.authorUsername}</p>
      <p className="post-meta-info"><strong>Focus Area:</strong> {post.focusArea}</p>
      <p className="post-meta-info"><strong>Prompt Used:</strong> {post.promptUsed}</p>
      {post.keywords && post.keywords.length > 0 && (
        <p className="post-meta-info"><strong>Keywords:</strong> {post.keywords.join(', ')}</p>
      )}
      <p className="post-meta-info">
        <strong>Published:</strong> {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleString() : 'N/A'}
      </p>
      <p className="post-meta-info"><strong>Views:</strong> {post.views + 1}</p> {/* Show incremented views */}

      <div className="post-content" dangerouslySetInnerHTML={renderContent()}></div>

      <div className="back-to-feed">
        <Link to="/" className="dashboard-button">Back to All Posts</Link>
      </div>
    </div>
  );
}

export default PostDetail;