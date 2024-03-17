import React, { useState } from 'react'
import { connect } from 'react-redux'

import { links, axiosInstance } from '../../utility'
import { clearUser } from '../../redux/actions';

import { Box, AppBar, Toolbar, Typography, Container, Menu, MenuItem, Tooltip, Avatar, IconButton } from '@mui/material';

import { PiCloudArrowDownFill } from "react-icons/pi";


const Header = ({ ClearUser }) => {

    const profile = {
        email: "echcharqui@gmail.com",
        username: "ayoub",
        avatar: "https://ui-avatars.com/api/?name=ayoub",
    }

    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };


    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // log out fucntion 
    const logOut = async () => {

        var config = {
            method: 'post',
            url: `/auth/v1/logout`,
        };

        await axiosInstance(config)
            .then(function () {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');

                ClearUser()
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    return (
        <header>
            <AppBar position="fixed">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>

                        {/* Cloud Icon and The Cloud Typography for Larger Screens */}
                        <Box sx={{ mr: 1 }}>
                            <PiCloudArrowDownFill size={30} />
                        </Box>
                        <Typography
                            noWrap
                            component="a"
                            href={links.home}
                            sx={{
                                mr: 2,
                                fontWeight: 700,
                                fontSize: "16px",
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            The cloud
                        </Typography>


                        {/* Spacer Box to push everything after it to the right */}
                        <Box sx={{ flexGrow: 1 }} />

                        {/* User Profile Section */}
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src={profile.avatar} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Typography textAlign="center">Profil</Typography>
                            </MenuItem>

                            <MenuItem onClick={logOut}>
                                <Typography textAlign="center">Déconnectez</Typography>
                            </MenuItem>
                        </Menu>

                    </Toolbar>
                </Container>
            </AppBar>

        </header >
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        ClearUser: () => dispatch(clearUser()),
    };
};

export default connect(null, mapDispatchToProps)(Header);


