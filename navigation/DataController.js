import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// Navigation Manager
import { navigationRef } from "./RootNavigation";

// APIs
import { auth } from "../api/firebase";
import { revokeReduxStore } from "../api/auth";
import { getCurrentUser } from "../api/user";
import { loadSettings } from "../api/settings";

// Navigations
import LoadingController from "./LoadingController";
import MainNavigation from "./MainNavigation";
import LoginNavigation from "./LoginNavigation";

class DataController extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    // load user settings immediately
    this.props.loadSettings(navigationRef);

    // handle authorization refreshing with Firebase Auth
    auth.onAuthStateChanged((user) => {
      if (user) {
        // user is logged in
        // always refresh the user object
        this.props.getCurrentUser();
      } else {
        // user is not logged in
        // always refresh redux persist store when user logs out
        this.props.revokeReduxStore();
      }
      this.setState({ user });
    });
  }

  componentDidUpdate(prevProps) {
    // handle updates to the data layer
  }

  render() {
    // check if user is authorized from
    return (
      <LoadingController {...this.props}>
        {this.props.user ? (
          <MainNavigation {...this.props} navRef={navigationRef} />
        ) : (
          <LoginNavigation {...this.props} navRef={navigationRef} />
        )}
      </LoadingController>
    );
  }
}

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      revokeReduxStore,
      getCurrentUser,
      loadSettings,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(DataController);
