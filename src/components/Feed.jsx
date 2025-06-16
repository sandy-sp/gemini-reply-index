// src/components/Feed.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Link } from 'react-router-dom';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const postsRef = collection(db, 'posts');
    // For now, we're not ordering as per the instruction to avoid orderBy
    // For real-time updates, use onSnapshot
    const q = query(postsRef); // If we wanted ordering: query(postsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Manually sort by createdAt if orderBy is not used in query
      postsData.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
      setPosts(postsData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
      setLoading(false);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="feed-container"><h2>Loading Posts...</h2><p>Fetching AI-generated content.</p></div>;
  }

  if (error) {
    return <div className="feed-container"><h2 className="error-message">{error}</h2></div>;
  }

  return (
    <div className="feed-container">
      <h2>Recent AI-Generated Content</h2>
      {posts.length === 0 ? (
        <p>No posts available yet. Be the first to create one!</p>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <Link to={`/post/${post.id}`}>
                <h3>{post.topicTitle}</h3>
                <p className="author">By: {post.authorUsername}</p>
                {/* Displaying only first 150 chars as a snippet */}
                <div dangerouslySetInnerHTML={{ __html: post.content.substring(0, 150) + '...' }} className="post-snippet" />
                <p className="read-more">Read More &rarr;</p>
              </Link>
              <div className="post-meta">
                <span>Views: {post.views || 0}</span> {/* Placeholder for views */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Feed;