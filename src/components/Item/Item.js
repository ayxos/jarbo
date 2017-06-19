import React from 'react'
import {Link} from 'react-router'
import PropTypes from 'prop-types'
import '../../styles/about-page.css'
import YouTube from 'react-youtube'
const youtubeUrl = 'https://www.youtube.com/embed/'

// Since this component is simple and static, there's no parent container for it.
class Item extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      pos: null,
      neg: null,
      newVote: null
    }
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.mute();
  }

  _onPlay(event) {
    var src = '/audios/' + this.opts.audio
    var audio = new Audio(src);
    audio.play();
  }

  isUserNewVote() {
    var rank = this.props.item.rank
    var userId = this.props.user.id
    var result = true
    for(var i = 0; i < rank.length; i++){
      if(rank[i].user === userId) {
        result = false;
        break;
      }
    };
    return result;
  }

  _rank(type) {
    if (!this.props.user 
    || this.props.user.id == this.props.item.author._id 
    || !this.state.newVote) return;
    this.props.actions.rankPret({
      pret: this.props.item, 
      rank : {
        user: this.props.user.id, 
        pos: type
      }
    });
  }

  componentDidMount() {
    var rank = this.props.item.rank
    var pos = 0;
    var neg =  0;
    for(var i = 0; i < rank.length; i++) {
      if(rank[i].pos) pos++;
      if(!rank[i].pos) neg++;
    };
    this.setState({
      pos: pos,
      neg: neg,
      newVote: this.props.user ? this.isUserNewVote() : this.state.newVote
    })
  }

  render () {
    var item = this.props.item
    const opts = {
      width: '100%',
      height: this.props.full ? '320px' : 'auto',
      audio: item.audio,
      playerVars: { // https://developers.google.com/youtube/player_parameters 
        start: item.start,
        end: item.start + 140
      }
    };
    var col = this.props.full ? 'col-md-12' : 'col-md-6';
    if (!this.props.user) console.log('no user')
    return (<div>
      <div className='row'>
        <div className={col}>
          <YouTube
            videoId={item.video.id}
            opts={opts}
            onReady={this._onReady}
            onPlay={this._onPlay}
          />
        </div>
        <div className={col}>
          <div className='legend'> Published {item.date} by <Link to={'/user/' + item.author._id}>@{item.author.name} </Link></div>
          <h2><Link to={'/item/' + item._id}>{item.video.title}</Link> </h2>
          <div className='row'>
            {item.tags && item.tags.map(function (item, index) {
              return (<span className='tagItem' key={index}> {item.text} </span>)
            })}
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <span className='icon'> <img src='/resources/imgs/good.png' width='25' onClick={this._rank.bind(this, 1)}/> {this.state.pos} </span>
            </div>
            <div className='col-md-6'>
              <span className='icon'> <img src='/resources/imgs/bad.png' width='25' onClick={this._rank.bind(this, 0)} /> {this.state.neg} </span>
            </div>
          </div>
          <div className='legend'> <Link to={'/item/' + item._id}> Say something: {item.comments.length} </Link></div>
        </div>
      </div>
    </div>
    )
  }
};

Item.propTypes = {
  item: PropTypes.object.isRequired
}

export default Item
