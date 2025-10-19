
import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const AnalyticsPage: React.FC = () => {
    const { videos, users } = useApp();

    const totalWatchTimeHours = Math.round(users.reduce((acc, user) => acc + user.watchTimeMinutes, 0) / 60);
    const premiumUsers = users.filter(u => u.subscriptionPlan === 'Premium').length;
    const estimatedRevenue = premiumUsers * 9.99; // Assuming a $9.99 plan

    // Using duration as a proxy for popularity
    const topPerformingTitles = [...videos].sort((a, b) => b.duration - a.duration).slice(0, 5);

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{videos.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Watch Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalWatchTimeHours.toLocaleString()} hrs</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Estimated Monthly Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${estimatedRevenue.toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>
            <div className="mt-8">
                 <h2 className="text-2xl font-bold mb-4">Top Performing Titles</h2>
                 <div className="bg-card border rounded-lg">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-4 font-medium">Title</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium">Duration (sec)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topPerformingTitles.map(video => (
                                <tr key={video.id} className="border-b last:border-b-0">
                                    <td className="p-4">{video.title}</td>
                                    <td className="p-4">{video.category}</td>
                                    <td className="p-4">{video.duration}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        </>
    );
};

export default AnalyticsPage;
