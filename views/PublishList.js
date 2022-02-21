import React from "react";
import { StyleSheet, View, SectionList } from "react-native";
import { Icon } from "react-native-elements";
import { Header, Text, useThemeColor } from "../components";

import PublishItem from "./PublishItem";
import SiteInfo from "../shared/SiteInfo";

const PublishList = (props) => {
  const secondary = useThemeColor({}, "secondary");

  return (
    <View style={styles.container}>
      {props.data.length > 0 ? (
        <SectionList
          sections={props.data}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index }) => {
            return (
              <PublishItem
                {...props}
                item={item}
                index={index}
                onSelect={props.onSelect}
              />
            );
          }}
          renderSectionHeader={({ section: { collection } }) => {
            const collectionInfo = props.collections.find(
              (collec) => collec._id === collection
            );
            return collectionInfo ? (
              <View style={styles.content}>
                <Icon
                  style={{ marginRight: 8 }}
                  name="database"
                  type="feather"
                  size={16}
                  color={secondary}
                />
                <Text
                  style={{
                    fontWeight: "600",
                  }}
                > 
                  {collectionInfo.name.toUpperCase()}
                </Text>
              </View>
            ) : (
              <View />
            );
          }}
          ListHeaderComponent={<SiteInfo {...props} />}
          contentContainerStyle={{ paddingTop: 104, paddingBottom: 164 }}
          stickySectionHeadersEnabled={false}
          keyboardDismissMode={"interactive"}
        />
      ) : (
        <View style={styles.emptyView}>
          <Header>No changes saved</Header>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 16,
    marginHorizontal: 16,
  },
  emptyView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PublishList;
