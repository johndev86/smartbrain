import React from 'react';
import ProfileIcon from '../ProfileIcon/ProfileIcon';

const Navigation = ({showProfile, onRouteChange, isSignedIn}) => {
    if (isSignedIn) {
        return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                <ProfileIcon showProfile={showProfile} onRouteChange={onRouteChange}></ProfileIcon>
            </nav>
        );
    } else {
        return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                <p onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 pointer'> Sign In </p>
                <p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer'> Register </p>
            </nav>
        );
    }
}

export default Navigation;