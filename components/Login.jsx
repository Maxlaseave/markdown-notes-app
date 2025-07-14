"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isRegister, setIsRegister] = useState(false)
    const [isAuthenticating, setIsAuthenticating] = useState(false)

    const { login, signup } = useAuth()
    const router = useRouter()

    const cantAuth = !email.includes('@') || password.length < 6

    async function handleAuthUser() {
        if(cantAuth) {
            return
        }
        setIsAuthenticating(true)
        try {
            if (isRegister) {
                await signup(email, password)
            } else {
                await login(email, password)
            }

            router.push('/notes')
        } catch (err) {
            console.log(err.message)
            // add an error state that is conditionally rendered if there is an error and shows the error message
        } finally {
            setIsAuthenticating(false)
        }
    }

    return (
        <>
            <div className="login-container">
                <h1 className="text-gradient">MDNOTES</h1>
                <h2>Organized note taking made easy</h2>
                <p>Build you very own archive of easily navigated</p>
                <div className="full-line"></div>
                <h6>{isRegister ? 'Register' :'Login'}</h6>
                <div>
                    <button className="google-btn">
                        <h6>Login with Google</h6>
                    </button>
                </div>
                <div>
                    <p>Email</p>
                    <input value={email} onChange={((e) => {
                        setEmail(e.target.value)
                    })}type="text" />
                </div>
                <div>
                    <p>Password</p>
                    <input value={password} onChange={((e) => {
                        setPassword(e.target.value)
                    })} type="password" placeholder="********" />
                </div>

                <button onClick={handleAuthUser} disabled={cantAuth || isAuthenticating} className="submit-btn">
                    <h6>{isAuthenticating ? 'Submitting...' :'Submit'}</h6>
                </button>
                <div className="secondary-btn-container">
                    <button onClick={() => {
                        setIsRegister(!isRegister)
                    }}className="card-button-secondary">
                        <small>{isRegister ? 'Login' : 'Sign up'}</small>
                    </button>
                    <button className="card-button-secondary">
                        <small>Forgot Password</small>
                    </button>
                </div>
                <div className="full-line"></div>
                <footer>
                    <a target="_blank" href="https://github.com/maxlaseave">
                        <img src="https://avatars.githubusercontent.com/u/89351211?v=4" alt="pfp" />
                        <h6>@maxlaseave</h6>
                        <i className="fa-brands fa-github"></i>
                    </a>
                </footer>
            </div>

        </>
    )
}