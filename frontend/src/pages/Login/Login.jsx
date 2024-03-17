import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik';
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { axiosInstance, links } from '../../utility'
import { LoginValidationSchema } from '../../validations'
import { updateUser } from '../../redux/actions'

import { TextField, Button, CircularProgress, Container, Box, Typography } from '@mui/material';
import { AiTwotoneEyeInvisible, AiTwotoneEye } from "react-icons/ai";

import { PiCloudArrowDownFill } from "react-icons/pi";

const Login = ({ UpdateUser }) => {

    const navigate = useNavigate()

    const [isLoading, setisLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [externalEroor, setexternalEroor] = useState(null)

    const initialValues = {
        identifier: "",
        password: ""
    }

    // handeling the form data submition
    const handleSubmit = async (values) => {

        setisLoading(true)

        var data = JSON.stringify({
            "identifier": values.identifier,
            "password": values.password,
        });

        var config = {
            method: 'post',
            url: `/auth/v1/login`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data,
            skipInterceptor: true
        };

        await axiosInstance(config)
            .then(function (res) {
                // console.log(res.data);
                UpdateUser(res.data.user)
                localStorage.setItem('access_token', res.data.accessToken);
                localStorage.setItem('refresh_token', res.data.refreshToken);
                navigate(links.home)
            })
            .catch(function (error) {
                console.log(error);
                setexternalEroor(error.response.data)
                setisLoading(false)
            });

    }

    // handeling key press Enter inside the form
    const handleKeyPress = (event, handleSubmit) => {
        if (event.charCode === 13) {
            handleSubmit();
        }
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
            {
                isLoading ?
                    <Box textAlign="center">
                        <CircularProgress size={25} />
                        <Typography variant="body1" sx={{ mt: 2, fontSize: 14 }}>Authentification en cours,</Typography>
                        <Typography variant="body1" sx={{ fontSize: 14 }}>veuillez patienter…</Typography>
                    </Box>
                    :

                    <Formik
                        initialValues={initialValues}
                        validationSchema={LoginValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ handleSubmit }) => (
                            <Box
                                sx={{ maxWidth: "400px", minWidth: "350px" }}
                            >
                                <Form onKeyPress={handleKeyPress}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: "center",
                                            alignItems: 'center',
                                            flexDirection: 'column',
                                            gap: 2, // Adds space between elements
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

                                            <Typography sx={{ textAlign:"center", fontSize: 14, color:"#1976d2",fontWeight:"bold" }}>Se connecter</Typography>

                                        </Box>

                                        {/* identifier */}
                                        <Field name="identifier">
                                            {({ field, meta }) => (
                                                <TextField
                                                    {...field}
                                                    label="Identifiant"
                                                    inputProps={{ maxLength: 320 }}
                                                    variant='filled'
                                                    fullWidth
                                                    error={meta.touched && !!meta.error}
                                                    helperText={meta.touched && meta.error}
                                                />
                                            )}
                                        </Field>

                                        {/* password */}
                                        <Field name="password">
                                            {({ field, meta }) => (
                                                <Box sx={{ position: 'relative', width: "100%" }}>
                                                    <TextField
                                                        {...field}
                                                        type={showPassword ? 'text' : 'password'}
                                                        label="Mot de passe"
                                                        inputProps={{ maxLength: 64 }}
                                                        variant='filled'
                                                        fullWidth
                                                        error={meta.touched && !!meta.error}
                                                        helperText={meta.touched && meta.error}

                                                    />
                                                    {/* show and hide password  */}
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: '30px',
                                                            right: 10,
                                                            transform: 'translateY(-50%)',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {
                                                            showPassword ?
                                                                <AiTwotoneEye
                                                                    color='rgba(0, 0, 0, 0.6)'
                                                                    size={20}
                                                                />
                                                                :
                                                                <AiTwotoneEyeInvisible
                                                                    color='rgba(0, 0, 0, 0.6)'
                                                                    size={20}
                                                                />
                                                        }
                                                    </Box>
                                                </Box>
                                            )}
                                        </Field>

                                        {/* submit button */}
                                        <Field>
                                            {({ form }) => {
                                                return (
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        color='info'
                                                        fullWidth
                                                        disabled={form.values.password.length < 8 || form.values.identifier.length < 5}
                                                    >
                                                        Connexion
                                                    </Button>
                                                )
                                            }}
                                        </Field>

                                        {externalEroor && (
                                            <Typography fontSize={12} color="error" textAlign="center">{externalEroor.error.message}</Typography>
                                        )}
                                    </Box>
                                </Form>
                            </Box>
                        )}
                    </Formik>
            }
        </Container>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        UpdateUser: (param) => dispatch(updateUser(param)),
    }
}

export default connect(null, mapDispatchToProps)(Login)
