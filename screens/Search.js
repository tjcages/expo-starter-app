import React from "react";
import * as Analytics from "expo-firebase-analytics";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { StyleSheet, FlatList } from "react-native";
import { View, Text, NavButton, StatusBar } from "../components";
import { Layout } from "../constants"

class Activity extends React.Component {
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
        <NavButton
          onPress={() => this.props.navigation.push("Settings")}
          icon={"plus-circle"}
        />
      ),
    });
  }

  onSelectHandler(item) {
    this.props.selectSite(item._id);
  }

  getCurrentData() {
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
              return <Text>Activity</Text>
            }}
            contentContainerStyle={{ paddingVertical: 164 }}
            stickySectionHeadersEnabled={false}
            ListEmptyComponent={
              <Text style={{marginHorizontal: Layout.default.medium2}}>Nothing to see here (yet)</Text>
            }
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

    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
