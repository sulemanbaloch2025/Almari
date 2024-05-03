import { Link, useNavigate } from "react-router-dom";
import Header from "./Header"; // Assuming this is correctly imported and used elsewhere
import { useState } from "react";
import axios from "axios";
import API_URL from "../constants";
import styles from "./styles.module.css";

function Login() {
    const navigate = useNavigate();

    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [error, setError] = useState(''); // Added error state

    const handleApi = (event) => {
        event.preventDefault(); // Prevent form from causing a page reload
        const url = API_URL + '/login';
        const data = { username, password };
        axios.post(url, data)
            .then((res) => {
                if (res.data.message) {
                    if (res.data.token) {
                        localStorage.setItem('token', res.data.token);
                        localStorage.setItem('userId', res.data.userId);
                        navigate('/');
                    } else {
                        // Handle case where there's a message but no token
                        setError(res.data.message); // Assuming the API sends back an error message
                    }
                }
            })
            .catch((err) => {
                setError('Server error or connection issue.'); // Set a more descriptive error message
            });
    };

    return (
        <div className={styles.login_container}>
            <div className={styles.login_form_container}>
                <div className={styles.left}>
                    <form className={styles.form_container} onSubmit={handleApi}>
                        <h1>Login to Your Account</h1>
                        <input
                            type="text" // Change to text if you're using usernames
                            placeholder="Username" // Adjusted from Email to Username
                            name="username"
                            value={username}
                            onChange={(e) => setusername(e.target.value)}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            required
                            className={styles.input}
                        />
                        {error && <div className={styles.error_msg}>{error}</div>}
                        <button type="submit" className={styles.green_btn}>
                            Sign In
                        </button>
                    </form>
                </div>
                <div className={styles.right}>
                    <h1>New Here?</h1>
                    <Link to="/signup">
                        <button type="button" className={styles.white_btn}>
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
