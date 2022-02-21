import React, { useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";

import SiteItem from "./SiteItem";
import SiteNotice from "./SiteNotice";

const SitesList = (props) => {
  var allSites = [];
  if (props.sites) {
    allSites = props.sites.map((a) => {
      return { ...a };
    });
    if (
      allSites.length > 1 &&
      props.user &&
      props.user.status &&
      props.user.status === "free"
    ) {
      const sitesNotice = {
        type: "notice",
      };
      allSites.splice(1, 0, sitesNotice);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={allSites}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item, index }) => {
          switch (item.type) {
            case "notice":
              return <SiteNotice />;
            default:
              return (
                <SiteItem
                  {...props}
                  item={item}
                  index={index}
                  onSelect={props.onSelect}
                />
              );
          }
        }}
        contentContainerStyle={{ paddingVertical: 164 }}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SitesList;
