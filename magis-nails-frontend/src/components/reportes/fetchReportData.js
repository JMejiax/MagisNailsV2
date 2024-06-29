import React, { useState, useEffect, useMemo } from 'react';
import LoginActivityReport from './LoginActivityReport';
import ServiceUsageReport from './ServiceUsageReport';
import ProductUsageReport from './ProductUsageReport';
import UserAppointmentHistoryReport from './UserAppointmentHistoryReport';
import ServiceAppointmentSummaryReport from './ServiceAppointmentSummaryReport';
import RevenueReport from './RevenueReport';

const FetchReportData = ({ report, startDate, endDate, selectedUser, userName }) => {
    const [reportData, setReportData] = useState([]);
    const [reportFilterData, setFilterReportData] = useState({
        userName: userName,
        startDate: startDate,
        endDate: endDate
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setFilterReportData({
            userName: userName,
            startDate: startDate,
            endDate: endDate
        });

        let url = '';

        switch (report.id) {
            case 1:
                url = `http://127.0.0.1:8000/login_activity_report`;
                break;
            case 2:
                url = `http://127.0.0.1:8000/service_usage_report`;
                break;
            case 3:
                url = `http://127.0.0.1:8000/product_usage_report`;
                break;
            case 4:
                url = `http://127.0.0.1:8000/user_appointment_history_report/${selectedUser}`;
                break;
            case 5:
                url = `http://127.0.0.1:8000/service_appointment_summary_report/${startDate}/${endDate}`;
                break;
            case 6:
                url = `http://127.0.0.1:8000/revenue_report/${startDate}/${endDate}`;
                break;
            default:
                break;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Error fetching report');
                }

                const reportResponse = await response.json();
                setReportData(reportResponse);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching report:', error);
                alert("Ocurrió un error al obtener el reporte");
                setLoading(false);
            }
        };

        fetchData();

    }, [report.id, startDate, endDate, selectedUser, userName]);

    const getReportComponent = useMemo(() => {
        switch (report.id) {
            case 1:
                return <LoginActivityReport reportData={reportData} />;
            case 2:
                return <ServiceUsageReport reportData={reportData} />;
            case 3:
                return <ProductUsageReport reportData={reportData} />;
            case 4:
                return <UserAppointmentHistoryReport reportData={reportData} reportFilterData={reportFilterData} />;
            case 5:
                return <ServiceAppointmentSummaryReport reportData={reportData} reportFilterData={reportFilterData} />;
            case 6:
                return <RevenueReport reportData={reportData} reportFilterData={reportFilterData} />;
            default:
                return null;
        }

    }, [report.id, reportData, reportFilterData]);

    return (
        <>
            {loading ? <p>Loading...</p> : getReportComponent}
        </>
    );
};

export default FetchReportData;
