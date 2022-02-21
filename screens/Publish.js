import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { View, NavButton, ActivityIndicator, Header } from "../components";

import { revokeAuthToken } from "../api/auth";
import { revertChange, publishItemChange } from "../api/items";
import { updateDomainSelection, updatePublishStatus } from "../api/sites";

import PublishList from "../views/PublishList";
import PublishButton from "../shared/PublishButton";
import PublishSuccess from "../shared/PublishSuccess";

const Publish = (props) => {
  useEffect(() => {
    // setup navigation header options
    props.navigation.setOptions({
      headerRight: () => (
        <NavButton onPress={() => props.navigation.goBack()} text="Done" />
      ),
    });
  }, []);

  const handlePublish = () => {
    // get the data to update the collection items before publishing
    const data = getChangesData();

    data.map((collection) => {
      const collectionId = collection.collection;
      collection.data.map((itemChanges) => {
        const itemId = itemChanges.item;
        const item = props.items.find((item) => item._id === itemId);
        const changes = Object.assign(...itemChanges.changes);

        // make the request to update each collection item
        props.publishItemChange(props.token, collectionId, item, changes);
      });
    });
  };

  const getChangesData = () => {
    // this is just a nightmare....
    var data = [];
    if (props.changes) {
      Object.keys(props.changes).forEach((itemId) => {
        const item = props.items.find((item) => item._id === itemId);
        const collection = item.collectionId;
        var changes = [];
        var adding = [];

        const currentChanges = props.changes[itemId];
        Object.keys(currentChanges).map((change) => {
          const value = {};
          value[change] = currentChanges[change];
          adding.push(value);
        });
        changes.push({ item: itemId, changes: adding });

        const existingIndex = data.findIndex(
          (item) => item.collection === collection
        );
        if (existingIndex !== -1) {
          const existingItem = data[existingIndex];
          existingItem.data = [...existingItem.data, ...changes];
          data[existingIndex] = existingItem;
        } else {
          const update = {
            collection: collection,
            data: changes,
          };
          data.push(update);
        }
      });
    }
    return data;
  };

  return (
    <View style={styles.container}>
      <PublishList {...props} data={getChangesData()} />

      <PublishButton {...props} onPress={() => handlePublish()} />
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />

      {props.publishPending && (
        <View style={styles.overlay}>
          <ActivityIndicator />
        </View>
      )}
      {props.publishSuccess && (
        <PublishSuccess {...props} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: "transparent",
  },
  overlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
    zIndex: 100,
  },
});

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      revokeAuthToken,
      revertChange,
      publishItemChange,
      updateDomainSelection,
      updatePublishStatus
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Publish);
