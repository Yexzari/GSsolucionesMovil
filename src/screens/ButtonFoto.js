import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
export default function ButtonFoto({ title, onPress, loading }) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} disabled={loading}>
            <LinearGradient
                colors={['#FFB677', '#FF3CBD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }} // Ajusta según sea necesario
                style={styles.button}
            >
                <Ionicons name="cloud-upload-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.text}>Seleccionar Foto</Text>
            </LinearGradient>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold'
    },
    button: {
        marginBottom: 20,
        width: 150,
        height: 40,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
    }
})
