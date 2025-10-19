
import React from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';

const UserManagementPage: React.FC = () => {
  const { users } = useApp();

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Users</h1>
      </div>

      <div className="overflow-x-auto bg-card border rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Subscription Plan</th>
              <th className="p-4 font-medium">Watch Time (Minutes)</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b last:border-b-0">
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.subscriptionPlan === 'Premium' ? 'bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-gray-500/20 text-gray-700 dark:text-gray-400'}`}>
                        {user.subscriptionPlan}
                    </span>
                </td>
                <td className="p-4">{user.watchTimeMinutes.toLocaleString()}</td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserManagementPage;
