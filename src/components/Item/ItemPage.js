import React from 'react'
import {Link} from 'react-router'
import '../../styles/about-page.css'
import Item from './Item'
// Redux
import { connect } from 'react-redux'
import actions from '../../redux/actions'
import { bindActionCreators } from 'redux'
// Auth
import Auth from '../../modules/Auth'
import User from '../../constants';

@connect((state) => state)
class ItemPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
  }

  componentWillMount() {
    var self = this;
    this.props.actions.getPret(this.props.routeParams.id);
    if (Auth.isUserAuthenticated()) {
      var self = this;
      User.getBearer(Auth, function(info) {
        self.setState({user: info});
      })
    }
  }

  updateStartTime(event) {
    console.log(event)
  }

  render() {
    var self = this;
    if (!this.props.pret) return <div/>;
    return (<div>
      <section>
        <Item full={true} user={this.state.user} item={this.props.pret} />
      </section>
      <div>
        <div className='item'> 
          <input width='90%' height='100px' onChange={evt => self.updateStartTime(evt)}/>
        </div>
        {/* TODO: ad here */}
        {this.props.pret.comments && this.props.pret.comments.length ? this.props.pret.comments.map(function (comment, index) {
          return (<div className='item' key={index}> {comment.text} </div>)
        }) : null}
      </div>
    </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    pret: state.prets[0]
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
)(ItemPage)
