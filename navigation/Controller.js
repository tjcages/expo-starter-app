import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View } from "react-native";

import {
  getCurrentAuthorizationInfo,
  getCurrentAuthorizedUser,
} from "../api/auth";
import { listSites, listDomains, publishSite } from "../api/sites";
import { listCollections, getCollectionSchema } from "../api/collections";
import { getAllCollectionItems } from "../api/items";

import MainNavigation from "./MainNavigation";
import LoginNavigation from "./LoginNavigation";
import SaveStatus from "../shared/SaveStatus";

class Controller extends React.Component {
  constructor(props) {
    super(props);

    if (props.token) props.getCurrentAuthorizationInfo(props.token);

    this.statusHandler = this.statusHandler.bind(this);

    this.state = {
      animateChanges: false,
      changesPending: false,
      publishPending: false,
    };
  }

  componentDidUpdate(prevProps) {
    const tokenChanged = this.props.token !== prevProps.token;

    const authorizationChanged =
      this.props.authorization !== prevProps.authorization;

    if (this.props.token && tokenChanged)
      this.props.getCurrentAuthorizationInfo(this.props.token);
    if (
      this.props.authorization &&
      authorizationChanged
    )
      this.props.getCurrentAuthorizedUser(this.props.token);

    // if we are currently authorized, allow other requests
    if (
      this.props.authorization &&
      this.props.authorization.status === "confirmed"
    ) {
      // load sites
      if (this.props.sites === null) {
        this.props.listSites(this.props.token);
      }

      // load collections
      if (this.props.selectedSite && this.props.collections === null) {
        this.props.listCollections(this.props.token, this.props.selectedSite);

        const sites = this.props.sites ?? [];
        const selectedSite = sites.find(
          (s) => s._id === this.props.selectedSite
        );
        this.props.listDomains(this.props.token, selectedSite);
      }

      // load items
      // reduce current items to their collection id
      const items = this.props.items ?? [];
      const collectionItems = items.map((item) => item.collectionId);
      if (
        this.props.selectedSite &&
        this.props.selectedCollection &&
        !collectionItems.includes(this.props.selectedCollection)
      ) {
        this.props.getAllCollectionItems(
          this.props.token,
          this.props.selectedCollection
        );
      }

      // load collection schema
      const currentSchema = this.props.collectionSchema ?? [];
      const collectionSchema = currentSchema.map((schema) => schema._id);
      if (
        this.props.selectedSite &&
        this.props.selectedCollection &&
        this.props.selectedItem &&
        !collectionSchema.includes(this.props.selectedCollection)
      ) {
        this.props.getCollectionSchema(
          this.props.token,
          this.props.selectedCollection
        );
      }

      // handle saving popup
      // check if changes have been made
      if (prevProps.selectedItem && this.props.changes) {
        const changes = this.props.changes[prevProps.selectedItem];
        if (changes && !this.state.changesPending)
          this.setState({ changesPending: true });
      }
      // only after we have left the Editing screen do we show the popup
      if (
        this.props.selectedSite &&
        this.props.selectedCollection &&
        this.props.selectedItem === null &&
        this.state.changesPending
      ) {
        if (!this.state.animateChanges)
          this.setState({ animateChanges: true, changesPending: false });
      }

      // check for pending publish's
      if (this.props.publishPending) {
        // get the data to actually publish the changes made to this site
        const siteId = this.props.selectedSite;
        const domains = this.props.domains ?? {};
        const selectedDomainObjects = domains[siteId].filter(
          (dom) => dom.selected !== false
        );
        const selectedDomains = selectedDomainObjects.map((dom) => dom.name);

        this.props.publishSite(this.props.token, siteId, selectedDomains);
      }
    }
  }

  statusHandler() {
    this.setState({ animateChanges: false });
  }

  render() {
    // check if user is authorized
    return this.props.authorization &&
      this.props.token &&
      this.props.authorization.status === "confirmed" ? (
      <View style={{ flex: 1 }}>
        <MainNavigation {...this.props} />
        {this.state.animateChanges && (
          <SaveStatus
            title="Changes saved locally"
            animationDone={this.statusHandler}
          />
        )}
      </View>
    ) : (
      <LoginNavigation {...this.props} />
    );
  }
}

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getCurrentAuthorizationInfo,
      getCurrentAuthorizedUser,
      listSites,
      listDomains,
      publishSite,
      listCollections,
      getCollectionSchema,
      getAllCollectionItems,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Controller);
