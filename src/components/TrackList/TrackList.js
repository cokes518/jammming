import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends React.Component {

    render() {
      return (
        <div className="TrackList">
          {!this.props.tracks ? <p className='TrackList'>search for songs</p> :
            
            
            this.props.tracks.map(track => 
                 <Track key={track.id}
                       track={track} 
                       isRemoval={this.props.isRemoval} 
                       onAdd={this.props.onAdd} 
                       onRemove={this.props.onRemove} />)}
        </div>
      );
    }
  }

export default TrackList;

