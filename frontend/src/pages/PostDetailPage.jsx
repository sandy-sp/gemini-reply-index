import { useState, useEffect, useContext } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button } from '@mui/material';
import postService from '../services/postService';
import AuthContext from '../context/AuthContext';

const PostDetailPage = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // Get the logged-in user

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await postService.getPostById(id);
                setPost(data);
            } catch (error) {
                console.error('Failed to fetch post:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await postService.deletePost(post.post_id, user.token);
                navigate('/posts');
            } catch (error) {
                console.error('Failed to delete post:', error);
            }
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (!post) {
        return <Typography>Post not found.</Typography>;
    }

    return (
        <Paper sx={{ p: 3 }}>
            {/* --- Buttons for post owner --- */}
            {user && user.id === post.user_id && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 1 }}>
                    {/* ++ ADD THIS EDIT BUTTON ++ */}
                    <Button component={RouterLink} to={`/posts/${post.post_id}/edit`} variant="contained">
                        Edit
                    </Button>
                    <Button variant="contained" color="error" onClick={handleDelete}>
                        Delete
                    </Button>
                </Box>
            )}

            {/* --- Post Content --- */}
            <Typography variant="h3" component="h1" gutterBottom>
                {post.topic_title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
                Focus Area: {post.focus_area}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Keywords: {post.keywords?.join(', ')}
            </Typography>

            <Box sx={{ my: 4 }}>
                <Typography variant="h5" gutterBottom>Prompt</Typography>
                <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                    {post.prompt}
                </Typography>
            </Box>

            <Box sx={{ my: 4 }}>
                <Typography variant="h5" gutterBottom>Output / Document</Typography>
                <Button 
                    variant="contained" 
                    href={post.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    View Document
                </Button>
            </Box>

            <Button component={RouterLink} to="/posts" variant="outlined">
                Back to All Posts
            </Button>
        </Paper>
    );
};

export default PostDetailPage;