import React from 'react';
import './Profile.css';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.user.name,
            age: this.props.user.age,
            pet: this.props.user.pet
        }
    }

    onFormChange = (event) => {
        switch(event.target.name) {
            case 'user-name':
                this.setState({name: event.target.value});
                break;
            case 'user-age':
                this.setState({age: event.target.value});
                break;
            case 'user-pet':
                this.setState({pet: event.target.value});
                break;
            default:
        }
    }

    onSaveProfile = (data) => {
        const {name, age, pet} = data;
        
        fetch(process.env.REACT_APP_API_URL+'/profile', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': window.sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                name: name,
                age: age,
                pet: pet
            })
        })
        .then(response => response.json())
        .then(resp => {
            if (resp === 'success') {
                this.props.loadUser(Object.assign(this.props.user, this.state));
            }
        });
    }

    render() {
        const {hideProfile, user} = this.props;
        return (
            <div className="profile_modal">
                <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                    <main className="pa4 black-80 w-80">
                        <img
                            src="http://tachyons.io/img/logo.jpg"
                            className="br-100 ba h3 w3 dib" alt="avatar" />
                        <h1>{this.state.name}</h1>
                        <h4>Images submitted: {user.entries}</h4>
                        <p>Member since: {user.joined ? user.joined.split('T')[0] : ''}</p>
                        
                        <label className="mt2 fw6" htmlFor="user-name">Name:</label>
                        <input 
                        className="pa2 ba w-100" placeholder={user.name} onChange={this.onFormChange} type="name" name="user-name"  id="name"/>
                        <label className="mt2 fw6" htmlFor="user-name">Age:</label>
                        <input 
                        className="pa2 ba w-100" placeholder={user.age} onChange={this.onFormChange} type="age" name="user-age"  id="age"/>
                        <label className="mt2 fw6" htmlFor="user-name">Pet:</label>
                        <input 
                        className="pa2 ba w-100" placeholder={user.pet} onChange={this.onFormChange} type="pet" name="user-pet"  id="pet"/>
                        <div className="mt4" style={{display: 'flex', justifyContent: 'space-evenly'}}>
                            <button className="b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20" 
                            onClick={() => this.onSaveProfile(this.state)}>Save</button>
                            <button className="b pa2 grow pointer hover-white w-40 bg-light-red b--black-20" 
                            onClick={hideProfile}>Cancel</button>
                        </div>
                        
                    </main>
                    <div className="modal-close" onClick={hideProfile}>&times;</div>
        
                </article>
            </div>
        )
    }
}

export default Profile;