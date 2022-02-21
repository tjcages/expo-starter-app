import React from "react";
import { StyleSheet } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { revokeAuthToken } from "../api/auth";
import { selectSite } from "../api/sites";
import { selectCollection } from "../api/collections";

import { View, NavButton, StatusBar } from "../components";

import CollectionList from "../views/CollectionList";

class Collections extends React.Component {
  constructor(props) {
    super(props);

    const site = props.sites.filter((site) => {
      return site._id === props.selectedSite;
    })[0];

    this.onSelectHandler = this.onSelectHandler.bind(this);

    this.state = {
      site: site,
    };
  }

  componentDidMount() {
    // setup navigation header options
    this.props.navigation.setOptions({
      headerRight: () => (
        <NavButton
          onPress={() => this.props.navigation.push("Publish")}
          text="Publish"
          disabled={
            this.props.changes
              ? Object.keys(this.props.changes).length === 0
              : false
          }
        />
      ),
    });

    this._unsubscribe = this.props.navigation.addListener(
      "beforeRemove",
      () => {
        this.props.selectSite(null);
      }
    );
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  onSelectHandler(item) {
    this.props.selectCollection(item._id);
  }

  render() {
    return (
      <View style={styles.container}>
        <CollectionList
          {...this.props}
          site={this.state.site}
          onSelect={(item) => this.onSelectHandler(item)}
        />

        <StatusBar />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: "transparent",
  },
});

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      revokeAuthToken,
      selectSite,
      selectCollection,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Collections);
