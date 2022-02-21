import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Text, Header } from "../components";

import CollectionItem from "./CollectionItem";
import ListHeader from "../shared/ListHeader"

const CollectionsList = (props) => {
  return (
    <View style={styles.container}>
      {props.collections && props.collections.length > 0 ? (
        <FlatList
          data={props.collections}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index }) => {
            return (
              <CollectionItem
                {...props}
                item={item}
                index={index}
                onSelect={props.onSelect}
              />
            );
          }}
          contentContainerStyle={{ paddingVertical: 164 }}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={
            <ListHeader {...props} title={props.site.name}/>
          }
        />
      ) : (
        <View style={styles.emptyView}>
          <Header>No collections</Header>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  header: { fontWeight: "600", marginBottom: 16 },
  emptyView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CollectionsList;
