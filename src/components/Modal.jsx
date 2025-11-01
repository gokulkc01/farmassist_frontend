import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Modal.css';

const Modal = ({ type, onClose, onAuthSuccess }) => {
     const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, register } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (type === 'signup' && formData.password !== formData.confirmpassword) {
    setError('Passwords do not match');
    setLoading(false);
    return;
}

        try {
            let result;

            if (type === 'login') {
                result = await login(formData.email, formData.password);
            } else {
                result = await register({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                });
            }

            if (result.success) {
                onAuthSuccess();
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>{type === 'login' ? 'Login' : 'Sign Up'}</h3>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {type === 'signup' && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />

                    {type === 'signup' && (
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    )}

                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        disabled={loading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="show-hide-btn"
                        tabIndex={-1}
                        style={{ marginLeft: "8px" }}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                    {type === 'signup' && (
                        <input
                        type={showPassword ? "text" : "password"}
                        name="confirmpassword"
                        placeholder="Confirm Password"
                        value={formData.confirmpassword}
                        onChange={handleChange}
                        required
                         minLength={6}
                        disabled={loading}
                    />
                    )}
                     
                    {/* <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="show-hide-btn"
                        tabIndex={-1}
                        style={{ marginLeft: "8px" }}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button> */}
                 

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="primary" disabled={loading}>
                            {loading ? 'Please wait...' : (type === 'login' ? 'Login' : 'Sign Up')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;