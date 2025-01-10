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
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { useRouter, useSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import PaymentModal from "./payment";
import FontAwesome from "react-native-vector-icons/FontAwesome";
const CaptainBill = () => {
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
  const [isImprogressOpen, setIsImprogressOpen] = useState(false);
  const [isAllOpen, setIsAllOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(true);
  const [captain, setCaptain] = useState("");
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableInfo, setTableInfo] = useState({ tableName: "", totalAmount: 0 });
  const [orderID, setOrderID] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [CGSTNumber, setCGSTNumber] = useState(null);
  const [cgst, setCGST] = useState(0);
  const [sgst, setSGST] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [items, setItems] = useState([]);
  const [waiterName, setWaiterName] = useState([]);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handlePaymentModalClose = () => {
    console.log("Closing Payment Modal");
    setIsPaymentModalOpen(false); // Close modal
    setSelectedTable(null); // Reset selected table
    setTableInfo({ tableName: "", totalAmount: 0 }); // Reset table info
    setOrderID(null); // Reset order ID
  };

  const handleBillClick = (table) => {
    setSelectedTable(table);
    setTableInfo({
      tableName: table.tableName,
      totalAmount: bills[table._id]?.grandTotal || 0,
    });

    setOrderID(bills[table._id]?._id);
    setOrderNumber(bills[table._id]?.orderNumber);
    setCGST(bills[table._id]?.CGST || 0); // Pass CGST dynamically
    setSGST(bills[table._id]?.SGST || 0); // Pass SGST dynamically
    setGrandTotal(bills[table._id]?.grandTotal || 0); // Pass grandTotal dynamically

    setItems(bills[table._id]?.items || []); // Set the items dynamically
    setWaiterName(bills[table._id]?.waiterName || []); // Set the items dynamically
    setIsPaymentModalOpen(true); // Open the payment modal
  };

  const router = useRouter();
  // const handleSectionRadioChange = async (sectionId, sectionName) => {
  //   // Check if the same section is tapped again to toggle it off
  //   if (selectedSection === sectionId) {
  //     await AsyncStorage.removeItem("selectedSection"); // Deselect and remove from AsyncStorage
  //     setSelectedSection(null);
  //     setDisplayedTables([]); // Clear displayed tables when deselecting the section
  //   } else {
  //     await AsyncStorage.setItem("selectedSection", sectionId); // Set and store in AsyncStorage
  //     setSelectedSection(sectionId);
  //     setDisplayedTables([]); // Clear tables when switching sections
  //   }
  // };
  // Handle Table Click

  const handleTableClick = (table) => {
    setSelectedTable(table); // Set the selected table
    setTableInfo({
      tableName: table.tableName,
      totalAmount: bills[table._id]?.grandTotal || 0,
    });
  };
  const handleSectionRadioChange = async (sectionId) => {
    // Only change the section if the selected section is different
    if (selectedSection !== sectionId) {
      await AsyncStorage.setItem("selectedSection", sectionId); // Save to AsyncStorage
      setSelectedSection(sectionId); // Update the state
    }
  };

  const toggleBilling = () => {
    setIsBillingOpen(!isBillingOpen);
    setIsImprogressOpen(false);
    setIsAllOpen(false);
  };

  const toggleImprogress = () => {
    setIsImprogressOpen(!isImprogressOpen);
    setIsBillingOpen(false);
    setIsAllOpen(false);
  };

  const toggleAll = () => {
    setIsAllOpen(!isAllOpen);
    setIsBillingOpen(false);
    setIsImprogressOpen(false);
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
      }, 2000); // Refresh every 2 seconds

      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    
  }, [selectedSection, defaultSectionId]);

  useEffect(() => {
      const fetchData = async () => {
        try {
          const tablesResponse = await axios.get(
            `http://192.168.0.109:5000/api/table/tables`
          );
          const sectionsResponse = await axios.get(
            `http://192.168.0.109:5000/api/section`
          );
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
    const fetch=async()=>{
      const token=await AsyncStorage.getItem("@token")
      console.log(token)
    }
    fetch()
  }, [])
  
  const handleLogout = async () => {
      await AsyncStorage.removeItem("@token");

    await AsyncStorage.removeItem("authToken");

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
      <View style={styles.containers}>
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
        <View style={styles.container}>
          {/* Billing Button */}
          <TouchableOpacity onPress={toggleBilling}>
            <Text
              style={[
                styles.label,
                isBillingOpen ? styles.activeText : styles.inactiveText,
              ]}
            >
              Billing
            </Text>
          </TouchableOpacity>

          {/* Improgress Button */}
          <TouchableOpacity onPress={toggleImprogress}>
            <Text
              style={[
                styles.label,
                isImprogressOpen ? styles.activeText : styles.inactiveText,
              ]}
            >
              Improgress
            </Text>
          </TouchableOpacity>

          {/* All Button */}
          <TouchableOpacity onPress={toggleAll}>
            <Text
              style={[
                styles.label,
                isAllOpen ? styles.activeText : styles.inactiveText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
        </View>

        {isBillingOpen && (
          <>
            <View>
              <Text style={styles.label}>Billing Table List</Text>

              {/* Section List */}
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

              {/* Table List */}
              {displayedTables.filter(
                (table) => bills[table._id]?.isPrint === 1
              ).length === 0 ? (
                // Show message when no tables found
                <Text style={styles.noTablesText}>No tables found.</Text>
              ) : (
                <FlatList
                  data={displayedTables.filter(
                    (table) => bills[table._id]?.isPrint === 1 // Filter tables with isPrint === 1
                  )}
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
                        <Text style={styles.tableText}>{table.tableName}</Text>
                        </TouchableOpacity>
                      );
                    }}
                    
                  contentContainerStyle={styles.tableList}
                  style={styles.scrollableTableList} // Apply fixed height for scrolling
                  showsVerticalScrollIndicator={true} // Show scroll indicator
                />
              )}
            </View>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => handleBillClick(selectedTable)}
            >
              <Text style={styles.continueButtonText}>SELECT AND CONTINUE</Text>
            </TouchableOpacity>
          </>
        )}

        {isAllOpen && (
          <>
            <View>
              <Text style={styles.label}>All Table List</Text>

              {/* Section List */}
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

              {/* Table List */}
              {displayedTables.length === 0 ? (
                // Show message when no tables found
                <Text style={styles.noTablesText}>No tables found.</Text>
              ) : (
                <FlatList
                  data={displayedTables}
                  numColumns={3}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item: table }) => {
                    const isAssignedToCurrentWaiter =
                      !bills[table._id]?.waiterName ||
                      bills[table._id]?.waiterName === captain;
                    const isSelected = selectedTable?._id === table._id;

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
                        <Text style={styles.tableText}>{table.tableName}</Text>
                      </TouchableOpacity>
                    );
                  }}
                  contentContainerStyle={styles.tableList}
                  style={styles.scrollableTableList}
                  showsVerticalScrollIndicator={true}
                />
              )}
            </View>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => {
                if (selectedTable) {
                  router.push(`/adminOrder/${selectedTable._id}`);
                } else {
                  alert("Please select a table first.");
                }
              }}
            >
              <Text style={styles.continueButtonText}>SELECT AND CONTINUE</Text>
            </TouchableOpacity>
          </>
        )}

        {isImprogressOpen && (
          <>
            <View>
              <Text style={styles.label}>Inprogress Table List</Text>

              {/* Section List */}
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

              {/* Table List */}
              {displayedTables.filter(
                (table) => bills[table._id]?.isPrint === 0
              ).length === 0 ? (
                // Show message when no tables found
                <Text style={styles.noTablesText}>No tables found.</Text>
              ) : (
                <FlatList
                  data={displayedTables.filter(
                    (table) => bills[table._id]?.isPrint === 0
                  )}
                  numColumns={3}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item: table }) => {
                    const isAssignedToCurrentWaiter =
                      !bills[table._id]?.waiterName ||
                      bills[table._id]?.waiterName === captain;
                    const isSelected = selectedTable?._id === table._id;

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
                        <Text style={styles.tableText}>{table.tableName}</Text>
                      </TouchableOpacity>
                    );
                  }}
                  contentContainerStyle={styles.tableList}
                  style={styles.scrollableTableList}
                  showsVerticalScrollIndicator={true}
                />
              )}
            </View>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => {
                if (selectedTable) {
                  router.push(`/adminOrder/${selectedTable._id}`);
                } else {
                  alert("Please select a table first.");
                }
              }}
            >
              <Text style={styles.continueButtonText}>SELECT AND CONTINUE</Text>
            </TouchableOpacity>
          </>
        )}

        

        {isPaymentModalOpen && (
          <PaymentModal
            onClose={handlePaymentModalClose}
            selectedTableId={selectedTable?._id} // Pass selected table ID
            tableName={tableInfo.tableName} // Pass table name
            totalAmount={tableInfo.totalAmount} // Pass total amount
            orderID={orderID} // Pass order ID
            orderNumber={orderNumber} // Pass order number
            items={items} // Pass items
            cgst={cgst}
            sgst={sgst}
            waiterName={waiterName}
            grandTotal={grandTotal}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  containers: {
    flex: 1,
    backgroundColor: "#f7f7f7",
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
  },

  continueButtonText: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
  },

  tableSelected: {
    borderColor: "green",
    borderWidth: 1,
    backgroundColor: "lightgray",
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f7f7f7", // Optional background for the container
    width: "100%",
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    paddingVertical: Platform.OS === "android" ? 12 : 10, 
    textAlign: "center",
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: "black",
    elevation: 3, // Elevation for a subtle shadow effect
  },

  activeButton: {
    color: "#4CAF50", // White text color for active state
  },

  inactiveButton: {
    color: "#333", // Gray text for inactive state
  },

  activeText: {
    color: "gray", // White text for active button
    borderColor: "gray", // Green border color for inactive button
    borderWidth: 1, // Add a border for inactive button
    borderBottomWidth: 3, // Remove bottom border for inactive button
    borderTopWidth: 0, // Remove bottom border for inactive button
    borderLeftWidth: 0, // Remove bottom border for inactive button
    borderRightWidth: 0, // Remove bottom border for inactive button
    color: "black", // Black color for active text
  },

  inactiveText: {
    color: "gray", // Green color for inactive text
  },

  scrollableTableList: {
    maxHeight: 380, // Adjust height as needed to show 5 rows
  },

  label: {
    fontSize: 18,
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
    justifyContent: "center", // Centers the grid
  },

  sectionItem: {
    flex: 1,
    margin: 5,
    height: 50, // Ensure a consistent height
    backgroundColor: "#D3D3D3",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "30%", // Control width of each item for 3 columns
    justifyContent: "center",
    alignItems: "center",
  },

  selectedSection: {
    backgroundColor: "gray",
    borderWidth: 1,
    borderColor: "gray",
  },

  sectionText: {
    fontWeight: "bold",
  },

  selectedBorder: {
    borderWidth: 4,
    borderColor: "black", // Special border color for selected table
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
    color: "white",
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
    color: "white",
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
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },

  closeButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  tableRestricted: {
    backgroundColor: "red",
  },
});

export default CaptainBill;
