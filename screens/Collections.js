import React from "react";
import * as Analytics from "expo-firebase-analytics";
import { StyleSheet, FlatList } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { revokeAuthToken } from "../api/auth";
import { selectSite } from "../api/sites";
import { selectCollection, listCollections } from "../api/collections";

import {
  View,
  NavButton,
  Header,
  StatusBar,
  RefreshControl,
} from "../components";

import CollectionItem from "../views/CollectionItem";
import ListHeader from "../shared/ListHeader";

class Collections extends React.Component {
  constructor(props) {
    super(props);

    const site = props.sites.filter((site) => {
      return site._id === props.selectedSite;
    })[0];

    this.onRefresh = this.onRefresh.bind(this);
    this.onSelectHandler = this.onSelectHandler.bind(this);

    this.state = {
      site: site,
    };
  }

  componentDidMount() {
    Analytics.logEvent("screen_view", { screen_name: this.props.route.name });
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

  onRefresh() {
    this.props.listCollections(this.props.token, this.props.selectedSite);
  }

  onSelectHandler(item) {
    this.props.selectCollection(item._id);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          {this.props.collections && this.props.collections.length > 0 ? (
            <FlatList
              data={this.props.collections}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item, index }) => {
                return (
                  <CollectionItem
                    {...this.props}
                    item={item}
                    index={index}
                    onSelect={this.onSelectHandler}
                  />
                );
              }}
              contentContainerStyle={{ paddingVertical: 164 }}
              stickySectionHeadersEnabled={false}
              ListHeaderComponent={
                <ListHeader {...this.props} title={this.state.site.name} />
              }
              refreshControl={
                <RefreshControl
                  onRefresh={() => this.onRefresh()}
                />
              }
            />
          ) : (
            <View style={styles.emptyView}>
              <Header>No collections</Header>
            </View>
          )}
        </View>

        <StatusBar />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  header: { fontWeight: "600", marginBottom: 16 },
  emptyView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      revokeAuthToken,
      selectSite,
      selectCollection,
      listCollections,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Collections);
