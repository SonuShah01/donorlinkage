
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { findCompatibleDonors, BloodGroup } from "@/services/donorService";

const HomePage = () => {
  const [selectedBloodType, setSelectedBloodType] = useState<BloodGroup | null>(null);
  const navigate = useNavigate();
  
  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  const compatibleDonors = selectedBloodType 
    ? findCompatibleDonors(selectedBloodType) 
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blood-light to-white py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-blood-blue mb-6">
              Donate Blood, <span className="text-blood-red">Save Lives</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              DonorLinkage connects blood donors with recipients in need.
              Join our network today to help save lives in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate("/register")}
                size="lg"
                className="bg-blood-red hover:bg-red-700 text-white"
              >
                Become a Donor
              </Button>
              <Button 
                onClick={() => navigate("/request")}
                variant="outline"
                size="lg"
                className="border-blood-red text-blood-red hover:bg-blood-red/10"
              >
                Request Blood
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1856&auto=format&fit=crop" 
                alt="Blood Donation" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-blood-blue/30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blood-blue mb-12">
            How DonorLinkage Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-blood-lightblue">
              <CardContent className="pt-6">
                <div className="w-16 h-16 rounded-full bg-blood-light flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blood-red">1</span>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">Register as a Donor</h3>
                <p className="text-gray-600 text-center">
                  Create an account, specify your blood type, and set your location to join our donor network.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-blood-lightblue">
              <CardContent className="pt-6">
                <div className="w-16 h-16 rounded-full bg-blood-light flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blood-red">2</span>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">Receive Notifications</h3>
                <p className="text-gray-600 text-center">
                  When someone needs your blood type in your area, you'll be automatically notified.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-blood-lightblue">
              <CardContent className="pt-6">
                <div className="w-16 h-16 rounded-full bg-blood-light flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blood-red">3</span>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">Donate & Save Lives</h3>
                <p className="text-gray-600 text-center">
                  Respond to requests, coordinate with the recipient, and make a life-saving donation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Blood Type Compatibility Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blood-blue mb-12">
            Blood Type Compatibility Checker
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-lg text-gray-700 mb-4">
                Select a blood type to see compatible donor types:
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {bloodGroups.map((group) => (
                  <button
                    key={group}
                    onClick={() => setSelectedBloodType(group)}
                    className={`
                      py-2 px-4 rounded-full font-medium transition
                      ${selectedBloodType === group
                        ? 'bg-blood-red text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-blood-red'
                      }
                    `}
                  >
                    {group}
                  </button>
                ))}
              </div>
              
              {selectedBloodType && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">
                    <span className="text-blood-red">{selectedBloodType}</span> recipient can receive from:
                  </h3>
                  
                  <div className="flex flex-wrap justify-center gap-2">
                    {compatibleDonors?.map((group) => (
                      <span
                        key={group}
                        className="py-2 px-4 rounded-full font-medium bg-blood-light text-blood-red"
                      >
                        {group}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blood-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Your donation can save up to three lives. Join our network of donors today and be notified when your blood type is needed in your area.
          </p>
          <Button 
            onClick={() => navigate("/register")}
            size="lg"
            className="bg-white text-blood-blue hover:bg-blood-light"
          >
            Register Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
