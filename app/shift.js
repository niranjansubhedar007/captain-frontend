import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    StyleSheet,
} from "react-native";

import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useRouter } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';



const ShiftTableModal = ({ isModalOpen, setIsModalOpen }) => {

    const [sourceSectionId, setSourceSectionId] = useState("");
    const [sourceTableId, setSourceTableId] = useState("");
    const [destinationSectionId, setDestinationSectionId] = useState("");
    const [destinationTableId, setDestinationTableId] = useState("");
    const [sections, setSections] = useState([]);
    const router = useRouter();




    useEffect(() => {
        const fetchSections = async () => {
            try {
                const sectionsResponse = await axios.get(`http://192.168.0.109:5000/api/section`);
                setSections(sectionsResponse.data);
            } catch (error) {
                console.error("Error fetching sections:", error);
            }
        };

        fetchSections();
    }, []);


    const handleShiftTables = async (sourceSectionId, sourceTableName, destinationSectionId, destinationTableName) => {
        try {
            // Perform a lookup in the Table collection to retrieve tableId for destinationTableName in destinationSectionId
            const destinationTableResponse = await axios.get(`http://192.168.0.109:5000/api/table/table/bySectionAndName/${destinationSectionId}/${destinationTableName}`);
            const destinationTableId = destinationTableResponse.data._id;
            console.log("destinationTableId",destinationTableId);

            // Perform a lookup in the Table collection to retrieve tableId for sourceTableName in sourceSectionId
            const sourceTableResponse = await axios.get(`http://192.168.0.109:5000/api/table/table/bySectionAndName/${sourceSectionId}/${sourceTableName}`);
            const sourceTableId = sourceTableResponse.data._id;
            console.log("sourceTableId",sourceTableId);

            // Call the shiftTables endpoint with the retrieved tableIds
            const response = await axios.patch(`http://192.168.0.109:5000/api/order/shiftBills`, {
                destinationTableId,
                sourceTableId,
            });
            console.log(response.data); // Handle response data as needed
            setIsModalOpen(false);

            // router.push(`/order/${destinationTableId}`)
            router.push(`/bill`)
        } catch (error) {
            console.error('Error shifting tables:', error);
            setErrorMessageMerge("Not Allowed to Shift tables");
            setIsErrorModalOpenMerge(true); // Open the error modal
        }
    };




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
                    <Text style={styles.modalTitle}>Shift Table</Text>

                    {/* Source Section Dropdown */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>From Section</Text>
                        <Picker
                            selectedValue={sourceSectionId}
                            style={styles.picker}
                            onValueChange={(itemValue) => setSourceSectionId(itemValue)}
                        >
                            <Picker.Item label="Select a section" value="" />
                            {sections.map((section) => (
                                <Picker.Item
                                    key={section._id}
                                    label={section.name}
                                    value={section._id}
                                />
                            ))}
                        </Picker>
                    </View>

                    {/* Source Table Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>From Table</Text>
                        <TextInput
                            style={styles.input}
                            value={sourceTableId}
                            onChangeText={(text) => setSourceTableId(text)}
                        />
                    </View>

                    {/* Destination Section Dropdown */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>To Section</Text>
                        <Picker
                            selectedValue={destinationSectionId}
                            style={styles.picker}
                            onValueChange={(itemValue) =>
                                setDestinationSectionId(itemValue)
                            }
                        >
                            <Picker.Item label="Select a section" value="" />
                            {sections.map((section) => (
                                <Picker.Item
                                    key={section._id}
                                    label={section.name}
                                    value={section._id}
                                />
                            ))}
                        </Picker>
                    </View>

                    {/* Destination Table Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>To Table</Text>
                        <TextInput
                            style={styles.input}
                            value={destinationTableId}
                            onChangeText={(text) => setDestinationTableId(text)}
                        />
                    </View>

                    {/* Shift Button */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={() =>
                                handleShiftTables(
                                    sourceSectionId,
                                    sourceTableId,
                                    destinationSectionId,
                                    destinationTableId
                                )
                            }
                        >
                            <Text style={styles.submitButtonText}>Shift</Text>
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

export default ShiftTableModal