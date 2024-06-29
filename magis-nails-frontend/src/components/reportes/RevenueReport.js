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
        position: 'relative',
    },
    header: {
        backgroundColor: colors.primary,
        padding: 10,
        marginBottom: 20,
        textAlign: 'left',
    },
    headerText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    headerInfoText: {
        fontSize: 12,
        color: '#fff',
        marginTop: 5,
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
        flexDirection: 'row',
    },
    tableColHeader: {
        width: '100%',
        fontSize: 14,
        borderStyle: 'solid',
        borderColor: colors.lightGray,
        borderBottomColor: colors.primary,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 10,
        backgroundColor: colors.primary,
        color: '#fff',
        textAlign: 'center',
    },
    tableCol: {
        width: '100%',
        fontSize: 12,
        borderStyle: 'solid',
        borderColor: colors.lightGray,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 10,
        textAlign: 'center',
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
});

export default function RevenueReport({ reportData, reportFilterData }) {
    const { startDate, endDate } = reportFilterData;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>MagisNails | Reporte de Ganancias</Text>
                    <Text style={styles.headerInfoText}>Fecha de inicio: {startDate}</Text>
                    <Text style={styles.headerInfoText}>Fecha de fin: {endDate}</Text>
                </View>

                {/* Table */}
                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={styles.tableRow}>
                        <Text style={styles.tableColHeader}>Total Ganancia</Text>
                    </View>

                    {/* Table Row */}
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>
                            {reportData.total_revenue
                                ? reportData.total_revenue
                                : 'No se registran ingresos en el periodo seleccionado.'}
                        </Text>
                    </View>
                </View>

                {/* Footer */}
                <Text style={styles.footer}>Generado por MagisNails</Text>
            </Page>
        </Document>
    );
};
