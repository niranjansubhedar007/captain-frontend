import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import changeNavigationBarColor, {
  hideNavigationBar,
} from "react-native-navigation-bar-color";
import axios from "axios";

export default function index() {
  const [user, setUser] = useState("");
  const router = useRouter();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "132912499965-c35skblb4b29pmavi4d7qge79i2tlrbj.apps.googleusercontent.com",
      scopes: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    hideNavigationBar();
    changeNavigationBarColor("#000000", true);

    return () => {
      changeNavigationBarColor("black", false);
    };
  }, []);

  const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem("@token", token);
    } catch (error) {
      console.error("Error storing the token:", error);
    }
  };

  const fetchUserRole = async (email) => {
    try {
      const response = await axios.get(
        "https://sheets.googleapis.com/v4/spreadsheets/1RTxX9Q26Ubkg30fw06YYFl6w7jNlwTuZlfJUK1JC7-w/values/Login?key=AIzaSyBEOhRj7deOg0MsKjGj38oF4dqtr9ZpWtw"
      );
      const data = response.data.values;

      // Extract the header row
      const [headers, ...rows] = data;

      // Find the row that matches the authenticated email
      const userRow = rows.find((row) => row[0] === email);
      if (userRow) {
        const role = userRow[1];
        return role;
      }

      return null; // Return null if no match found
    } catch (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
  };

  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      const tokens = await GoogleSignin.getTokens();
      const accessToken = tokens.accessToken;
      const userInfo = await GoogleSignin.getCurrentUser();

      if (accessToken) {
        await storeToken(accessToken);
      }

      if (userInfo) {
        const email = userInfo.user.email; // Get authenticated user's email
        console.log("Authenticated email:", email);

        const role = await fetchUserRole(email);

        if (role) {
          if (role === "admin") {
            console.log("Role: Admin");
            Alert.alert("Role", "Welcome Admin!");
            router.push("/captainBill"); // Navigate to admin page
          } else if (role === "captain") {
            console.log("Role: Captain");
            Alert.alert("Role", "Welcome Captain!");
            router.push("/bill"); // Navigate to bill page
          } else {
            console.log("Unknown role:", role);
          }
        } else {
          console.error("No role found for the email:", email);
        }
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Sign in to continue to your dashboard</Text>
      <TouchableOpacity
        style={styles.googleButton}
        onPress={onGoogleButtonPress}
      >
        <Image
          source={{
            uri: "https://cdn-teams-slug.flaticon.com/google.jpg",
          }}
          style={styles.googleLogo}
        />
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleLogo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "darkblue",
    fontWeight: "600",
  },
});
