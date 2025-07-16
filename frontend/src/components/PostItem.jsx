import { Card, CardContent, Typography, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // ++ ADD THIS IMPORT ++

const PostItem = ({ post }) => {
  return (
    // ++ WRAP THE CARD WITH A LINK ++
    <RouterLink to={`/posts/${post.post_id}`} style={{ textDecoration: 'none' }}>
      <Card sx={{ mb: 2, '&:hover': { boxShadow: 6 } }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {post.topic_title}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Focus: {post.focus_area || 'N/A'}
          </Typography>
          <Box sx={{ border: '1px dashed grey', p: 1, my: 1, borderRadius: '4px', maxHeight: '100px', overflow: 'hidden' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Prompt:
              </Typography>
              <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                  {post.prompt}
              </Typography>
          </Box>
        </CardContent>
      </Card>
    </RouterLink>
  );
};

export default PostItem;