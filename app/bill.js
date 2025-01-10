import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
  StyleSheet,
  ScrollView,
  Platform 
} from "react-native";
import axios from "axios";
import { useRouter, useSearchParams } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import AsyncStorage from "@react-native-async-storage/async-storage";
// import MergeTablesModal from "./merge";
// import SplitTablesModal from "./split";
// import UnSplitTablesModal from "./unSplit";
// import ShiftTableModal from "./shift";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const Bill = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [tables, setTables] = useState([]);
  const [sections, setSections] = useState([]);
  const [bills, setBills] = useState({});
  const [displayedTables, setDisplayedTables] = useState([]);
  const [defaultSectionId, setDefaultSectionId] = useState(null);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [isUnSplitModalOpen, setIsUnSplitModalOpen] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [captain, setCaptain] = useState("");
  const [selectedTable, setSelectedTable] = useState(null);

  const router = useRouter();

  
  // const handleSectionRadioChange = async (sectionId, sectionName) => {
  //   // Check if the same section is tapped again to toggle it off
  //   if (selectedSection === sectionId) {
  //     await AsyncStorage.removeItem("selectedSection");  // Deselect and remove from AsyncStorage
  //     setSelectedSection(null);
  //   } else {
  //     await AsyncStorage.setItem("selectedSection", sectionId); // Set and store in AsyncStorage
  //     console.log(sectionId);
  //     setSelectedSection(sectionId);
  //   }
  // };
  const handleSectionRadioChange = async (sectionId) => {
    // Only change the section if the selected section is different
    if (selectedSection !== sectionId) {
      await AsyncStorage.setItem("selectedSection", sectionId); // Save to AsyncStorage
      setSelectedSection(sectionId); // Update the state
    }
  };

  // Function to load sectionId from AsyncStorage
  const loadSelectedSection = async () => {
    try {
      const storedSectionId = await AsyncStorage.getItem("selectedSection");
      if (storedSectionId) {
        setSelectedSection(storedSectionId);
      }
    } catch (error) {
      console.error("Error loading sectionId from AsyncStorage:", error);
    }
  };

  // Load the selectedSection value when the component mounts
  useEffect(() => {
    loadSelectedSection();
  }, []);

  useEffect(() => {
      const fetchUsername = async () => {
        try {
          const storedUsername = await AsyncStorage.getItem("waiterName");
          if (storedUsername) {
            setCaptain(storedUsername);
          }
        } catch (error) {
          console.error("Error fetching username from AsyncStorage:", error);
        }
      };

      fetchUsername();
    
  }, []);

  useEffect(() => {
      const fetchData = async () => {
        try {
          const sectionsResponse = await axios.get(
            `http://192.168.0.109:5000/api/section`
          );
          setSections(sectionsResponse.data);

          const tablesResponse = await axios.get(
            `http://192.168.0.109:5000/api/table/tables`
          );
          setTables(tablesResponse.data);

          const defaultSection = sectionsResponse.data.find(
            (section) => section.isDefault
          );
          console.log(defaultSection._id);
          if (defaultSection) {
            setDefaultSectionId(defaultSection._id);
            // setSelectedSection(defaultSection._id);
          }
          const billsData = await Promise.all(
            tablesResponse.data.map(async (table) => {
              const billsResponse = await axios.get(
                `http://192.168.0.109:5000/api/order/order/${table._id}`
              );
              const temporaryBills = billsResponse.data.filter(
                (bill) => bill.isTemporary
              );
              const latestBill =
                temporaryBills.length > 0 ? temporaryBills[0] : null;
              return { [table._id]: latestBill };
            })
          );

          const mergedBills = Object.assign({}, ...billsData);
          setBills(mergedBills);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    
  }, []);

  useEffect(() => {
      const updateDisplayedTables = () => {
        if (selectedSection) {
          const filteredTables = tables.filter(
            (table) => table.section._id === selectedSection
          );
          setDisplayedTables(filteredTables);
        } else if (defaultSectionId) {
          const defaultTables = tables.filter(
            (table) => table.section._id === defaultSectionId
          );
          setDisplayedTables(defaultTables);
        } else {
          setDisplayedTables([]);
        }
      };

      updateDisplayedTables();
    
  }, [selectedSection, defaultSectionId, tables]);

  useEffect(() => {
      const interval = setInterval(async () => {
        try {
          // Fetch tables for the currently displayed section
          const tablesResponse = await axios.get(
            `http://192.168.0.109:5000/api/table/tables`
          );
          setTables(tablesResponse.data);

          const billsData = await Promise.all(
            tablesResponse.data.map(async (table) => {
              const billsResponse = await axios.get(
                `http://192.168.0.109:5000/api/order/order/${table._id}`
              );
              const temporaryBills = billsResponse.data.filter(
                (bill) => bill.isTemporary
              );
              const latestBill =
                temporaryBills.length > 0 ? temporaryBills[0] : null;
              return { [table._id]: latestBill };
            })
          );

          // Merge bills and update state
          const mergedBills = Object.assign({}, ...billsData);
          setBills(mergedBills);

          // Update displayed tables based on the selected section or default section
          if (selectedSection) {
            const filteredTables = tablesResponse.data.filter(
              (table) => table.section._id === selectedSection
            );
            setDisplayedTables(filteredTables);
          } else if (defaultSectionId) {
            const defaultTables = tablesResponse.data.filter(
              (table) => table.section._id === defaultSectionId
            );
            setDisplayedTables(defaultTables);
          } else {
            setDisplayedTables([]);
          }
        } catch (error) {
          console.error("Error refreshing data:", error);
        }
      }, 2000); // Refresh every 5 seconds

      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    
  }, [selectedSection, defaultSectionId]);

  const handleTableClick = (table) => {
    setSelectedTable(table); // Set the selected table on tap
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("@token");
    await AsyncStorage.removeItem("userName");
    await AsyncStorage.removeItem("role");
    await AsyncStorage.removeItem("waiter");
    await AsyncStorage.removeItem("admin");
    await AsyncStorage.removeItem("captain");
        await GoogleSignin.signOut(); // Clear Google Sign-In session
    
    router.push("/"); // Navigate to home on confirmation
  };


  const handleHome = async () => {
    router.push("/"); // Navigate to home on confirmation
  };
  return (
    <>
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View
          style={{
            // flexDirection: "row",
            // justifyContent: "flex-end",

            alignItems: "flex-end", // Align items to the right side
          }}
        >
          <TouchableOpacity
            onPress={handleHome} // Define a function to handle Home button press
            style={{
              borderRadius: 30,
              padding: 10,
            }}
          >
            <FontAwesome name="home" size={25} color="gray" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            // flexDirection: "row",
            // justifyContent: "flex-end",

            alignItems: "flex-end", // Align items to the right side
          }}
        >
          <TouchableOpacity
            onPress={handleLogout} // Define a function to handle Home button press
            style={{
              borderRadius: 30,
              padding: 10,
            }}
          >
            <FontAwesome name="sign-out" size={25} color="red" />
          </TouchableOpacity>
        </View>
      </View>
      <View >
      <FlatList
        data={sections}
        numColumns={3}
        keyExtractor={(item) => item._id}
        renderItem={({ item: section }) => (
          <TouchableOpacity
            style={[
              styles.sectionItem,
              selectedSection === section._id
                ? styles.selectedSection
                : styles.defaultSection,
            ]}
            onPress={() => handleSectionRadioChange(section._id)}
          >
            <Text style={styles.sectionText}>{section.name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.sectionList}
      />
      </View>
      <View style={{ flex: 1}}>
        <Text style={styles.label}>TABLE LIST</Text>

        <FlatList
          data={displayedTables}
          numColumns={3}
          keyExtractor={(item) => item._id}
          renderItem={({ item: table }) => {
            const isAssignedToCurrentWaiter =
              !bills[table._id]?.waiterName ||
              bills[table._id]?.waiterName === captain;
            const isSelected = selectedTable?._id === table._id; // Check if the table is selected
            const tableStyle = [
              styles.tableItem,
              bills[table._id]?.isTemporary
                ? bills[table._id]?.isPrint === 1
                  ? styles.tableBorderBlue
                  : isAssignedToCurrentWaiter
                  ? styles.tableBorderOrange
                  : styles.tableRestricted
                : styles.tableBorderGray,
              isSelected ? styles.selectedBorder : null, // Apply special border if selected
            ];
          

            return (
              <TouchableOpacity
                style={[styles.tableItem, tableStyle]}
                onPress={() => handleTableClick(table)}
                disabled={!isAssignedToCurrentWaiter}
              >
                {/* Display static table image */}
                {/* <Text style={styles.tableText}> Captain : {bills[table._id]?.waiterName}</Text> */}
              

                {/* Display table name */}
                <Text style={styles.tableText}>{table.tableName}</Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.tableList}
          style={styles.scrollableTableList} // Apply fixed height for scrolling
          showsVerticalScrollIndicator={true} // Show scroll indicator
        />

        <TouchableOpacity
        style={styles.continueButton}
        onPress={() => {
          if (selectedTable) {
            // Check if the table is in payment mode (blue)
            if (bills[selectedTable._id]?.isTemporary && bills[selectedTable._id]?.isPrint === 1) {
              alert("This table is in payment mode.");
            } else {
              router.push(`/order/${selectedTable._id}`);
            }
          } else {
            alert("Please select a table first."); // Optional alert for better UX
          }
        }}
      >
        <Text style={styles.continueButtonText}>SELECT AND CONTINUE</Text>
        </TouchableOpacity>
      </View>
      
    </View>
    </>
  );
};


const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    paddingVertical: Platform.OS === "android" ? 12 : 10, 
    textAlign: "center",
    paddingHorizontal: 24,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: "black",
    elevation: 5, // Increased elevation for Android
  },

  activeButton: {
    color: "#4CAF50",
  },

  inactiveButton: {
    color: "#333",
  },

  activeText: {
    color: "black",
    borderColor: "gray",
    borderWidth: 1,
    borderBottomWidth: 3,
  },

  inactiveText: {
    color: "gray",
  },

  scrollableTableList: {
    maxHeight: 480,
  },

  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    marginLeft:10
  },

  noTablesText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },

  sectionList: {
    paddingVertical: 10,
    marginBottom: 20,
    justifyContent: "center",
  },

  sectionItem: {
    flex: 1,
    margin: 6,
    height: 50,
    backgroundColor: "#D3D3D3",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "30%",
    elevation: 2, // Small shadow effect for Android
  },

  selectedSection: {
    backgroundColor: "gray",
    borderWidth: 1,
    borderColor: "gray",
  },

  sectionText: {
    fontWeight: "bold",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    elevation: 4, // Shadow for Android
  },

  closeButtonText: {
    color: "#fff",
    fontSize: 18,
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    height: "100%",
  },

  continueButton: {
    backgroundColor: "lightgray",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "70%",
    alignSelf: "center",
    position: "absolute",
    bottom: 5,
    right: "16%",
    borderWidth: 1,
    elevation: 5, // More noticeable button shadow
  },

  continueButtonText: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
  },

  selectedBorder: {
    borderWidth: 4,
    borderColor: "black",
  },

  tableItem: {
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    borderRadius: 50,
    aspectRatio: 1,
    marginLeft: Platform.OS === "android" ? 12 : 26, 
    elevation: 3, // Slight shadow for Android
  },

  tableText: {
    fontSize: 25,
    fontWeight: "600",
    color: "black",
  },

  tableBorderBlue: {
    backgroundColor: "gray",
  },

  tableBorderOrange: {
    backgroundColor: "lightgray",
  },

  tableBorderGray: {
    borderWidth: 3,
    borderColor: "#ccc",
    backgroundColor: "#f7f7f7",
  },

  tableSelected: {
    borderWidth: 3,
    borderColor: "green",
    backgroundColor: "lightgray",
  },
});



export default Bill;


