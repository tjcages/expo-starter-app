import React, { useState } from "react";
import {
  StyleSheet,
  Switch,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Icon } from "react-native-elements";
import Colors from "../constants/Colors";
import {
  useThemeColor,
  Header,
  View,
  Container,
  Text,
  TextField,
  Button,
  NavButton,
} from "../components";
import { SvgUri } from "react-native-svg";

function ChangeItem(props) {
  const currentSchema = props.collectionSchema.find(
    (schema) => schema._id === props.item.collectionId
  );
  const slug = Object.keys(props.change)[0];
  const editedField = currentSchema.fields.filter(
    (field) => field.slug === slug
  )[0];
  const oldValue = props.item[slug];
  const newValue = props.change[slug];

  const renderItem = (item) => {
    switch (item.type) {
      case "Bool":
        return (
          <SwitchItem
            {...props}
            item={editedField}
            newValue={newValue}
            oldValue={oldValue}
            revertChange={() => handleRevertChange(slug)}
          />
        );
      case "ImageRef":
        return (
          <ImageItem
            {...props}
            item={editedField}
            newValue={newValue}
            oldValue={oldValue}
            revertChange={() => handleRevertChange(slug)}
          />
        );
      case "PlainText":
      case "RichText":
        return (
          <TextItem
            {...props}
            item={editedField}
            newValue={newValue}
            oldValue={oldValue}
            revertChange={() => handleRevertChange(slug)}
          />
        );
      case "Info":
        return <SchemaInfo {...props} item={editedField} />;
      case "CommercePrice":
        return <PriceItem {...props} item={editedField} />;
      case "Date":
        return (
          <DateItem
            {...props}
            item={editedField}
            newValue={newValue}
            oldValue={oldValue}
            revertChange={() => handleRevertChange(slug)}
          />
        );
      case "Link":
        return (
          <LinkItem
            {...props}
            item={editedField}
            newValue={newValue}
            oldValue={oldValue}
            revertChange={() => handleRevertChange(slug)}
          />
        );
      case "Option":
        return (
          <OptionItem
            {...props}
            item={editedField}
            newValue={newValue}
            oldValue={oldValue}
            revertChange={() => handleRevertChange(slug)}
          />
        );
      default:
        return <Text>Need to do</Text>;
    }
  };

  const handleRevertChange = (slug) => {
    props.revertChange(props.item._id, slug);
  };

  return renderItem(editedField);
}

const createTwoButtonAlert = (revertChange) => {
  return Alert.alert(
    "Revert changes",
    "Are you sure you want to revert the changes for this item?",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => revertChange() },
    ]
  );
};

const TextItem = (props) => (
  <View style={styles.container}>
    <View style={styles.headerContainer}>
      <Text style={styles.header}>
        {props.item.name}{" "}
        <Text style={[styles.header, { color: Colors.default.green }]}>
          (changes)
        </Text>
      </Text>
      <NavButton
        style={{ fontSize: 16 }}
        text="Revert"
        lightColor={Colors.default.red}
        darkColor={Colors.default.red}
        onPress={() => createTwoButtonAlert(props.revertChange)}
      />
    </View>
    <View style={{ marginBottom: 8, borderRadius: 6 }}>
      <TextField
        style={[
          styles.slimTextfield,
          {
            borderColor: Colors.default.green,
            backgroundColor: Colors.default.lightGreen,
          },
        ]}
        multiline
        scrollEnabled={false}
        editable={false}
        value={props.newValue}
      />
    </View>
    <View style={{ borderRadius: 6 }}>
      <TextField
        style={[
          styles.slimTextfield,
          {
            borderColor: Colors.default.red,
            backgroundColor: Colors.default.lightRed,
          },
        ]}
        multiline
        scrollEnabled={false}
        editable={false}
        value={props.oldValue}
      />
    </View>
  </View>
);

const DateItem = (props) => {
  const newDate = new Date(props.newValue);
  const oldDate = new Date(props.oldValue);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const newDateString = newDate.toLocaleDateString(undefined, options);
  const oldDateString = oldDate.toLocaleDateString(undefined, options);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>
          {props.item.name}{" "}
          <Text style={[styles.header, { color: Colors.default.green }]}>
            (changes)
          </Text>
        </Text>
        <NavButton
          style={{ fontSize: 16 }}
          text="Revert"
          lightColor={Colors.default.red}
          darkColor={Colors.default.red}
          onPress={() => createTwoButtonAlert(props.revertChange)}
        />
      </View>
      <View style={{ marginBottom: 8, borderRadius: 6 }}>
        <TextField
          style={[
            styles.slimTextfield,
            {
              borderColor: Colors.default.green,
              backgroundColor: Colors.default.lightGreen,
            },
          ]}
          multiline
          scrollEnabled={false}
          editable={false}
          value={newDateString}
        />
      </View>
      <View style={{ borderRadius: 6 }}>
        <TextField
          style={[
            styles.slimTextfield,
            {
              borderColor: Colors.default.red,
              backgroundColor: Colors.default.lightRed,
            },
          ]}
          multiline
          scrollEnabled={false}
          editable={false}
          value={oldDateString}
        />
      </View>
    </View>
  );
};

