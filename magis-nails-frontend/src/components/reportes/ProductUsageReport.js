import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define colors
const colors = {
    primary: '#f48fb1',
    secondary: '#f48fb1',
    lightGray: '#e0e0e0',
};

// Create styles for the PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        backgroundColor: colors.primary,
        padding: 10,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerText: {
        fontSize: 16,
        color: '#fff',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.primary,
        fontSize: 12,
    },
    table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderColor: colors.lightGray,
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row',
    },
    tableColHeader: {
        width: '50%',
        fontSize: 12,
        borderStyle: 'solid',
        borderColor: colors.lightGray,
        borderBottomColor: colors.primary,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 5,
        backgroundColor: colors.primary,
        color: '#fff',
        textAlign: 'center',
    },
    tableCol: {
        width: '50%',
        fontSize: 10,
        borderStyle: 'solid',
        borderColor: colors.lightGray,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 5,
        textAlign: 'center',
    },
    noDataMessage: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
        fontStyle: 'italic',
        color: colors.primary,
    },
});

const ProductUsageReport = ({ reportData }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>MagisNails | Reporte de Productos</Text>
                </View>

                {/* Table */}
                {reportData.length > 0 ? (
                    <View style={styles.table}>
                        {/* Table Header */}
                        <View style={styles.tableRow}>
                            <Text style={styles.tableColHeader}>Producto</Text>
                            <Text style={styles.tableColHeader}>Total Unidades Usadas</Text>
                        </View>

                        {/* Table Rows */}
                        {reportData.map((product, index) => (
                            <View style={styles.tableRow} key={index}>
                                <Text style={styles.tableCol}>{product.name}</Text>
                                <Text style={styles.tableCol}>{product.total_units_used}</Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text style={styles.noDataMessage}>No hay datos disponibles para mostrar.</Text>
                )}

                {/* Footer */}
                <Text style={styles.footer}>Generado por MagisNails</Text>
            </Page>
        </Document>
    );
};

export default ProductUsageReport;
