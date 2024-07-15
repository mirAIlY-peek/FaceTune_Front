import React from "react";
import ReactDragListView from "react-drag-listview";
import InfiniteScroll from "react-infinite-scroller";
import Song from "../items/song";
import withSongsState from "../hoc/songHoc";
import EmptySection from "./components/emptySection/empty";
import "./playlistTable.css";

const DraggableWrapper = ({ children, isMine, onDragEnd }) => {
  if (!isMine) return <div>{children}</div>;

  return (
      <ReactDragListView
          onDragEnd={onDragEnd}
          nodeSelector="li"
          handleSelector="li"
      >
        {children}
      </ReactDragListView>
  );
};

const PlaylistTable = (props) => {
  const isMine = props.playlist && props.playlist.mine;

  const handleDragEnd = (fromIndex, toIndex) => {
    if (isMine) {
      props.movePlaylistSong(props.playlist, fromIndex, toIndex);
    }
  };

  if (props.songs.length === 0) {
    return <EmptySection />;
  }

  return (
      <div className="playlist-table">
        <div className="song-header-container">
          <div style={{ width: 40 }} />
          <div style={{ width: 40 }} />
          <div className="song-title-header">
            <p>Title</p>
          </div>
          <div className="song-artist-header">
            <p>Artist</p>
          </div>
          <div className="song-album-header">
            <p>Album</p>
          </div>
          {!props.removeDate && (
              <div className="song-added-header">
                <i className="fa fa-calendar-plus-o" aria-hidden="true" />
              </div>
          )}
          <div className="song-length-header">
            <i className="fa fa-clock-o" aria-hidden="true" />
          </div>
        </div>
        <DraggableWrapper isMine={isMine} onDragEnd={handleDragEnd}>
          <InfiniteScroll
              pageStart={0}
              loadMore={props.fetchMoreSongs}
              hasMore={props.more}
              loader={<div className="loader" key={0} />}
          >
            {props.songs.map((item, i) => (
                <Song
                    key={`${item.track ? item.track.id : item.id}-${i}`}
                    onAdd={() => {
                      props.changeSongStatus(i, true);
                      props.addSong(item.track ? item.track.id : item.id);
                    }}
                    onDelete={() => {
                      props.changeSongStatus(i, false);
                      props.removeSong(item.track ? item.track.id : item.id);
                    }}
                    removeDate={props.removeDate}
                    added_at={item.track ? item.added_at : ""}
                    contains={props.songsStatus[i]}
                    item={item.track || item}
                    id={item.track ? item.track.id : item.id}
                    uri={props.uri}
                    offset={i}
                    current={props.current}
                    playing={props.playing}
                    pauseSong={props.pauseSong}
                    playSong={props.playSong}
                />
            ))}
          </InfiniteScroll>
        </DraggableWrapper>
      </div>
  );
};

export default withSongsState(PlaylistTable);
