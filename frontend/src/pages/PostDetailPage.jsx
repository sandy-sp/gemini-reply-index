import { useState, useEffect, useContext } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import postService from '../services/postService';
import AuthContext from '../context/AuthContext';

const PostDetailPage = () => {
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Pass the user's token so the backend can check if this user has liked the post
                const data = await postService.getPostById(id, user?.token);
                setPost(data);
                // Set the initial like state from the data fetched from the server
                setIsLiked(data.user_has_liked);
                setLikeCount(parseInt(data.like_count, 10));
            } catch (error) {
                console.error('Failed to fetch post:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [id, user?.token]);

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

    const handleLike = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Optimistic UI update: change the state immediately for a better user experience
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

        try {
            await postService.likePost(post.post_id, user.token);
        } catch (error) {
            console.error('Failed to update like status:', error);
            // If the API call fails, revert the UI back to its original state
            setIsLiked(isLiked);
            setLikeCount(likeCount);
        }
    };

    if (isLoading) {
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

            {/* --- Like Button and Count --- */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={handleLike} color="error" aria-label="like post">
                    {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <Typography>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</Typography>
            </Box>

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