"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LogsTable from "@/components/tables/LogsTable";
import { LogEntry } from "@/lib/logs";

interface User {
  id: number;
  username: string;
  role: Role;
  logs: LogEntry[];
}

export default function SuperAdminPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (session?.user?.role === Role.SUPER_ADMIN) {
      fetchUsers();
    }
  }, [session]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/super-admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleUpdateUser = async (userId: number, data: Partial<User>) => {
    try {
      const response = await fetch("/api/super-admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId, ...data }),
      });
      if (response.ok) {
        fetchUsers();
        setIsEditing(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleResetPassword = async (userId: number, newPassword: string) => {
    try {
      const response = await fetch("/api/super-admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId, newPassword }),
      });
      if (response.ok) {
        alert("Password reset successful");
      }
    } catch (error) {
      console.error("Failed to reset password:", error);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen p-4 text-white">
        Please log in to access this page.
      </div>
    );
  }

  if (session.user?.role !== Role.SUPER_ADMIN) {
    return (
      <div className="min-h-screen p-4 text-white">
        Access denied. Super Admin privileges required.
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4 text-white">
          Super Admin Panel
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Users List */}
          <div className="bg-gray-800 shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4 text-white">Users</h2>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="border border-gray-700 p-4 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-white">
                        {user.username}
                      </h3>
                      <p className="text-sm text-gray-300">Role: {user.role}</p>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUser(user);
                        setIsEditing(true);
                      }}
                      variant="ghost"
                      className="text-gray-400 hover:text-gray-300"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Details and Logs */}
          {selectedUser && (
            <div className="bg-gray-800 shadow rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4 text-white">
                {isEditing ? "Edit User" : "User Details"}
              </h2>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Username
                    </label>
                    <Input
                      type="text"
                      value={selectedUser.username}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          username: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-gray-500 focus:ring-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Role
                    </label>
                    <Select
                      value={selectedUser.role}
                      onValueChange={(value) =>
                        setSelectedUser({
                          ...selectedUser,
                          role: value as Role,
                        })
                      }
                    >
                      <SelectTrigger className="mt-1 w-full bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {Object.values(Role).map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      New Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Leave blank to keep current password"
                      onChange={(e) =>
                        handleResetPassword(selectedUser.id, e.target.value)
                      }
                      className="mt-1 block w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() =>
                        handleUpdateUser(selectedUser.id, selectedUser)
                      }
                      className="flex-1"
                      variant="default"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedUser(null);
                      }}
                      className="flex-1"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-medium text-white">
                    {selectedUser.username}
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Role: {selectedUser.role}
                  </p>

                  <h4 className="font-medium text-white mb-2">User Logs</h4>
                  <div className="space-y-2">
                    <LogsTable initialLogs={selectedUser.logs} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
