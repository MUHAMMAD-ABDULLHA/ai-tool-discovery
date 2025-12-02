import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { Flag, CheckCircle, ExternalLink } from 'lucide-react';

const ReportManagement = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await axios.get('/admin/reports');
            setReports(res.data.reports || []);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch reports');
            setLoading(false);
        }
    };

    const handleDismiss = async (reportId) => {
        // For now, we might not have a dismiss endpoint, but we can simulate it or add one.
        // Or just delete the report? Let's assume we want to keep it but mark resolved.
        // Since we didn't add a resolve endpoint, let's just alert for now or maybe delete?
        // The user didn't specify "resolve" logic, just "see reports".
        // Let's just show them for now.
        alert("Dismiss functionality to be implemented (requires backend endpoint)");
    };

    if (loading) return <div className="p-8 text-center">Loading reports...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Flag className="text-red-500" /> User Reports
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="p-4 font-semibold text-gray-600">Tool</th>
                            <th className="p-4 font-semibold text-gray-600">Reporter</th>
                            <th className="p-4 font-semibold text-gray-600">Reason</th>
                            <th className="p-4 font-semibold text-gray-600">Description</th>
                            <th className="p-4 font-semibold text-gray-600">Date</th>
                            {/* <th className="p-4 font-semibold text-gray-600">Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {reports.length > 0 ? (
                            reports.map((report) => (
                                <tr key={report._id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-4 font-medium text-indigo-600">
                                        {report.toolId?.name || 'Unknown Tool'}
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {report.userId?.name || 'Anonymous'}
                                        <div className="text-xs text-gray-400">{report.userId?.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                            ${report.reason === 'broken_link' ? 'bg-yellow-100 text-yellow-800' :
                                                report.reason === 'inappropriate_content' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'}`}>
                                            {report.reason.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600 max-w-xs truncate" title={report.description}>
                                        {report.description}
                                    </td>
                                    <td className="p-4 text-gray-500 text-sm">
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </td>
                                    {/* <td className="p-4">
                                        <button 
                                            onClick={() => handleDismiss(report._id)}
                                            className="text-gray-400 hover:text-green-600 transition-colors"
                                            title="Mark as Resolved"
                                        >
                                            <CheckCircle size={20} />
                                        </button>
                                    </td> */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">
                                    No reports found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportManagement;
