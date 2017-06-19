import React from 'react'
import {Link} from 'react-router'
import '../../styles/about-page.css'
import Item from '../Item/Item'
// Redux
import { connect } from 'react-redux'
import actions from '../../redux/actions'
import { bindActionCreators } from 'redux'
// Auth
import Auth from '../../modules/Auth'
import User from '../../constants';

@connect((state) => state)
class UserPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
  }

  componentWillMount() {
    var self = this;
    this.props.actions.getPrets(this.props.routeParams.id);
    if (Auth.isUserAuthenticated()) {
      var self = this;
      User.getBearer(Auth, function(info) {
        self.setState({user: info});
      })
    }
  }

  // Since this component is simple and static, there's no parent container for it.
  render() {
    var self = this;
    return (<div>
      {this.state.user ? <section>
        <div className='row'>
          <div className='col-md-2'>
            <img src='https://asyd.microhire.com.au:7002/mhretain/img/user.png' width='100px' />
          </div>
          <div className='col-md-10'>
            <ul>
              <li><span><h3>Name: </h3>{this.state.user.name}</span> </li>
              <li><span><h3>Rep: </h3>{this.state.user.rank}</span> </li>
            </ul>
          </div>
        </div>
      </section> : null}
      <div>
        {this.props.prets && this.props.prets.length ? this.props.prets.map(function (item, index) {
          return (<div key={index} className='item'>
            <Item item={item} user={self.state.user} />
          </div>)
        }) : null}
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
)(UserPage)
