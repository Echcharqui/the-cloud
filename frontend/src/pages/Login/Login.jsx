import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik';
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { axiosInstance, links } from '../../utility'
import { LoginValidationSchema } from '../../validations'
import { updateUser } from '../../redux/actions'

import { TextField, Button } from '@mui/material'
import { AiTwotoneEyeInvisible, AiTwotoneEye } from "react-icons/ai";


// import Logo from '../../assets/images/logo/small_logo.png'

import "./login.scss"

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
        <div className='page'>
            <div className="conainer">
                {/* <img
                    className='logo'
                    src={Logo}
                    alt='logo'
                /> */}
                {/* <Typography variant="h4" component="h1" >connexion</Typography> */}


                <Formik
                    initialValues={initialValues}
                    validationSchema={LoginValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ handleSubmit }) => (
                        <Form className="form" onKeyPress={(event) => handleKeyPress(event, handleSubmit)}>


                            {/* identifier */}
                            <div className="inputcontainer">
                                <Field name="identifier">
                                    {
                                        ({ field, meta }) => {
                                            return (
                                                <TextField
                                                    className='inputText'
                                                    type='text'
                                                    label="Identifiant"
                                                    color="primary"
                                                    variant='filled'
                                                    inputProps={
                                                        {
                                                            maxLength: 64,
                                                            minLength: 5
                                                        }
                                                    }
                                                    name={field.name}
                                                    id={field.name}
                                                    value={field.value}
                                                    onBlur={field.onBlur}
                                                    onChange={field.onChange}
                                                    error={meta.touched && meta.error}
                                                    helperText={meta.error}
                                                />
                                            )
                                        }
                                    }
                                </Field>
                            </div>


                            {/* password */}
                            <div className="inputcontainer inputcontainer-icon">
                                <Field name="password">
                                    {
                                        ({ field, meta }) => {
                                            return (
                                                <>
                                                    <TextField
                                                        className='inputText'
                                                        label="Mot de passe"
                                                        color="primary"
                                                        variant='filled'
                                                        inputProps={
                                                            {
                                                                maxLength: 25,
                                                                minLength: 8
                                                            }
                                                        }
                                                        name={field.name}
                                                        id={field.name}
                                                        value={field.value}
                                                        onBlur={field.onBlur}
                                                        onChange={field.onChange}
                                                        error={meta.touched && meta.error}
                                                        helperText={meta.error}
                                                        type={showPassword ? 'text' : 'password'}
                                                    />

                                                    <div
                                                        className='icon'
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <AiTwotoneEye size={25} color='rgba(0, 0, 0, 0.6)' /> : <AiTwotoneEyeInvisible size={25} color='rgba(0, 0, 0, 0.6)' />}
                                                    </div>
                                                </>
                                            )
                                        }
                                    }
                                </Field>
                            </div>

                            <div className="buttoncontainer">
                                <Field>
                                    {
                                        (props) => {
                                            return (
                                                <Button
                                                    className='btn'
                                                    variant="contained"
                                                    color='success'
                                                    onClick={() => props.form.handleSubmit()}
                                                    disabled={props.form.values.identifier.length <= 4 || props.form.values.password.length <= 7}
                                                >Connexion</Button>
                                            )
                                        }
                                    }
                                </Field>
                            </div>

                            {/* external erros that dont belong to an input */}
                            {(externalEroor && externalEroor.statusCode !== 400) && <p className="external-error"> {externalEroor.error.message} !</p>}

                        </Form>
                    )}
                </Formik>

            </div>
        </div >
    )
}

const mapDispatchToProps = dispatch => {
    return {
        UpdateUser: (param) => dispatch(updateUser(param)),
    }
}

export default connect(null, mapDispatchToProps)(Login)
