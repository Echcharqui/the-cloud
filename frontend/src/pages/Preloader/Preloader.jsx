import React, { useEffect } from "react"
import { connect } from 'react-redux'

import { handelPreLoader, updateUser } from '../../redux/actions'
import { axiosInstance } from '../../utility'

import Logo from '../../assets/images/logo/logo.webp'

import './preloader.scss'

const Preloader = ({ UpdateUser, HandelPreLoader }) => {

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            // checkIFtheUserIsAuth()
        } else {
            setTimeout(() => {
                HandelPreLoader(false)
            }, 1000);
        }
    })


    const checkIFtheUserIsAuth = async () => {

        var config = {
            method: 'get',
            url: `/auth/v3/check-auth`,
        };

        await axiosInstance(config)
            .then(function (res) {
                UpdateUser(res.data)
                HandelPreLoader(false)
            })
            .catch(error => {
                console.log(error);
                HandelPreLoader(false)
            });
    }

    return (
        <div className="preloader flex justify-center items-center h-screen">
            <img src={Logo} alt="cloud Logo" />
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        HandelPreLoader: (param) => dispatch(handelPreLoader(param)),
        UpdateUser: (param) => dispatch(updateUser(param)),
    }
}

export default connect(null, mapDispatchToProps)(Preloader)
