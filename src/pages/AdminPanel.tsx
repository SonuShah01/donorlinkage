
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getBloodRequests, updateBloodRequestStatus, BloodRequest, RequestStatus } from "@/services/donorService";

const AdminPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [updatingRequest, setUpdatingRequest] = useState<string | null>(null);
  
  const fetchBloodRequests = async () => {
    setLoading(true);
    try {
      const requests = await getBloodRequests();
      setBloodRequests(requests);
    } catch (error) {
      console.error("Error fetching blood requests:", error);
      toast({
        title: "Error",
        description: "Failed to load blood requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBloodRequests();
  }, []);
  
  const handleStatusChange = async (requestId: string, newStatus: RequestStatus) => {
    setUpdatingRequest(requestId);
    
    try {
      await updateBloodRequestStatus(requestId, newStatus);
      
      // Update local state
      setBloodRequests(requests => 
        requests.map(req => 
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
      
      toast({
        title: "Status Updated",
        description: `Request status has been updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      });
    } finally {
      setUpdatingRequest(null);
    }
  };
  
  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case "active":
        return "bg-blue-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "fulfilled":
        return "bg-green-500 text-white";
      case "cancelled":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-200";
    }
  };
  
  const filteredRequests = bloodRequests.filter(request => {
    const matchesSearch = 
      request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-8">You don't have permission to view this page.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-blood-blue mb-6">Admin Panel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{bloodRequests.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">
              {bloodRequests.filter(req => req.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">
              {bloodRequests.filter(req => req.status === "active").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Fulfilled Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {bloodRequests.filter(req => req.status === "fulfilled").length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="blood-requests">
        <TabsList className="mb-6">
          <TabsTrigger value="blood-requests">Blood Requests</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="blood-requests">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search requests by patient, hospital, or blood group"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as RequestStatus | "all")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="fulfilled">Fulfilled</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={fetchBloodRequests}>Refresh</Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-3 border-b">Blood Group</th>
                    <th className="text-left p-3 border-b">Patient</th>
                    <th className="text-left p-3 border-b">Hospital</th>
                    <th className="text-left p-3 border-b">Date</th>
                    <th className="text-left p-3 border-b">Status</th>
                    <th className="text-left p-3 border-b">Donors</th>
                    <th className="text-left p-3 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="p-3 text-center">
                        Loading blood requests...
                      </td>
                    </tr>
                  ) : filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-3 text-center">
                        No blood requests found.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((request) => (
                      <tr key={request.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <span className="font-medium">{request.bloodGroup}</span>
                          <span className="text-sm text-gray-500 block">
                            {request.units} unit{request.units > 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="p-3">{request.patientName}</td>
                        <td className="p-3">{request.hospitalName}</td>
                        <td className="p-3 whitespace-nowrap">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusColor(request.status)}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-3">
                          {request.donorIds.length}
                        </td>
                        <td className="p-3">
                          <Select
                            value={request.status}
                            onValueChange={(value) => handleStatusChange(request.id, value as RequestStatus)}
                            disabled={updatingRequest === request.id}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="fulfilled">Fulfilled</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center items-center p-12">
                <p className="text-gray-500">User management interface coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center items-center p-12">
                <p className="text-gray-500">Reporting interface coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
