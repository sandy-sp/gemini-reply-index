import { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import AuthContext from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Gemini Reply Index
          </RouterLink>
        </Typography>
        <Box>
          {user ? (
            <>
              {/* ++ ADD THIS BUTTON FOR POSTS NAVIGATION ++ */}
              <Button color="inherit" component={RouterLink} to="/profile">
                Profile
              </Button>
              <Button color="inherit" component={RouterLink} to="/posts">
                Posts
              </Button>
              <Button color="inherit" onClick={onLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;