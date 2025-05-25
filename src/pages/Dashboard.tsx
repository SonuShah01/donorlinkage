import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  getActiveBloodRequests, 
  getDonorRequestsById,
  respondToBloodRequest,
  cancelDonorResponse,
  BloodRequest,
} from "@/services/donorService";
import { calculateDistance, formatDistance } from "@/utils/locationUtils";

const Dashboard = () => {
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [activeRequests, setActiveRequests] = useState<BloodRequest[]>([]);
  const [myDonations, setMyDonations] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch active blood requests
      const requests = await getActiveBloodRequests();
      
      // Filter requests by compatible blood types
      const filteredRequests = requests.filter(req => {
        // Only show requests that match user's blood type or can receive it
        if (!user) return false;
        
        // If user is already a donor for this request, show it
        if (req.donorIds.includes(user.id)) return true;
        
        // Check if user blood type is compatible
        switch (req.bloodGroup) {
          case 'A+':
            return ['A+', 'A-', 'O+', 'O-'].includes(user.bloodGroup);
          case 'A-':
            return ['A-', 'O-'].includes(user.bloodGroup);
          case 'B+':
            return ['B+', 'B-', 'O+', 'O-'].includes(user.bloodGroup);
          case 'B-':
            return ['B-', 'O-'].includes(user.bloodGroup);
          case 'AB+':
            return ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(user.bloodGroup);
          case 'AB-':
            return ['A-', 'B-', 'AB-', 'O-'].includes(user.bloodGroup);
          case 'O+':
            return ['O+', 'O-'].includes(user.bloodGroup);
          case 'O-':
            return ['O-'].includes(user.bloodGroup);
          default:
            return false;
        }
      });
      
      setActiveRequests(filteredRequests);
      
      // Fetch my donations
      if (user) {
        const donations = await getDonorRequestsById(user.id);
        setMyDonations(donations);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load blood requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [user]);
  
  const handleRespond = async (requestId: string) => {
    if (!user) return;
    
    setRespondingTo(requestId);
    
    try {
      await respondToBloodRequest(requestId, user.id);
      toast({
        title: "Success",
        description: "You have successfully responded to the blood request.",
      });
      
      // Refresh data
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to respond to the request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRespondingTo(null);
    }
  };
  
  const handleCancelResponse = async (requestId: string) => {
    if (!user) return;
    
    setRespondingTo(requestId);
    
    try {
      await cancelDonorResponse(requestId, user.id);
      toast({
        title: "Success",
        description: "You have cancelled your response to the blood request.",
      });
      
      // Refresh data
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel the response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRespondingTo(null);
    }
  };
  
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };
  
  // Get distance from user to request
  const getDistance = (request: BloodRequest) => {
    if (!user) return "Unknown";
    
    const distance = calculateDistance(
      { latitude: user.latitude, longitude: user.longitude },
      { latitude: request.latitude, longitude: request.longitude }
    );
    
    return formatDistance(distance);
  };
  
  if (!user) {
    return <div>Loading user information...</div>;
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blood-blue">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Blood Group</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blood-red">{user.bloodGroup}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Donor Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${user.isDonor ? "bg-green-500" : "bg-gray-400"}`}></div>
              <span className="text-lg font-medium">{user.isDonor ? "Active Donor" : "Not a Donor"}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blood-lightblue">
              {myDonations.filter(d => d.status === "fulfilled").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blood-lightblue">
              {myDonations.filter(d => d.status === "active" || d.status === "pending").length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="requests">
        <TabsList className="mb-4">
          <TabsTrigger value="requests">Available Requests</TabsTrigger>
          <TabsTrigger value="mydonations">My Donations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              <p>Loading blood requests...</p>
            ) : activeRequests.length === 0 ? (
              <div className="col-span-full">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-gray-600">
                      No blood requests matching your blood type at the moment.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => fetchData()}
                    >
                      Refresh
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              activeRequests.map((request) => (
                <Card key={request.id} className="overflow-hidden">
                  <div className={`h-2 ${getUrgencyColor(request.urgency)}`}></div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Blood Group: {request.bloodGroup}</CardTitle>
                        <CardDescription>{request.hospitalName}</CardDescription>
                      </div>
                      <Badge variant={request.urgency === 'critical' ? "destructive" : "outline"}>
                        {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">Units needed:</p>
                        <p className="text-lg font-bold">{request.units}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Distance:</p>
                        <p>{getDistance(request)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Contact:</p>
                        <p>{request.contactName}</p>
                        <p className="text-sm text-gray-500">{request.contactPhone}</p>
                      </div>
                      {request.notes && (
                        <div>
                          <p className="text-sm font-medium">Notes:</p>
                          <p className="text-sm">{request.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <div className="text-sm text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                    {request.donorIds.includes(user.id) ? (
                      <Button 
                        variant="outline" 
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        disabled={respondingTo === request.id}
                        onClick={() => handleCancelResponse(request.id)}
                      >
                        {respondingTo === request.id ? "Cancelling..." : "Cancel Response"}
                      </Button>
                    ) : (
                      <Button 
                        disabled={respondingTo === request.id}
                        onClick={() => handleRespond(request.id)}
                      >
                        {respondingTo === request.id ? "Responding..." : "Respond"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="mydonations">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              <p>Loading your donations...</p>
            ) : myDonations.length === 0 ? (
              <div className="col-span-full">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-gray-600">
                      You haven't responded to any blood requests yet.
                    </p>
                    <Button 
                      className="mt-4"
                      onClick={() => navigate("/request")}
                    >
                      Make a Request
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              myDonations.map((donation) => (
                <Card key={donation.id} className="overflow-hidden">
                  <div className={`h-2 ${
                    donation.status === "fulfilled" ? "bg-green-500" :
                    donation.status === "active" ? "bg-blue-500" :
                    donation.status === "pending" ? "bg-yellow-500" :
                    "bg-gray-500"
                  }`}></div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Blood Group: {donation.bloodGroup}</CardTitle>
                        <CardDescription>{donation.hospitalName}</CardDescription>
                      </div>
                      <Badge variant={
                        donation.status === "fulfilled" ? "secondary" :
                        donation.status === "active" ? "default" :
                        donation.status === "pending" ? "outline" :
                        "secondary"
                      }>
                        {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">Units needed:</p>
                        <p className="text-lg font-bold">{donation.units}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Distance:</p>
                        <p>{getDistance(donation)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Contact:</p>
                        <p>{donation.contactName}</p>
                        <p className="text-sm text-gray-500">{donation.contactPhone}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <div className="text-sm text-gray-500">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </div>
                    {(donation.status === "active" || donation.status === "pending") && (
                      <Button 
                        variant="outline" 
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        disabled={respondingTo === donation.id}
                        onClick={() => handleCancelResponse(donation.id)}
                      >
                        {respondingTo === donation.id ? "Cancelling..." : "Cancel Response"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
