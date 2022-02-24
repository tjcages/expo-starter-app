import React, { useState } from "react";
import { StyleSheet, Switch, Image, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import Colors from "../constants/Colors";
import {
  useThemeColor,
  Header,
  View,
  Container,
  Text,
  TextField,
  Button,
} from "../components";
import { SvgUri } from "react-native-svg";

const SchemaItem = (props) => {
  const [value, setValue] = useState(props.item.value);

  const renderItem = (item) => {
    switch (item.type) {
      case "Bool":
        return <SwitchItem {...props} value={value} setValue={setValue} />;
      case "ImageRef":
        return <ImageItem {...props} value={value} setValue={setValue} />;
      case "PlainText":
      case "RichText":
        return <TextItem {...props} value={value} setValue={setValue} />;
      case "Info":
        return <SchemaInfo {...props} />;
      case "CommercePrice":
        return <PriceItem {...props} />;
      case "Date":
        return <DateItem {...props} value={value} setValue={setValue} />;
      case "Link":
        return <LinkItem {...props} value={value} setValue={setValue} />;
      case "Option":
        return <OptionItem {...props} value={value} setValue={setValue} />;
      default:
        return <ComingSoon {...props} value={value} setValue={setValue} />;
    }
  };

  return renderItem(props.item);
};

const TextItem = (props) => (
  <View style={styles.container}>
    <Text style={styles.header}>{props.item.name}</Text>
    <TextField
      multiline
      value={props.value}
      onChangeText={(text) => {
        props.setValue(text);
        props.updateItemValue(props.selectedItem, props.item.slug, text);
      }}
    ></TextField>
  </View>
);

const DateItem = (props) => {
  const date = new Date(props.value);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const dateString = isValidDate(date)
    ? date.toLocaleDateString(undefined, options)
    : props.value;

  function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{props.item.name}</Text>
      <TextField
        icon={"calendar"}
        multiline
        value={dateString}
        onEndEditing={() => {
          let newDate = new Date(props.value);
          if (isValidDate(newDate)) newDate.toISOString();
          props.setValue(newDate);
          props.updateItemValue(props.selectedItem, props.item.slug, newDate);
        }}
        onChangeText={(text) => {
          props.setValue(text);
          props.updateItemValue(props.selectedItem, props.item.slug, text);
        }}
      ></TextField>
    </View>
  );
};

const LinkItem = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{props.item.name}</Text>
      <TextField
        icon={"link"}
        multiline
        value={props.value}
        onChangeText={(text) => {
          props.setValue(text);
          props.updateItemValue(props.selectedItem, props.item.slug, text);
        }}
      ></TextField>
    </View>
  );
};

const OptionItem = (props) => {
  const color = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");
  const backgroundColor = useThemeColor(
    { light: Colors.light.container, dark: Colors.dark.highlight },
    "highlight"
  );
  const highlight = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.container },
    "highlight"
  );

  var items = [];
  if (
    props.item.validations &&
    props.item.validations.options &&
    props.item.validations.options.length > 0
  )
    items = props.item.validations.options;
  const selectedOption = items.find((option) => option.id === props.value);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{props.item.name}</Text>
      <TouchableOpacity
        onPress={() =>
          props.navigation.push("Options", {
            data: items,
            title: props.item.name,
            onSelected: (id) => {
              props.setValue(id);
              props.updateItemValue(props.selectedItem, props.item.slug, id);
            },
          })
        }
      >
        <Container style={[styles.option, { backgroundColor }]}>
          <Container
            style={[styles.optionSelected, { backgroundColor: highlight }]}
          >
            <Text style={[styles.optionText, { color }]}>
              {selectedOption.name}
            </Text>
          </Container>
          <Icon
            name="chevron-right"
            type="feather"
            size={20}
            color={secondary}
          />
        </Container>
      </TouchableOpacity>
    </View>
  );
};

