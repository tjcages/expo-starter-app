import React from "react";
import { StyleSheet } from "react-native"
import { Container, Title, Text } from "../components";
import { Layout } from "../constants"

const InboxItem = (props) => {

  return (
    <Container style={styles.container}>
      <Title>{props.index + 1} items</Title>
      <Text>And a cool description to go along</Text>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: Layout.default.medium2,
    marginBottom: Layout.default.medium,
    padding: Layout.default.medium,
    borderRadius: Layout.default.borderRadius
  }
})

export default InboxItem