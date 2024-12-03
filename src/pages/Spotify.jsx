import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setToken } from '../store/actions/sessionActions';
import { fetchUser } from '../store/actions/userActions';
import Spinner from '../component/spinner/spinner';
import LeftSection from '../containers/leftSection/leftSection';
import MainSection from '../containers/mainSection/mainSection';
import Login from '../spotify/login';
import WebPlaybackReact from '../spotify/webPlayback';

class Spotify extends Component {
    state = {
        playerLoaded: false,
        token: null,
    };

    componentDidMount() {
        const token = Login.getToken();
        console.log('Token from Login.getToken():', token);

        if (!token) {
            console.log('No token found, redirecting to login');
            Login.logInWithSpotify();
        } else {
            console.log('Token found:', token);
            this.setState({ token: token });
            this.props.setToken(token);
            this.props.fetchUser();
        }
    }

    render() {
        let webPlaybackSdkProps = {
            playerName: 'Spotify React Player',
            playerInitialVolume: 1.0,
            playerRefreshRateMs: 1000,
            playerAutoConnect: true,
            onPlayerRequestAccessToken: () => this.state.token,
            onPlayerLoading: () => {},
            onPlayerWaitingForDevice: () => {
                this.setState({ playerLoaded: true });
            },
            onPlayerError: (e) => {
                console.log('Player error:', e);
            },
            onPlayerDeviceSelected: () => {
                this.setState({ playerLoaded: true });
            },
        };

        return (
            <>
                <WebPlaybackReact {...webPlaybackSdkProps}>
                    <Spinner loading={!this.state.playerLoaded}>
                        <LeftSection />
                        <MainSection />
                    </Spinner>
                </WebPlaybackReact>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.sessionReducer.token,
    };
};

const mapDispatchToProps = (dispatch) => ({
    setToken: (token) => dispatch(setToken(token)),
    fetchUser: () => dispatch(fetchUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Spotify);
