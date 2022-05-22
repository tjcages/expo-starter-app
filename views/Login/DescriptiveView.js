import React from "react";

// Components
import { View, StyleSheet, FlatList } from "react-native";
import { Layout, Font, Color } from "../../constants";

// Views
import DescriptiveItem from "./DescriptiveItem";

class DescriptiveView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.easeOutCubic = this.easeOutCubic.bind(this);
  }

  easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  render() {
    const percentage = this.props.contentOffset / this.props.windowHeight;
    const easing = percentage - 0.5;

    var opacities = [0.2, 0.2, 0.2, 0.2];
    const endPercentages = [0, 0.5, 1, 1.5];
    const animateIn = 0.4;
    const animateOut = 0.4;

    if (percentage > 0.2) {
      opacities.forEach((opacity, index) => {
        if (
          easing > endPercentages[index] &&
          easing < endPercentages[index] + animateIn
        ) {
          opacities[index] = (easing - endPercentages[index]) / animateIn + 0.2;
        } else if (
          easing > endPercentages[index] + animateIn &&
          easing < endPercentages[index] + animateIn + animateOut
        ) {
          const diff =
            (easing - (endPercentages[index] + animateIn)) / animateOut;
          opacities[index] = 1 - diff * 0.8;
        }
      });
    }

    return (
      <View
        style={[
          styles.container,
          {
            // height: this.props.windowHeight,
          },
        ]}
      >
        <DescriptiveItem
          title={"Don't miss out"}
          description={
            "An awesome and super informative description would go here!"
          }
          opacity={opacities[0]}
          colorTop={this.props.colorTop}
          colorBottom={this.props.colorBottom}
        />
        <DescriptiveItem
          title={"Contribute to innovation ✨"}
          description={
            "An awesome and super informative description would go here!"
          }
          opacity={opacities[1]}
          top
          colorTop={this.props.colorTop}
          colorBottom={this.props.colorBottom}
        />
        <DescriptiveItem
          title={"See what's happening 👀"}
          description={
            "An awesome and super informative description would go here!"
          }
          opacity={opacities[2]}
          colorTop={this.props.colorTop}
          colorBottom={this.props.colorBottom}
        />
        <DescriptiveItem
          title={"Be a part of it on Launch Pad 🚀"}
          description={
            "An awesome and super informative description would go here!"
          }
          opacity={opacities[3]}
          top
          colorTop={this.props.colorTop}
          colorBottom={this.props.colorBottom}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Layout.default.xLarge,
    paddingHorizontal: Layout.default.large,
    justifyContent: "center",
  },
  translucentContainer: {
    width: 300,
    height: 300,
    backgroundColor: 'white',
    opacity: 0.3
  },
  blur: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    fontSize: 36,
    fontWeight: Font.weight.bold,
    marginVertical: Layout.default.xLarge,
  },
});

export default DescriptiveView;
