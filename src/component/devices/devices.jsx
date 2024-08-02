import React, { Component } from 'react';
import './devices.css';
import Device from './device';
import media from './media.png';
import axios from '../../axios.jsx';
import Login from '../../spotify/login.js'; // Adjust the import based on your project structure

class Devices extends Component {
  state = { devices: [], show: false };

  async componentDidUpdate(prevProps, prevState) {
    if (!prevState.show && this.state.show) {
      await this.getDevices();
    }
  }

  transferDevice = async (id) => {
    const accessToken = await Login.getToken();
    if (!accessToken) {
      console.error('No access token available');
      return;
    }

    axios
        .put(
            '/me/player',
            { device_ids: [id], play: true },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
        )
        .then(this.hideDevices())
        .catch((error) => {
          console.error('Error transferring device:', error);
        });
  };

  toddleState = () => {
    this.setState((prevState) => {
      return { show: !prevState.show };
    });
  };

  hideDevices = () => {
    this.setState({ show: false });
  };

  renderDevices = () => {
    return this.state.devices.map((d, key) => (
        <Device item={d} key={key} onClick={() => this.transferDevice(d.id)} />
    ));
  };

  getDevices = async () => {
    const accessToken = await Login.getToken();
    if (!accessToken) {
      console.error('No access token available');
      return;
    }

    axios
        .get('/me/player/devices', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          this.setState({ devices: response.data.devices });
        })
        .catch((error) => {
          console.error('Error fetching devices:', error);
        });
  };

  componentDidMount() {
    this.getDevices();
  }

  render = () => (
      <div className="devices-container">
        <i onClick={this.toddleState} className="fa fa-desktop" />
        <div
            onClick={this.hideDevices}
            className={`overlay ${this.state.show ? 'active' : ''}`}
        />
        <div className={`devices ${!this.state.show ? 'hide' : ''}`}>
          <div className="devices-header">
            <h4>Connect to a device</h4>
            <i className="fa fa-question-circle-o" aria-hidden="true" />
          </div>
          <img src={media} alt="devices" />
          {this.state.devices.length > 1 && this.renderDevices()}
          {this.state.devices.length === 1 && (
              <div className="no-results">
                <div>
                  Connect lets you play and control Spotify on your devices.
                </div>
                <div>
                  Start Spotify on another device and it will magically appear here.
                </div>
              </div>
          )}
          <button
              className="learn-more"
              onClick={() => window.open('https://www.spotify.com/connect/')}
          >
            LEARN MORE
          </button>
          <div className="triangle" />
        </div>
      </div>
  );
}

export default Devices;