const ComingSoon = (props) => {
  // REFS TO DO
  const secondary = useThemeColor({}, "secondary");
  const backgroundColor = useThemeColor(
    { light: Colors.light.container, dark: Colors.dark.highlight },
    "highlight"
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{props.item.name}</Text>
      <Container style={[styles.comingSoon, { backgroundColor }]}>
        <Text style={[styles.optionText, { color: secondary }]}>
          Coming soon!
        </Text>
      </Container>
    </View>
  );
};

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
  const [image, setImage] = useState(null);

  const divider = useThemeColor({}, "divider");
  const secondary = useThemeColor({}, "secondary");
  const red = useThemeColor({}, "red");

  const getURLExtension = (url) => {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);

      const imageObj = {
        status: "upload",
        uri: result.uri,
      };
      props.setValue(imageObj);
      props.updateItemValue(props.selectedItem, props.item.slug, imageObj);
    }
  };

  return props.value ? (
    <View style={styles.container}>
      <Text style={styles.header}>{props.item.name}</Text>
      {getURLExtension(
        props.value !== null && props.value.url !== undefined
          ? props.value.url
          : props.value.uri
      ) === "svg" ? (
        <SvgUri
          style={styles.image}
          uri={
            props.value !== null && props.value.url !== undefined
              ? props.value.url
              : props.value.uri
          }
        />
      ) : (
        <Image
          style={styles.image}
          source={{
            uri: image
              ? image
              : props.value !== null && props.value.url !== undefined
              ? props.value.url
              : props.value.uri
          }}
        />
      )}
      <View style={styles.imageActions}>
        <Button
          style={{ marginRight: 4, borderWidth: 1, borderColor: divider }}
          lightColor={Colors.light.container}
          darkColor={Colors.dark.highlight}
          icon={
            <Icon
              style={{ marginRight: 8 }}
              name="refresh-cw"
              type="feather"
              size={20}
              color={secondary}
            />
          }
          text="Replace"
          textStyle="secondary"
          flex
          onPress={pickImage}
        />
        <Button
          style={{ marginLeft: 4, borderWidth: 1, borderColor: divider }}
          lightColor={Colors.light.container}
          darkColor={Colors.dark.highlight}
          icon={
            <Icon
              style={{ marginRight: 8 }}
              name="trash"
              type="feather"
              size={20}
              color={red}
            />
          }
          text="Delete"
          textColor={red}
          flex
          onPress={() => {
            props.setValue(null);
            props.updateItemValue(props.selectedItem, props.item.slug, null);
          }}
        />
      </View>
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.header}>{props.item.name}</Text>
      <TouchableOpacity onPress={pickImage}>
        <Container style={styles.emptyImage}>
          <Icon
            style={{ marginBottom: 12 }}
            name="image"
            type="feather"
            size={36}
            color={secondary}
          />
          <Text style={{ fontWeight: "600" }}>Add an image</Text>
        </Container>
      </TouchableOpacity>
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
      <View
        style={{
          flexDirection: "column",
          flex: 1,
          backgroundColor: "transparent",
        }}
      >
        <Text style={styles.header}>{props.item.name}</Text>
        {props.item.description && (
          <Text style={{ marginTop: 8, flex: 1, flexWrap: "wrap" }}>
            {props.item.description}
          </Text>
        )}
      </View>
      <Switch
        trackColor={{ false: container, true: Colors.default.green }}
        thumbColor={"white"}
        ios_backgroundColor={{ false: secondary, true: Colors.default.green }}
        value={props.value}
        onChange={() => {
          props.setValue(!props.value);
          props.updateItemValue(
            props.selectedItem,
            props.item.slug,
            !props.value
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    marginHorizontal: 16,
    marginBottom: 24,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    backgroundColor: Colors.default.green,
    borderRadius: 8,
    marginRight: 12,
  },
  header: { fontWeight: "600", marginBottom: 12 },
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
  },
  imageActions: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 12,
  },
  emptyImage: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    borderRadius: 6,
  },
  option: {
    position: "relative",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 6,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 12,
  },
  optionSelected: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  optionText: {
    fontSize: 18,
  },
  comingSoon: {
    flex: 1,
    borderRadius: 6,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
});

export default SchemaItem;
