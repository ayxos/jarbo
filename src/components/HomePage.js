import React from 'react'
import {Link} from 'react-router'
import Item from './Item/Item'
import GoogleAd from 'react-google-ads'
import Tag from './Tag/Tag'
// Redux
import { connect } from 'react-redux'
import actions from '../redux/actions'
import { bindActionCreators } from 'redux'
// Auth
import Auth from '../modules/Auth'
import User from '../constants';

@connect((state) => state)
class HomePage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
  }

  componentWillMount() {
    if (Auth.isUserAuthenticated()) {
      var self = this;
      User.getBearer(Auth, function(info) {
        self.setState({user: info});
      })
    }
  }

  componentDidMount() {
    this.props.actions.getAllPrets();
  }

  render() {
    var self = this;
    var actions = this.props.actions;
    return (<div className='row'>
      <div className='content col-md-8'>
        {this.props.prets.length ? this.props.prets.map(function (item, index) {
          return (<div className='item' key={index}>
            <Item item={item} user={self.state.user} actions={actions} />
          </div>)
        }) : null}
      </div>
      <div className='col-md-4'>
        <div className='tags'>
          <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fdoblame%2F&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=440398176146518" width="340" height="185" style={{border:'none', overflow:'hidden'}} scrolling="no" frameBorder="0" allowTransparency="true"></iframe>
        </div>
        <div className='ad2'>
          <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
          <GoogleAd client="ca-pub-8070828061215574" slot="5483126445" format="auto" />
        </div>
        <div className='tags'>
          <Tag/>
        </div>
      </div>
    </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    prets: state.prets
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage)
