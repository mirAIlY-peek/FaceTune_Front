import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withUiActions from '../../hoc/uiHoc';
import { fetchSearchData } from '../../store/actions/searchActions';
import './trackSearch.css';

class Search extends Component {
    render = () => (
        <div className="track-search-container">
            <form>
                <input
                    type="text"
                    placeholder="Search for songs, artists..."
                    className="search-input"
                    onChange={event => this.props.fetchSearchData(event.target.value)}
                    onClick={this.props.onSearch}
                />
            </form>
        </div>
    );
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            fetchSearchData
        },
        dispatch
    );
};

export default connect(
    null,
    mapDispatchToProps
)(withUiActions(Search));
