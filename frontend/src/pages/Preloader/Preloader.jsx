import React, { useEffect } from "react"
import { connect } from 'react-redux'

import { handelPreLoader, updateUser } from '../../redux/actions'
import { axiosInstance } from '../../utility'

import { Container, Box, Typography } from '@mui/material';

import { PiCloudArrowDownFill } from "react-icons/pi";

import './preloader.scss'

const Preloader = ({ UpdateUser, HandelPreLoader }) => {

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            checkIFtheUserIsAuth()
        } else {
            skipPreloader()
        }
    })


    const checkIFtheUserIsAuth = async () => {
        var config = {
            method: 'get',
            url: `/auth/v1/check-auth`,
        };

        await axiosInstance(config)
            .then(function (res) {
                UpdateUser(res.data)
                skipPreloader()
            })
            .catch(error => {
                console.log(error);
                skipPreloader()
            });
    }

    const skipPreloader = () => {
        setTimeout(() => {
            HandelPreLoader(false)
        }, 1000);
    }

    return (
        <Container
            maxWidth="sm" // Adjusted for a smaller, more centered form
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {/* logo */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: "center",
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                <PiCloudArrowDownFill
                    color='#1976d2'
                    size={80}
                />

                <Typography sx={{ textAlign: "center", fontSize: 16, color: "#1976d2", fontWeight: "bold", textTransform: "uppercase" }}>The cloud</Typography>

            </Box>
        </Container>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        HandelPreLoader: (param) => dispatch(handelPreLoader(param)),
        UpdateUser: (param) => dispatch(updateUser(param)),
    }
}

export default connect(null, mapDispatchToProps)(Preloader)
