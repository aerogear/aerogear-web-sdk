import React, { Component } from "react";
import { View, Text, StatusBar } from "react-native";
import { NavDrawerButton } from "../common";
import { Colors } from "../../assets";
// import { ConfigService } from "@aerogearservices/core";
// import mobileServicesJson from "../mobile-services.json";

class HttpScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: "Http",
    headerStyle: {
      backgroundColor: Colors.primary
    },
    headerTintColor: Colors.white,
    headerLeft: <NavDrawerButton onPress={() => navigation.navigate("DrawerOpen")} />
  });

  render() {
    // const config = new ConfigService(mobileServicesJson);
    // const keycloakConfig = config.getKeycloakConfig();

    return (
      <View style={styles.containerStyle}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />
        <View>
          <Text style={styles.welcomeStyle}>
            HTTP
          </Text>
          <Text style={styles.smallStyle}>
            {/* keycloakConfig = {JSON.stringify(keycloakConfig)} */}
            {/* keycloakConfig */}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcomeStyle: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  smallStyle: {
    fontSize: 12
  }
};

export { HttpScreen };
