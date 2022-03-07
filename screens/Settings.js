import React from "react";
import * as Analytics from "expo-firebase-analytics";
import { StyleSheet, SectionList } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { View, Text, StatusBar } from "../components";
import { Layout, Font } from "../constants"

import SettingsItem from "../views/SettingsItem";
import SettingsFooter from "../views/SettingsFooter";

class Settings extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Analytics.logEvent("screen_view", { screen_name: this.props.route.name });
  }

  render() {
    return (
      <View style={styles.container}>
        <SectionList
          sections={this.props.settings}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index }) => {
            if (item) return <SettingsItem {...this.props} item={item} />;
            return null;
          }}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section: { category } }) => (
            <Text style={styles.header}>{category}</Text>
          )}
          contentInsetAdjustmentBehavior="automatic"
          ListFooterComponent={<SettingsFooter {...this.props} />}
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
  header: {
    fontWeight: Font.weight.semiBold,
    marginTop: Layout.default.large,
    marginBottom: Layout.default.small,
    marginHorizontal: Layout.default.medium2,
  },
});

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
