
// Mock data for blood donation requests
const BLOOD_REQUESTS = [
  {
    id: "1",
    bloodGroup: "A+" as BloodGroup,
    units: 2,
    hospitalName: "Memorial Hospital",
    address: "789 Oak St, Chicago, IL",
    latitude: 41.8781,
    longitude: -87.6298,
    patientName: "Sarah Johnson",
    contactName: "Michael Johnson",
    contactPhone: "555-222-3333",
    urgency: "high" as RequestUrgency,
    notes: "Needed for surgery scheduled tomorrow morning",
    status: "pending" as RequestStatus,
    createdAt: new Date("2023-08-15T10:30:00").toISOString(),
    donorIds: []
  },
  {
    id: "2",
    bloodGroup: "O-" as BloodGroup,
    units: 3,
    hospitalName: "City Medical Center",
    address: "123 Pine St, San Francisco, CA",
    latitude: 37.7749,
    longitude: -122.4194,
    patientName: "James Wilson",
    contactName: "Mary Wilson",
    contactPhone: "555-444-5555",
    urgency: "critical" as RequestUrgency,
    notes: "Emergency transfusion needed for accident victim",
    status: "active" as RequestStatus,
    createdAt: new Date("2023-08-16T15:45:00").toISOString(),
    donorIds: []
  },
  {
    id: "3",
    bloodGroup: "B+" as BloodGroup,
    units: 1,
    hospitalName: "Riverside Medical",
    address: "456 River Rd, Austin, TX",
    latitude: 30.2672,
    longitude: -97.7431,
    patientName: "Robert Davis",
    contactName: "Robert Davis",
    contactPhone: "555-666-7777",
    urgency: "medium" as RequestUrgency,
    notes: "Regular transfusion for anemia patient",
    status: "fulfilled" as RequestStatus,
    createdAt: new Date("2023-08-10T09:15:00").toISOString(),
    donorIds: ["2"]
  }
];

// Types
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type RequestUrgency = 'low' | 'medium' | 'high' | 'critical';
export type RequestStatus = 'pending' | 'active' | 'fulfilled' | 'cancelled';

export interface BloodRequest {
  id: string;
  bloodGroup: BloodGroup;
  units: number;
  hospitalName: string;
  address: string;
  latitude: number;
  longitude: number;
  patientName: string;
  contactName: string;
  contactPhone: string;
  urgency: RequestUrgency;
  notes?: string;
  status: RequestStatus;
  createdAt: string;
  donorIds: string[];
}

// Mock API functions
export const getBloodRequests = async (): Promise<BloodRequest[]> => {
  // Simulate API fetch delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return [...BLOOD_REQUESTS] as BloodRequest[];
};

export const getBloodRequestById = async (id: string): Promise<BloodRequest | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return BLOOD_REQUESTS.find(request => request.id === id) as BloodRequest | undefined;
};

export const createBloodRequest = async (requestData: Omit<BloodRequest, 'id' | 'status' | 'createdAt' | 'donorIds'>): Promise<BloodRequest> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newRequest: BloodRequest = {
    id: Math.random().toString(36).substring(2, 11),
    ...requestData,
    status: 'pending',
    createdAt: new Date().toISOString(),
    donorIds: []
  };
  
  BLOOD_REQUESTS.push(newRequest as any);
  return newRequest;
};

export const updateBloodRequestStatus = async (id: string, status: RequestStatus): Promise<BloodRequest> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const requestIndex = BLOOD_REQUESTS.findIndex(req => req.id === id);
  if (requestIndex === -1) {
    throw new Error('Blood request not found');
  }
  
  BLOOD_REQUESTS[requestIndex].status = status;
  return BLOOD_REQUESTS[requestIndex] as BloodRequest;
};

export const respondToBloodRequest = async (requestId: string, donorId: string): Promise<BloodRequest> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const requestIndex = BLOOD_REQUESTS.findIndex(req => req.id === requestId);
  if (requestIndex === -1) {
    throw new Error('Blood request not found');
  }
  
  if (!BLOOD_REQUESTS[requestIndex].donorIds.includes(donorId)) {
    BLOOD_REQUESTS[requestIndex].donorIds.push(donorId);
  }
  
  if (BLOOD_REQUESTS[requestIndex].status === 'pending') {
    BLOOD_REQUESTS[requestIndex].status = 'active' as RequestStatus;
  }
  
  return BLOOD_REQUESTS[requestIndex] as BloodRequest;
};

export const cancelDonorResponse = async (requestId: string, donorId: string): Promise<BloodRequest> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const requestIndex = BLOOD_REQUESTS.findIndex(req => req.id === requestId);
  if (requestIndex === -1) {
    throw new Error('Blood request not found');
  }
  
  BLOOD_REQUESTS[requestIndex].donorIds = BLOOD_REQUESTS[requestIndex].donorIds.filter(id => id !== donorId);
  
  return BLOOD_REQUESTS[requestIndex] as BloodRequest;
};

export const getDonorRequestsById = async (donorId: string): Promise<BloodRequest[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return BLOOD_REQUESTS.filter(request => request.donorIds.includes(donorId)) as BloodRequest[];
};

export const getActiveBloodRequests = async (): Promise<BloodRequest[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return BLOOD_REQUESTS.filter(request => request.status === 'active' || request.status === 'pending') as BloodRequest[];
};

// Blood group compatibility chart for recipients
export const bloodGroupCompatibility: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
};

// Function to find compatible donors for a blood recipient
export const findCompatibleDonors = (recipientBloodGroup: BloodGroup): BloodGroup[] => {
  return bloodGroupCompatibility[recipientBloodGroup];
};
