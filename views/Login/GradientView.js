import React from "react";
import { LinearGradient } from "expo-linear-gradient";

// Components
import { View, StyleSheet } from "react-native";

class GradientView extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <LinearGradient
        style={styles.container}
        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
        colors={[this.props.colorTop, this.props.colorBottom]}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default GradientView;
