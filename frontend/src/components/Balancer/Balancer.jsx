import React, { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'

import { links } from '../../utility'

import Header from '../../layouts/Header/Header.jsx'
// import Footer from '../../layouts/Footer/Footer.jsx'

// pages importing
const PreLoader = lazy(() => import("../../pages/Preloader/Preloader.jsx"))
const Home = lazy(() => import("../../pages/Home/Home.jsx"))
const Login = lazy(() => import("../../pages/Login/Login.jsx"))
const Upload = lazy(() => import("../../pages/Upload/Upload.jsx"))
const NotFound = lazy(() => import("../../pages/NotFound/NotFound.jsx"))


const Balancer = ({ preLoader, user }) => {


    const RenderPublicPage = ({ Page }) => {
        return (
            <Suspense fallback={<div className="w-screen h-screen"></div>} >
                <Page />
            </Suspense>
        )
    }

    const RenderPrivatePage = ({ Page }) => {
        if (user.data) {
            return (
                <Suspense fallback={<div className="w-screen h-screen"></div>} >
                    <Header />
                    <Page />
                </Suspense>
            )
        } else {
            return <Navigate to="/login" />;
        }
    }

    const RenderUnAuthPage = ({ Page }) => {
        if (!user.data) {
            return (
                <Suspense fallback={<div className="w-screen h-screen"></div>} >
                    <Page />
                </Suspense>
            )

        } else {
            return <Navigate to="/" />;
        }
    }

    return (
        <>
            {
                preLoader.active ?
                    <PreLoader />
                    :
                    <BrowserRouter>
                        <Routes>
                            <Route
                                exact
                                path={links.home}
                                element={
                                    <RenderPrivatePage
                                        Page={Home}
                                    />
                                }
                            />
                            <Route
                                path={links.login}
                                element={
                                    <RenderUnAuthPage
                                        Page={Login}
                                    />
                                }
                            />
                            <Route
                                path={links.upload}
                                element={
                                    <RenderPrivatePage
                                        Page={Upload}
                                    />
                                }
                            />
                            <Route
                                path="*"
                                element={
                                    <RenderPublicPage
                                        Page={NotFound}
                                    />
                                }
                            />
                        </Routes>
                        {/* <Footer /> */}
                    </BrowserRouter>
            }
        </>
    )
}

const mapStateToProps = state => {
    return {
        preLoader: state.preLoader,
        user: state.user
    }
}

export default connect(mapStateToProps, null)(Balancer)