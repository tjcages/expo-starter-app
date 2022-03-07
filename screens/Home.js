import React from "react";
import * as Analytics from "expo-firebase-analytics";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { StyleSheet, FlatList } from "react-native";
import { View, NavButton, StatusBar, useThemeColor } from "../components";

import InboxItem from "../views/InboxItem";

class Sites extends React.Component {
  constructor(props) {
    super(props);

    this.setSearch = this.setSearch.bind(this);
    this.getCurrentData = this.getCurrentData.bind(this);
  }

  componentDidMount() {
    Analytics.logEvent("screen_view", { screen_name: this.props.route.name });

    const container = useThemeColor({}, "container");
    // setup navigation header options
    this.props.navigation.setOptions({
      headerRight: () => (
        <NavButton
          onPress={() => console.log("Set navigation event")}
          // onPress={() => this.props.navigation.push("Settings")}
          icon={"plus-circle"}
        />
      ),
      headerSearchBarOptions: {
        onFocus: () =>
          Analytics.logEvent("Search_onFocus", {
            screen: this.props.route.name,
            purpose: `Opening the search bar to filter ${this.props.route.name} results`,
          }),
        onChangeText: (event) => this.setSearch(event.nativeEvent.text),
        autoFocus: true,
        barTintColor: container,
      },
    });
  }

  setSearch(text) {
    console.log(text);
  }

  getCurrentData() {
    return [1, 2, 3];
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <FlatList
            data={this.getCurrentData()}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item, index }) => {
              return <InboxItem index={index} />;
            }}
            stickySectionHeadersEnabled={false}
            contentInsetAdjustmentBehavior="automatic"
            keyboardDismissMode="interactive"
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
});

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Sites);