const LinkItem = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>
          {props.item.name}{" "}
          <Text style={[styles.header, { color: Colors.default.green }]}>
            (changes)
          </Text>
        </Text>
        <NavButton
          style={{ fontSize: 16 }}
          text="Revert"
          lightColor={Colors.default.red}
          darkColor={Colors.default.red}
          onPress={() => createTwoButtonAlert(props.revertChange)}
        />
      </View>
      <View style={{ marginBottom: 8, borderRadius: 6 }}>
        <TextField
          style={[
            styles.slimTextfield,
            {
              borderColor: Colors.default.green,
              backgroundColor: Colors.default.lightGreen,
            },
          ]}
          multiline
          scrollEnabled={false}
          editable={false}
          value={props.newValue}
        />
      </View>
      <View style={{ borderRadius: 6 }}>
        <TextField
          style={[
            styles.slimTextfield,
            {
              borderColor: Colors.default.red,
              backgroundColor: Colors.default.lightRed,
            },
          ]}
          multiline
          scrollEnabled={false}
          editable={false}
          value={props.oldValue}
        />
      </View>
    </View>
  );
};

const OptionItem = (props) => (
  <View style={styles.container}>
    <View style={styles.headerContainer}>
      <Text style={styles.header}>
        {props.item.name}{" "}
        <Text style={[styles.header, { color: Colors.default.green }]}>
          (changes)
        </Text>
      </Text>
      <NavButton
        style={{ fontSize: 16 }}
        text="Revert"
        lightColor={Colors.default.red}
        darkColor={Colors.default.red}
        onPress={() => createTwoButtonAlert(props.revertChange)}
      />
    </View>
    <View style={{ marginBottom: 8, borderRadius: 6 }}>
      <TextField
        style={[
          styles.slimTextfield,
          {
            borderColor: Colors.default.green,
            backgroundColor: Colors.default.lightGreen,
          },
        ]}
        multiline
        scrollEnabled={false}
        editable={false}
        value={props.newValue}
      />
    </View>
    <View style={{ borderRadius: 6 }}>
      <TextField
        style={[
          styles.slimTextfield,
          {
            borderColor: Colors.default.red,
            backgroundColor: Colors.default.lightRed,
          },
        ]}
        multiline
        scrollEnabled={false}
        editable={false}
        value={props.oldValue}
      />
    </View>
  </View>
);

const PriceItem = (props) => (
  <View style={styles.container}>
    <Text style={styles.header}>{props.item.name}</Text>
    {props.item.value && <TextField>{props.item.value.value}</TextField>}
  </View>
);

const SchemaInfo = (props) => {
  return (
    <View style={styles.container}>
      <Text>
        {props.item.name} {props.item.value}
      </Text>
    </View>
  );
};

const ImageItem = (props) => {
  const divider = useThemeColor({}, "divider");
  const secondary = useThemeColor({}, "secondary");
  const red = useThemeColor({}, "red");

  const getURLExtension = (url) => {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>
          {props.item.name}{" "}
          <Text style={[styles.header, { color: Colors.default.green }]}>
            (changes)
          </Text>
        </Text>
        <NavButton
          style={{ fontSize: 16 }}
          text="Revert"
          lightColor={Colors.default.red}
          darkColor={Colors.default.red}
          onPress={() => createTwoButtonAlert(props.revertChange)}
        />
      </View>
      {props.newValue &&
        (getURLExtension(props.newValue.uri) === "svg" ? (
          <SvgUri
            style={[
              styles.image,
              { marginBottom: 8, borderColor: Colors.default.green },
            ]}
            uri={props.newValue.uri}
          />
        ) : (
          <Image
            style={[
              styles.image,
              { marginBottom: 8, borderColor: Colors.default.green },
            ]}
            source={{
              uri: props.newValue.uri,
            }}
          />
        ))}
      {props.oldValue &&
        props.oldValue.url &&
        (getURLExtension(props.oldValue.url) === "svg" ? (
          <SvgUri
            style={[styles.image, { borderColor: Colors.default.red }]}
            uri={props.oldValue.url}
          />
        ) : (
          <Image
            style={[styles.image, { borderColor: Colors.default.red }]}
            source={{
              uri: props.oldValue.url,
            }}
          />
        ))}
    </View>
  );
};

const SwitchItem = (props) => {
  const secondary = useThemeColor({}, "secondary");
  const container = useThemeColor(
    { light: Colors.light.container, dark: Colors.dark.highlight },
    "highlight"
  );
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>
          {props.item.name}{" "}
          <Text style={[styles.header, { color: Colors.default.green }]}>
            (changes)
          </Text>
        </Text>
        <NavButton
          style={{ fontSize: 16 }}
          text="Revert"
          lightColor={Colors.default.red}
          darkColor={Colors.default.red}
          onPress={() => createTwoButtonAlert(props.revertChange)}
        />
      </View>
      <Container style={styles.switchContainer}>
        <Switch
          trackColor={{ false: container, true: Colors.default.green }}
          thumbColor={"white"}
          ios_backgroundColor={{ false: secondary, true: Colors.default.green }}
          value={props.oldValue}
          disabled
        />
        <Text style={{ marginHorizontal: 16 }}>to</Text>
        <Switch
          trackColor={{ false: container, true: Colors.default.green }}
          thumbColor={"white"}
          ios_backgroundColor={{ false: secondary, true: Colors.default.green }}
          value={props.newValue}
          disabled
        />
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    marginVertical: 12,
  },
  indicator: {
    width: 8,
    height: 8,
    backgroundColor: Colors.default.green,
    borderRadius: 8,
    marginRight: 12,
  },
  header: { fontWeight: "600" },
  slimTextfield: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 8,
    color: "black",
  },
  switchItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 12,
    borderRadius: 8,
  },
  image: {
    flex: 1,
    height: 264,
    borderRadius: 6,
    borderWidth: 2,
    overflow: "hidden",
    maxWidth: "100%",
  },
  switchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ChangeItem;
