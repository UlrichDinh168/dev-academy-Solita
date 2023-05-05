import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';

function ResponsiveAppBar() {
  const navigate = useNavigate()
  const HeaderList = [
    {
      name: 'Journey',
      path: '/'
    },
    {
      name: 'Station',
      path: '/station'
    },
    {
      name: 'Add Journey',
      path: '/add-journey'
    },
    {
      name: 'Add Station',
      path: '/add-station'
    },
    {
      name: 'Statistics',
      path: '/statistics'
    },
  ]

  const [anchorElNav, setAnchorElNav] = React.useState(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(false);
  };

  const onClickItem = (page, index) => {
    navigate(page.path)
    setAnchorElNav(false)
    handleCloseNavMenu()
  }
  return (
    <AppBar position="static" sx={{ backgroundColor: 'grey' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Helsinki Bike
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: {
                  xs: 'block', md: 'none', height: '100%',
                  padding: '23px', display: 'flex', flexDirection: 'column'
                },
              }}
            >
              {HeaderList.map((page, index) => (
                <MenuItem key={index} onClick={() => onClickItem(page)}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Helsinki bike
          </Typography>
          <Box
            sx={{
              flexGrow: 1, display: { xs: 'none', md: 'flex' }, height: '100%',
              padding: '4px', marginLeft: '16rem'
            }}>
            {HeaderList.map((page, index) => (
              <Button
                key={index}
                href={page.path}
                onClick={onClickItem}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;