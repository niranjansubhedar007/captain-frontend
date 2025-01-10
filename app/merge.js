import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Pressable, Alert } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import axios from "axios";
import { useRouter } from "expo-router";
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


const MergeTablesModal = ({ isModalOpen, setIsModalOpen }) => {
    const [destinationTableId, setDestinationTableId] = useState("");
    const [sourceTableId, setSourceTableId] = useState("");
    const [sectionId, setSectionId] = useState("");
    const [sections, setSections] = useState([]);
    const [errorMessageMerge, setErrorMessageMerge] = useState("");
    const [isErrorModalOpenMerge, setIsErrorModalOpenMerge] = useState(false);
      
    
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

    const handleMergeTables = async (sectionId, destinationTableName, sourceTableName) => {
        try {
            // Perform a lookup in the Table collection to retrieve tableId for destinationTableName
            const destinationTableResponse = await axios.get(
                `http://192.168.0.109:5000/api/table/table/bySectionAndName/${sectionId}/${destinationTableName}`
            );
            const destinationTableId = destinationTableResponse.data._id;
            console.log(destinationTableId);

            // Perform a lookup in the Table collection to retrieve tableId for sourceTableName
            const sourceTableResponse = await axios.get(
                `http://192.168.0.109:5000/api/table/table/bySectionAndName/${sectionId}/${sourceTableName}`
            );
            const sourceTableId = sourceTableResponse.data._id;

            // Call the mergeTables endpoint with the retrieved tableIds
            const response = await axios.patch(
                `http://192.168.0.109:5000/api/order/mergeTables`,
                {
                    destinationTableId,
                    sourceTableId,
                }
            );
            console.log(response.data); // Handle response data as needed

            setIsModalOpen(false);
            // router.push(`/order/${destinationTableId}`);
            router.push(`/bill`);

        } catch (error) {
            console.error("Error merging tables:", error);
            setErrorMessageMerge("Not Allowed to merge tables");
            setIsErrorModalOpenMerge(true); // Open the error modal
        }
    };




    return (
        <Modal
            transparent={true}
            visible={isModalOpen}
            animationType="slide"
            onRequestClose={() => setIsModalOpen(false)}
        >
            <Pressable style={styles.overlay} onPress={() => setIsModalOpen(false)}>
                <View style={styles.modalContainer} onTouchStart={(e) => e.stopPropagation()}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setIsModalOpen(false)}
                    >
                        <FontAwesome name="times" size={20} color="white" />
                    </TouchableOpacity>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Merge Tables</Text>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>To Table</Text>
                            <TextInput
                                value={destinationTableId}
                                onChangeText={setDestinationTableId}
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>From Table</Text>
                            <TextInput
                                value={sourceTableId}
                                onChangeText={setSourceTableId}
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Section Name</Text>
                            <Picker
                                selectedValue={sectionId}
                                onValueChange={(itemValue) => setSectionId(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select a section" value="" />
                                {sections.map((section) => (
                                    <Picker.Item key={section._id} label={section.name} value={section._id} />
                                ))}
                            </Picker>
                        </View>
                        <TouchableOpacity
                            style={styles.mergeButton}
                            onPress={() => handleMergeTables(sectionId, destinationTableId, sourceTableId)}
                        >
                            <Text style={styles.mergeButtonText}>Merge</Text>
                        </TouchableOpacity>
                        {isErrorModalOpenMerge && (
                            <View style={styles.errorModal}>
                                <Text>{errorMessageMerge}</Text>
                                <TouchableOpacity onPress={() => setIsErrorModalOpenMerge(false)}>
                                    <Text style={styles.errorButton}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </Pressable>
        </Modal>
    )
}


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: "90%",
        maxWidth: 400,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
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
    modalContent: {
        marginTop: 30,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    mergeButton: {
        backgroundColor: "#fb923c",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: "center",
        marginTop: 20,
        alignSelf: "center",
    },
    mergeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});


export default MergeTablesModal 