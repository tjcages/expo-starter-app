import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useRoute } from "@react-navigation/native";

import { revokeAuthToken } from "../api/auth";
import { selectSite } from "../api/sites";

import { StyleSheet } from "react-native";
import { View, StatusBar } from "../components";

import SitesList from "../views/SitesList";
import NavigationButton from "../shared/NavigationButton";

import {
  getCurrentAuthorizationInfo,
  getCurrentAuthorizedUser,
} from "../api/auth";
import { listSites } from "../api/sites";

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.onSelectHandler = this.onSelectHandler.bind(this);
  }

  componentDidMount() {
    // setup navigation header options
    this.props.navigation.setOptions({
      headerRight: () => (
        <NavigationButton
          onPress={() => this.props.navigation.push("Settings")}
          icon={"settings"}
        />
      ),
    });
  }

  componentDidUpdate(prevProps) {
    // if we are currently authorized, allow other requests
    if (
      this.props.authorization &&
      this.props.authorization.status === "confirmed"
    ) {
      if (this.props.selectedSite) {
        const { index, routes } = this.props.navigation.getState();
        const currentRoute = routes[index].name;

        if (this.props.selectedItem) {
          // item has been selected – automatically navigate to EditItem
          this.props.navigation.navigate("EditItem");
        } else if (this.props.selectedCollection) {
          // collection has been selected – automatically navigate to Items
          if (currentRoute !== "Publish")
            this.props.navigation.navigate("Items");
          // this.props.navigation.reset({
          //   index: 2,
          //   routes: [{ name: 'Sites' }, { name: 'Collections' }, { name: 'Items' }]
          // });
        } else {
          // site has been selected – automatically navigate to Collection
          if (currentRoute !== "Publish")
            this.props.navigation.navigate("Collections");
        }
      }
    }
  }

  onSelectHandler(item) {
    this.props.selectSite(item._id);
  }

  render() {
    return (
      <View style={styles.container}>
        <SitesList
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
      getCurrentAuthorizationInfo,
      getCurrentAuthorizedUser,
      listSites,
      selectSite,
      revokeAuthToken,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Home);
