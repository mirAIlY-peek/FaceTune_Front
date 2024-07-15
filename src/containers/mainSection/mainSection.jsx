import React, { Component } from 'react';

import { connect } from 'react-redux';

import Header from '../../component/header/header';
import Footer from '../../component/footer/footer';

import Browse from '../../component/sections/browse/browser';
import Songs from '../../component/sections/songList/songList';
import Playlist from '../../component/sections/playlist/playlist';
import Artist from '../../component/sections/artist/artist';
import Album from '../../component/sections/album/album';
import Search from '../../component/sections/search/search';
import Albums from '../../component/sections/top/albums';
import Artists from '../../component/sections/top/artists';
import Modal from '../../component/playlistModal/modal';

import defaultProfile from './images/profile.png';
import './mainSection.css';

class MainSection extends Component {
  render = () => {
    let name = this.props.user.display_name;
    let id = this.props.user.id;

    let img = this.props.user.images[0]
      ? this.props.user.images[0].url
      : defaultProfile;

    return (
      <div className="main-section">
        <Header username={name || id} img={img} />
        <Modal />
        <div className="main-section-container">
          {/*{this.props.view === 'browse' ? <Browse /> : null}*/}
          {this.props.view === 'playlist' ? <Playlist /> : null}
          {/*{this.props.view === 'recently' ? <Songs recently /> : null}*/}
          {this.props.view === 'songs' ? <Songs /> : null}
          {/*{this.props.view === 'artist' ? <Artist /> : null}*/}
          {this.props.view === 'album' ? <Album /> : null}
          {/*{this.props.view === 'search' ? <Search /> : null}*/}
          {this.props.view === 'albums' ? <Albums /> : null}
          {/*{this.props.view === 'artists' ? <Artists /> : null}*/}
        </div>
        <Footer />
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    user: state.userReducer.user,
    view: state.uiReducer.view
  };
};

export default connect(mapStateToProps)(MainSection);
