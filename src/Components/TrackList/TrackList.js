import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends React.Component {
  render() {
    const { tracks, playlistTracks, onAdd, onRemove, isRemoval } = this.props;
    const filteredTracks = tracks.filter(track => !playlistTracks.some(playlistTrack => playlistTrack.id === track.id));

    return (
      <div className="TrackList">
        {filteredTracks.map(track => {
          return <Track key={track.id} track={track} onAdd={onAdd} onRemove={onRemove} isRemoval={isRemoval} />;
        })}
      </div>
    );
  }
}

export default TrackList;