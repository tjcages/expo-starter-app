import React from "react";
import { StyleSheet } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { revokeAuthToken } from "../api/auth";
import { selectCollection } from "../api/collections";
import { selectItem } from "../api/items";

import { View, NavButton, StatusBar } from "../components";

import ItemsList from "../views/ItemsList";

class Items extends React.Component {
  constructor(props) {
    super(props);

    const collection = props.collections.filter((collection) => {
      return collection._id === props.selectedCollection;
    })[0];

    props.navigation.setOptions({ title: collection ? collection.name : "" });

    this.onSelectHandler = this.onSelectHandler.bind(this);

    this.state = {
      collection: collection,
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
        this.props.selectCollection(null);
      }
    );
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  onSelectHandler(item) {
    this.props.selectItem(item._id);
  }

  render() {
    return (
      <View style={styles.container}>
        <ItemsList
          {...this.props}
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
      selectCollection,
      selectItem,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Items);
