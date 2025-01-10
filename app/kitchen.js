import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Kitchen = () => {
    const [tables, setTables] = useState([]);
    const [sections, setSections] = useState([]);
    const [bills, setBills] = useState({});
    const [countdowns, setCountdowns] = useState({});
    const [blink, setBlink] = useState({});
    const [isCountingUp, setIsCountingUp] = useState({});
    const fetchedKOTIds = useRef(new Set());



    const calculateRemainingTime = async (tableId, initialTime) => {
        const storedStartTime = await AsyncStorage.getItem(`startTime_${tableId}`);
        const startTime = storedStartTime ? parseInt(storedStartTime, 10) : Date.now();

        if (!storedStartTime) {
            await AsyncStorage.setItem(`startTime_${tableId}`, startTime.toString());
        }

        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        return Math.max(initialTime - elapsedTime, 0);
    };

    useEffect(() => {
            const fetchData = async () => {
                try {
                    const [sectionsResponse, tablesResponse] = await Promise.all([
                        axios.get(`http://192.168.0.109:5000/api/section`),
                        axios.get(`http://192.168.0.109:5000/api/table/tables`),
                    ]);

                    setSections(sectionsResponse.data);
                    setTables(tablesResponse.data);

                    const billsData = await Promise.all(
                        sectionsResponse.data.map(async (section) => {
                            try {
                                const kotsResponse = await axios.get(`http://192.168.0.109:5000/api/kot/kot/section/${section._id}`);
                                const newKOTs = kotsResponse.data.filter(
                                    (kot) => kot.isPlaced === 1 && kot.isCook === false && !fetchedKOTIds.current.has(kot._id)
                                );

                                newKOTs.forEach(kot => fetchedKOTIds.current.add(kot._id));

                                const sectionBills = newKOTs.reduce((acc, kot) => {
                                    acc[kot.tableId] = acc[kot.tableId] || [];
                                    acc[kot.tableId].push(kot);
                                    return acc;
                                }, {});

                                return sectionBills;
                            } catch (error) {
                                console.error(`Error fetching KOTs for section ${section._id}:`, error);
                                return {};
                            }
                        })
                    );

                    const newBillsObject = Object.assign({}, ...billsData);

                    setBills((prevBills) => ({
                        ...prevBills,
                        ...newBillsObject,
                    }));

                    setCountdowns((prevCountdowns) => {
                        const newCountdowns = { ...prevCountdowns };
                        Object.keys(newBillsObject).forEach(async (tableId) => {
                            if (!newCountdowns[tableId]) {
                                const items = newBillsObject[tableId]?.[0]?.itemsWithoutBarCategory || [];
                                const totalTimeToCook = calculateTotalTimeToCook(items);
                                if (totalTimeToCook) {
                                    const initialTime = parseTimeToSeconds(totalTimeToCook);
                                    const remainingTime = await calculateRemainingTime(tableId, initialTime);
                                    newCountdowns[tableId] = remainingTime;
                                }
                            }
                        });
                        return newCountdowns;
                    });

                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
            const intervalId = setInterval(fetchData, 2000);
            return () => clearInterval(intervalId);
        
    }, []);

    const parseTimeToSeconds = (time) => {
        const [minutes, seconds] = time.split(":").map(Number);
        return minutes * 60 + seconds;
    };

    const calculateTotalTimeToCook = (items) => {
        let totalMinutes = 0;
        let totalSeconds = 0;

        items.forEach((item) => {
            if (item.timeToCook && !item.isCanceled && item.quantity > 0) {
                const [minutes, seconds] = item.timeToCook.split(":").map(Number);
                totalMinutes += minutes;
                totalSeconds += seconds;
            }
        });

        totalMinutes += Math.floor(totalSeconds / 60);
        totalSeconds = totalSeconds % 60;

        return `${totalMinutes}:${totalSeconds.toString().padStart(2, "0")}`;
    };

    const startCountingUp = async (tableId) => {
        const storedCountUpStartTime = await AsyncStorage.getItem(`countUpStartTime_${tableId}`);
        if (!storedCountUpStartTime) {
            const newStartTime = Date.now();
            await AsyncStorage.setItem(`countUpStartTime_${tableId}`, newStartTime.toString());
            return 0;
        } else {
            const elapsedCountUpTime = Math.floor((Date.now() - parseInt(storedCountUpStartTime, 10)) / 1000);
            return elapsedCountUpTime;
        }
    };


    const handleMarkAsCooked = async (tableId) => {
        try {
            const response = await axios.patch(`http://192.168.0.109:5000/api/kot/cook/${tableId}`);
            if (response.status === 200) {
                setBills((prevBills) => ({
                    ...prevBills,
                    [tableId]: {
                        ...prevBills[tableId],
                        isCook: true,
                    },
                }));
                setTables((prevTables) => prevTables.filter(table => table._id !== tableId));
                console.log("Order marked as cooked:", response.data);
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };
    

    useEffect(() => {
        const interval = setInterval(async () => {
            setCountdowns((prevCountdowns) => {
                const updatedCountdowns = { ...prevCountdowns };
                const updatedBlink = { ...blink };
                const updatedIsCountingUp = { ...isCountingUp };

                const updateCountdowns = async () => {
                    for (const tableId in updatedCountdowns) {
                        if (!updatedIsCountingUp[tableId]) {
                            if (updatedCountdowns[tableId] > 0) {
                                updatedCountdowns[tableId] -= 1;
                                if (updatedCountdowns[tableId] <= 20) {
                                    updatedBlink[tableId] = !updatedBlink[tableId];
                                }
                            } else {
                                updatedIsCountingUp[tableId] = true;
                                updatedCountdowns[tableId] = await startCountingUp(tableId);
                            }
                        } else {
                            updatedCountdowns[tableId] += 1;
                            updatedBlink[tableId] = !updatedBlink[tableId];
                        }
                    }
                };

                // Execute the asynchronous function
                updateCountdowns().then(() => {
                    setBlink(updatedBlink);
                    setIsCountingUp(updatedIsCountingUp);
                });

                return updatedCountdowns;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [blink, isCountingUp]);


    return (
        <ScrollView>
            <View style={{ padding: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    {sections.map((section) => (
                        <View key={section._id} style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>{section.name}</Text>
                        </View>
                    ))}
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {sections.map((section) => {
                        const sectionTables = tables.filter(
                            (table) => table.section._id === section._id && bills[table._id]?.length > 0
                        );

                        return (
                            <View key={section._id} style={{ flex: 1 }}>
                                {sectionTables.length > 0 ? sectionTables.map((table) => {
                                    const remainingTime = countdowns[table._id];
                                    const minutes = Math.floor(Math.abs(remainingTime) / 60);
                                    const seconds = Math.abs(remainingTime) % 60;
                                    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

                                    return (
                                        <TouchableOpacity
                                            key={table._id}
                                            style={{
                                                marginVertical: 5,
                                                marginHorizontal: 2,
                                                padding: 5,
                                                borderWidth: 1,
                                                borderColor: bills[table._id]?.[0]?.isCook ? "gray" : "orange",
                                                borderRadius: 5,
                                                alignItems: 'center',
                                                backgroundColor: blink[table._id] ? 'red' : 'transparent',
                                            }}
                                        >
                                            <Text style={{ fontSize: 16, color: 'black', fontWeight: "bold" }}>{formattedTime}</Text>
                                            <Text style={{ fontWeight: "bold" }}>{table.name}</Text>
                                            {bills[table._id]?.map((bill) => (
                                                <View key={bill._id}>
                                                    {bill.itemsWithoutBarCategory?.map((item, index) => (
                                                        <Text key={index} style={{ textAlign: 'center' }}>
                                                            {item.name} x {item.quantity}
                                                        </Text>
                                                    ))}
                                                </View>
                                            ))}

                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: "orange",
                                                    padding: 5,
                                                    borderRadius: 5,
                                                    marginTop: 5,
                                                }}
                                                onPress={() => handleMarkAsCooked(table._id)}
                                            >
                                                <Text style={{ color: "white" }}>Mark as Cooked</Text>
                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                    );
                                }) : (
                                    <Text style={{ textAlign: "center", color: "gray", marginVertical: 10 }}>No active orders</Text>
                                )}
                            </View>
                        );
                    })}
                </View>
            </View>
        </ScrollView>
    );
};

export default Kitchen;