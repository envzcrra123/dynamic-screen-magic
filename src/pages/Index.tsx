
import React, { useState } from 'react';
import StatusBar from '@/components/StatusBar';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import MedicalBot from '@/components/MedicalBot';
import SymptomInput from '@/components/SymptomInput';
import { toast } from '@/components/ui/use-toast';

interface Diagnosis {
  disease: string;
  probability: number;
  description: string;
}

const Index: React.FC = () => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSymptomSubmit = (input: string) => {
    setLoading(true);
    
    // Simulate API call for diagnosis
    setTimeout(() => {
      // This is simulated data - in a real app, this would come from an API
      const mockDiagnoses: Diagnosis[] = [
        {
          disease: "Common Cold",
          probability: 0.85,
          description: "A viral infectious disease of the upper respiratory tract that primarily affects the nose."
        },
        {
          disease: "Seasonal Allergies",
          probability: 0.65,
          description: "An allergic reaction to pollen from trees, grasses, or weeds, or to airborne mold spores."
        },
        {
          disease: "Sinusitis",
          probability: 0.45,
          description: "Inflammation of the sinuses, often caused by infection, allergies, or autoimmune issues."
        }
      ];
      
      setDiagnoses(mockDiagnoses);
      setLoading(false);
      
      toast({
        title: "Diagnosis Complete",
        description: "We've analyzed your symptoms and provided possible diagnoses.",
      });
    }, 1500);
  };

  return (
    <div className="mobile-container">
      <StatusBar />
      <Header title="Symptoms Checker" />
      
      <main className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        <div className="flex flex-col items-center space-y-6 animate-fade-in">
          <MedicalBot className="mt-6" />
          
          <SymptomInput onSubmit={handleSymptomSubmit} />
          
          {loading && (
            <div className="w-full pt-8 flex justify-center">
              <div className="w-10 h-10 border-t-2 border-medical-purple rounded-full animate-spin"></div>
            </div>
          )}
          
          {diagnoses.length > 0 && (
            <div className="w-full space-y-4 mt-6 animate-slide-up">
              <h2 className="text-lg font-semibold">Possible Diagnoses:</h2>
              
              {diagnoses.map((diagnosis, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-medical-gray rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900">{diagnosis.disease}</h3>
                    <span className="px-2 py-1 bg-medical-purple text-white text-xs rounded-full">
                      {Math.floor(diagnosis.probability * 100)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{diagnosis.description}</p>
                </div>
              ))}
              
              <div className="text-xs text-gray-500 italic text-center mt-4">
                Note: These results are for informational purposes only and do not constitute medical advice.
              </div>
            </div>
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
