import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './DarkModeToggle.css';

const DarkModeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button className="dark-mode-toggle" onClick={toggleTheme} title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <div className="toggle-track">
                <div className={`toggle-thumb ${isDarkMode ? 'dark' : 'light'}`}>
                    {isDarkMode ? (
                        <i className="fa fa-moon"></i>
                    ) : (
                        <i className="fa fa-sun"></i>
                    )}
                </div>
            </div>
        </button>
    );
};

export default DarkModeToggle;