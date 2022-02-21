import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Text, Header } from "../components";

import Item from "./Item";
import ListHeader from "../shared/ListHeader";

const ItemsList = (props) => {
  const items = props.items ?? []
  const collectionItems = items.filter(
    (item) => item.collectionId === props.selectedCollection
  );

  return (
    <View style={styles.container}>
      {collectionItems && collectionItems.length > 0 ? (
        <FlatList
          data={collectionItems}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index }) => {
            return (
              <Item
                {...props}
                item={item}
                index={index}
                onSelect={props.onSelect}
              />
            );
          }}
          contentContainerStyle={{ paddingVertical: 164 }}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={<ListHeader {...props} title={"Items"} />}
        />
      ) : (
        <View style={styles.emptyView}>
          <Header>No items</Header>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: { fontWeight: "600", marginBottom: 16, marginLeft: 16 },
  emptyView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ItemsList;
