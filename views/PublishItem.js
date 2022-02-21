import React from "react";
import { StyleSheet } from "react-native";
import { View, Container, Header } from "../components";

import ChangeItem from "./ChangeItem";

const PublishItem = (props) => {
  const itemId = props.item.item;
  const item = props.items.find((item) => item._id === itemId);

  return (
    <View style={styles.container}>
      <Header style={{ flex: 1 }} numberOfLines={1}>
        {item.name}
      </Header>
      <Container style={styles.content}>
        {props.item.changes.map((change) => {
          return <ChangeItem {...props} key={JSON.stringify(change)} item={item} change={change} onSelect={props.onSelect} />;
        })}
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    margin: 16,
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
    flexDirection: "column",
    marginTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderRadius: 6,
  },
});

export default PublishItem;
