import React from "react";
import { StyleSheet, View, SectionList } from "react-native";
import { Header } from "../components";

import { timeAgo } from "../utils";

import SchemaItem from "./SchemaItem";

const CollectionSchema = (props) => {
  const ref = React.createRef();
  const schema = props.collectionSchema ?? [];
  const currentSchema = schema.find(
    (schema) => schema._id === props.selectedCollection
  );

  const basicInfo = ["name", "slug"];
  const itemInfo = [
    "created-on",
    "updated-on",
    "published-on",
    "created-by",
    "updated-by",
    "published-by",
  ];
  const actions = ["_archived", "_draft"];

  const createItem = (type) => {
    return {
      editable: false,
      type: "Info",
      name: type,
      slug: type.toLowerCase(),
      value: timeAgo.format(
        new Date(props.item[`${type.toLowerCase()}-on`]),
        "round-minute"
      ),
    };
  };

  const createSections = () => {
    const selectedSchema = currentSchema.fields.map((field) => {
      const updatedField = field;

      if (
        props.changes &&
        props.changes[props.selectedItem] &&
        props.changes[props.selectedItem][field.slug]
      ) {
        // if changes exist, use those
        updatedField.value = props.changes[props.selectedItem][field.slug];
      } else {
        // otherwise, default to state
        updatedField.value = props.item[field.slug];
      }
      return updatedField;
    });
    const selectedInfo = [
      createItem("Published"),
      createItem("Updated"),
      createItem("Created"),
    ];

    return [
      {
        category: "Basic info",
        data: selectedSchema.filter((field) => {
          return basicInfo.includes(field.slug);
        }),
      },
      {
        category: "Custom fields",
        data: selectedSchema.filter((field) => {
          return (
            !basicInfo.includes(field.slug) &&
            !itemInfo.includes(field.slug) &&
            !actions.includes(field.slug)
          );
        }),
      },
      {
        category: "Actions",
        data: selectedSchema.filter((field) => {
          return actions.includes(field.slug);
        }),
      },
      {
        category: "Item info",
        data: selectedInfo,
      },
    ];
  };

  return (
    <View style={styles.container}>
      {props.collectionSchema &&
      currentSchema &&
      currentSchema.fields.length > 0 ? (
        <SectionList
          ref={ref}
          sections={createSections()}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index }) => {
            return (
              <SchemaItem
                {...props}
                item={item}
                index={index}
                onSelect={props.onSelect}
              />
            );
          }}
          renderSectionHeader={({ section: { category } }) => (
            <Header style={{ margin: 16 }}>{category}</Header>
          )}
          contentContainerStyle={{ paddingVertical: 164 }}
          stickySectionHeadersEnabled={false}
          keyboardDismissMode={"interactive"}
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
  emptyView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CollectionSchema;
