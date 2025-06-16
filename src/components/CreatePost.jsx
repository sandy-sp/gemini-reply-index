// src/components/CreatePost.jsx
import React, { useState } from 'react';
import ReactQuill from 'react-quill'; // Rich text editor
import 'react-quill/dist/quill.snow.css'; // Quill's CSS for snow theme
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [topicTitle, setTopicTitle] = useState('');
  const [focusArea, setFocusArea] = useState('');
  const [promptUsed, setPromptUsed] = useState('');
  const [keywords, setKeywords] = useState(''); // Storing as comma-separated string for now
  const [content, setContent] = useState(''); // Content from ReactQuill
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Configure Quill modules (toolbar options)
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'], // Add 'link' for URL functionality
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!currentUser) {
      setError('You must be logged in to create a post.');
      setLoading(false);
      return;
    }

    if (!topicTitle || !focusArea || !promptUsed || !content) {
      setError('Please fill in all required fields (Topic Title, Focus Area, Prompt Used, and Content).');
      setLoading(false);
      return;
    }

    try {
      // Add the post to Firestore
      const newPostRef = await addDoc(collection(db, 'posts'), {
        authorId: currentUser.uid,
        authorUsername: currentUser.email, // We'll get actual username from users collection later
        topicTitle,
        focusArea,
        promptUsed,
        keywords: keywords.split(',').map(kw => kw.trim()).filter(kw => kw !== ''), // Split keywords into an array
        content, // HTML content from Quill
        createdAt: new Date(),
        views: 0, // Initialize views
      });

      console.log('Post created with ID:', newPostRef.id);
      navigate('/dashboard'); // Redirect to dashboard or a success page
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create New AI-Generated Content Post</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="topicTitle">Topic Title:</label>
          <input
            type="text"
            id="topicTitle"
            value={topicTitle}
            onChange={(e) => setTopicTitle(e.target.value)}
            required
            aria-label="Topic Title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="focusArea">Focus Area:</label>
          <input
            type="text"
            id="focusArea"
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value)}
            required
            aria-label="Focus Area"
          />
        </div>

        <div className="form-group">
          <label htmlFor="promptUsed">Prompt Used:</label>
          <textarea
            id="promptUsed"
            value={promptUsed}
            onChange={(e) => setPromptUsed(e.target.value)}
            required
            rows="4"
            aria-label="Prompt Used"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="keywords">Keywords (comma-separated):</label>
          <input
            type="text"
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            aria-label="Keywords"
          />
        </div>

        <div className="form-group quill-editor-container">
          <label>Content:</label>
          {/* ReactQuill component for rich text editing */}
          <ReactQuill
            theme="snow" // Use 'snow' theme for a standard toolbar
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="Type your AI-generated content here..."
            className="quill-editor"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
