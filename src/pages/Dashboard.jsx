import React from 'react';

const StatCard = ({ title, value, change, isPositive }) => (
    <div className="bg-dark-surface p-6 rounded-lg shadow-lg">
        <h3 className="text-sm font-medium text-dark-text-secondary">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
        <p className={`text-sm mt-1 font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {change}
        </p>
    </div>
);

const RecentSalesTable = () => {
    const sales = [
        { id: '#12345', course: 'Advanced Marketing', student: 'Sophia Clark', amount: '$500', date: '2024-07-26' },
        { id: '#12346', course: 'Data Science Fundamentals', student: 'Ethan Carter', amount: '$750', date: '2024-07-25' },
        { id: '#12347', course: 'Project Management', student: 'Olivia Bennett', amount: '$600', date: '2024-07-24' },
        { id: '#12348', course: 'Financial Analysis', student: 'Liam Harper', amount: '$800', date: '2024-07-23' },
        { id: '#12349', course: 'Digital Marketing', student: 'Ava Foster', amount: '$550', date: '2024-07-22' },
    ];

    return (
        // === INICIO DE CAMBIOS ===
        <div className="bg-dark-surface rounded-lg shadow-lg">
            <div className="overflow-auto max-h-[40vh]">
                <table className="min-w-full">
                    <thead className="sticky top-0 bg-dark-surface z-10">
                    <tr className="border-b border-dark-border">
                        <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Sale ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Course</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Date</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-border">
                    {sales.map((sale) => (
                        <tr key={sale.id}>
                            <td className="px-6 py-4 text-sm text-dark-text-primary whitespace-nowrap">{sale.id}</td>
                            <td className="px-6 py-4 text-sm text-dark-text-primary whitespace-nowrap">{sale.course}</td>
                            <td className="px-6 py-4 text-sm text-dark-text-primary whitespace-nowrap">{sale.student}</td>
                            <td className="px-6 py-4 text-sm text-dark-text-primary whitespace-nowrap text-right">{sale.amount}</td>
                            <td className="px-6 py-4 text-sm text-dark-text-secondary whitespace-nowrap text-center">{sale.date}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
        // === FIN DE CAMBIOS ===
    );
};

const Dashboard = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-2 text-dark-text-primary">Dashboard</h1>
            <p className="text-dark-text-secondary mb-8">Overview of sales, courses, and student activities.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Sales" value="1,250" change="+15%" isPositive={true} />
                <StatCard title="Total Revenue" value="$75,000" change="+10%" isPositive={true} />
                <StatCard title="Course Performance" value="85%" change="-5%" isPositive={false} />
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-dark-text-primary">Quick Actions</h2>
                <div className="flex space-x-4">
                    <button className="bg-dark-surface hover:bg-slate-700 text-dark-text-primary font-bold py-2 px-4 rounded-lg">Manage Sales</button>
                    <button className="bg-brand-accent hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Add New Course</button>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4 text-dark-text-primary">Recent Sales</h2>
                <RecentSalesTable />
            </div>
        </div>
    );
};

export default Dashboard;