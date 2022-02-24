import React from "react";
import * as Analytics from "expo-firebase-analytics";
import { StyleSheet } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { revokeAuthToken } from "../api/auth";
import { selectItem, updateItemValue } from "../api/items";

import { View, StatusBar } from "../components";
import NavigationButton from "../shared/NavigationButton";

import CollectionSchema from "../views/CollectionSchema";

class EditItem extends React.Component {
  constructor(props) {
    super(props);

    const item = props.items.filter((item) => {
      return item._id === props.selectedItem;
    })[0];

    props.navigation.setOptions({ title: item ? item.name : "" });

    this.state = {
      item: item,
    };
  }

  componentDidMount() {
    Analytics.logEvent("screen_view", { screen_name: this.props.route.name });
    // setup navigation header options
    // this.props.navigation.setOptions({
    //   headerRight: () => (
    //     <NavigationButton
    //       onPress={() => this.props.navigation.push("Settings")}
    //       icon={"heart"}
    //     />
    //   ),
    // });

    this._unsubscribe = this.props.navigation.addListener(
      "beforeRemove",
      () => {
        this.props.selectItem(null);
      }
    );
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  // onSelectHandler(item) {
  //   this.props.selectCollection(item._id);
  // }

  render() {
    return (
      <View style={styles.container}>
        <CollectionSchema
          {...this.props}
          item={this.state.item}
          // onSelect={(item) => this.onSelectHandler(item)}
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
      selectItem,
      updateItemValue,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(EditItem);
