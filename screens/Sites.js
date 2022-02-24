import React from "react";
import * as Analytics from "expo-firebase-analytics";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { revokeAuthToken } from "../api/auth";
import { selectSite } from "../api/sites";

import { StyleSheet, FlatList } from "react-native";
import { View, StatusBar } from "../components";

import {
  getCurrentAuthorizationInfo,
  getCurrentAuthorizedUser,
} from "../api/auth";
import { listSites } from "../api/sites";

import SiteItem from "../views/SiteItem";
import SiteNotice from "../views/SiteNotice";
import NavigationButton from "../shared/NavigationButton";

class Sites extends React.Component {
  constructor(props) {
    super(props);

    this.onSelectHandler = this.onSelectHandler.bind(this);
    this.getCurrentData = this.getCurrentData.bind(this);
  }

  componentDidMount() {
    Analytics.logEvent("screen_view", { screen_name: this.props.route.name });

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

  getCurrentData() {
    if (this.props.sites) {
      const sites = this.props.sites.map((a) => {
        return { ...a };
      });
      if (
        sites.length > 1 &&
        this.props.user &&
        this.props.user.status &&
        this.props.user.status === "free"
      ) {
        const sitesNotice = {
          type: "notice",
        };
        sites.splice(1, 0, sitesNotice);
      }
      return sites;
    }
    return [];
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <FlatList
            data={this.getCurrentData()}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item, index }) => {
              switch (item.type) {
                case "notice":
                  return <SiteNotice />;
                default:
                  return (
                    <SiteItem
                      {...this.props}
                      item={item}
                      index={index}
                      onSelect={this.onSelectHandler}
                    />
                  );
              }
            }}
            contentContainerStyle={{ paddingVertical: 164 }}
            stickySectionHeadersEnabled={false}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(Sites);
