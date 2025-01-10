import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Picker } from '@react-native-picker/picker';
import axios from "axios";
import { router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const UnSplitTablesModal = ({ isModalOpen, setIsModalOpen }) => {


    const [mainTableName, setMainTableName] = useState("");
    const [sectionName, setSectionName] = useState("");
    const [sections, setSections] = useState([]);
    const [backendIp, setBackendIp] = useState(''); // Initialize state for the IP
  const [isIPFetched, setIsIPFetched] = useState(false);

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const savedIp = await AsyncStorage.getItem('backendIp'); // Get saved IP from AsyncStorage
        if (savedIp) {
          setBackendIp(savedIp); // Set the IP if available
        } else {
          console.warn('No backend IP found in AsyncStorage');
        }
  setIsIPFetched(true); // Mark as fetched

      } catch (e) {
        console.error('Failed to fetch the IP from AsyncStorage', e);
      }
    };

    fetchIp();
  }, []);

    useEffect(() => {
        if (isIPFetched) {
        const fetchSections = async () => {
            try {
                const sectionsResponse = await axios.get(`http://192.168.0.109:5000/api/section`);
                setSections(sectionsResponse.data);
            } catch (error) {
                console.error("Error fetching sections:", error);
            }
        };

        fetchSections();
    }
    }, [isIPFetched]);


    const handleResetTable = async (sectionName, mainTableName) => {
        try {
            // Call the API to get the tableId for the mainTableName
            const tableResponse = await axios.get(
                `http://192.168.0.109:5000/api/table/tables/bySection/${sectionName}/${mainTableName}`
            );
            // console.log(tableResponse);
            const mainTableId = tableResponse.data._id;

            // Check if mainTableId is obtained successfully
            if (!mainTableId) {
                console.error("Main table ID not found");
                return;
            }

            const sectionResponse = await axios.get(
                `http://192.168.0.109:5000/api/table/section/byName/${sectionName}`
            );
            // console.log(sectionResponse);
            const sectionId = sectionResponse.data.sectionId;

            // Check if sectionId is obtained successfully
            if (!sectionId) {
                console.error("Section ID not found");
                return;
            }

            // Call the reset-subtables endpoint with the retrieved mainTableId and sectionId
            const response = await axios.put(
                `http://192.168.0.109:5000/api/table/${sectionId}/${mainTableId}/reset-subtables`
            );

            if (response.status === 200) {
                // Handle success
                console.log(response.data.message);
                setIsModalOpen(false);
                setSectionName("");
                setMainTableName("");
                router.push('/bill')
            } else {
                // Handle errors
                console.error("Failed to reset subtables");
            }
        } catch (error) {
            console.error("Error resetting subtables:", error);
        }
    };

    if (!isIPFetched) {
        return (
          <View>
            <Text>Loading...</Text>
          </View>
        );
      }
    


    return (
        <Modal
            visible={isModalOpen}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsModalOpen(false)}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setIsModalOpen(false)}
                    >
                        <FontAwesome name="times" size={20} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Restore Main Table</Text>

                    {/* Section Name Picker */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Section Name</Text>
                        <Picker
                            selectedValue={sectionName}
                            style={styles.picker}
                            onValueChange={(itemValue) => setSectionName(itemValue)}
                        >
                            <Picker.Item label="Select a section" value="" />
                            {sections.map((section) => (
                                <Picker.Item key={section._id} label={section.name} value={section.name} />
                            ))}
                        </Picker>
                    </View>

                    {/* Main Table Name Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Main TableName / TableNumber</Text>
                        <TextInput
                            style={styles.input}
                            value={mainTableName}
                            onChangeText={(text) => setMainTableName(text)}
                        />
                    </View>

                    {/* Restore Button */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={() => handleResetTable(sectionName, mainTableName)}
                        >
                            <Text style={styles.submitButtonText}>Restore</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        padding: 5,
        backgroundColor: "#f87171",
        borderRadius: 50,
    },
    closeButtonText: {
        color: "#721c24",
        fontSize: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        fontSize: 14,
        backgroundColor: "#f9f9f9",
    },
    picker: {
        height: 50,
        width: "100%",
        borderColor: "#ccc",
        borderRadius: 5,
    },
    buttonContainer: {
        alignItems: "center",
    },
    submitButton: {
        backgroundColor: "#ffa500",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
    },
    submitButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});


export default UnSplitTablesModal