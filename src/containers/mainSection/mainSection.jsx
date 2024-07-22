import React, { Component } from 'react';
import { connect } from 'react-redux';

import Browse from '../../component/sections/browse/browser';
import Search from '../../component/sections/search/search.jsx';
import Artist from '../../component/sections/artist/artist.jsx';



import Header from '../../component/header/header';
import Footer from '../../component/footer/footer';
import Songs from '../../component/sections/songList/songList';
import Album from '../../component/sections/album/album';
import Albums from '../../component/sections/top/albums';
import Modal from '../../component/playlistModal/modal';
import Playlist from '../../component/sections/playlist/playlist';
import defaultProfile from './images/profile.png';
import './mainSection.css';
import Artists from "../../component/sections/top/artists.jsx";

class MainSection extends Component {
    render() {
        const { user, view } = this.props;

        if (!user) {
            return <div>Loading user data...</div>;
        }

        const name = user.display_name || user.id;
        const img = user.images && user.images[0] ? user.images[0].url : defaultProfile;

        return (
            <div className="main-section">
                {/*<Header username={name} img={img} />*/}
                <Modal />
                <div className="main-section-container">
                    {view === 'browse' ? <Browse /> : null}
                    {view === 'playlist' ? <Playlist /> : null}
                    {view === 'recently' ? <Songs recently /> : null}
                    {view === 'songs' ? <Songs /> : null}
                    {view === 'artist' ? <Artist /> : null}
                    {view === 'album' ? <Album /> : null}
                    {view === 'search' ? <Search /> : null}
                    {view === 'albums' ? <Albums /> : null}
                    {view === 'artists' ? <Artists /> : null}
                </div>
                <Footer />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.userReducer.user,
    view: state.uiReducer.view
});

export default connect(mapStateToProps)(MainSection);
