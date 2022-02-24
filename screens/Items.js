import React from "react";
import * as Analytics from "expo-firebase-analytics";
import { StyleSheet, FlatList } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { revokeAuthToken } from "../api/auth";
import { selectCollection } from "../api/collections";
import { selectItem } from "../api/items";
import { getAllCollectionItems } from "../api/items";

import {
  View,
  Header,
  NavButton,
  StatusBar,
  RefreshControl,
} from "../components";

import Item from "../views/Item";
import ListHeader from "../shared/ListHeader";

class Items extends React.Component {
  constructor(props) {
    super(props);

    const collection = props.collections.filter((collection) => {
      return collection._id === props.selectedCollection;
    })[0];
    props.navigation.setOptions({ title: collection ? collection.name : "" });

    this.onRefresh = this.onRefresh.bind(this);
    this.onSelectHandler = this.onSelectHandler.bind(this);
    this.getCurrentData = this.getCurrentData.bind(this);

    this.state = {
      collection: collection,
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
        this.props.selectCollection(null);
      }
    );
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  onRefresh() {
    this.props.getAllCollectionItems(
      this.props.token,
      this.props.selectedCollection,
      true
    );
  }

  onSelectHandler(item) {
    this.props.selectItem(item._id);
  }

  getCurrentData() {
    const filteredItems = this.props.items.filter(
      (item) => item.collectionId === this.props.selectedCollection
    );
    return filteredItems;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          {this.props.items && this.props.items.length > 0 ? (
            <FlatList
              data={this.getCurrentData()}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item, index }) => {
                return (
                  <Item
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
                <ListHeader {...this.props} title={"Items"} />
              }
              refreshControl={
                <RefreshControl
                  onRefresh={() => this.onRefresh()}
                />
              }
            />
          ) : (
            <View style={styles.emptyView}>
              <Header>No items</Header>
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
  header: { fontWeight: "600", marginBottom: 16, marginLeft: 16 },
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
      selectCollection,
      selectItem,
      getAllCollectionItems,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Items);
