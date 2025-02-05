"use client";

import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const challenges = [
  "Challenge 1",
  "Challenge 2",
  "Challenge 3",
  "Challenge 4",
  "Challenge 5",
  "Challenge 6",
  "Challenge 7",
  "Challenge 8",
];

const NurseGame = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null);
  const [assessmentCompletion, setAssessmentCompletion] = useState<{ [key: number]: { skin: boolean; risk: boolean; injury: boolean; complete: boolean } }>({});
  const [currentAssessment, setCurrentAssessment] = useState<{ challenge: number; type: string } | null>(null);
  const [clickedItems, setClickedItems] = useState<{ [key: number]: { [key: string]: Set<string> } }>({});
  const [user] = useAuthState(auth);

  const startAssessment = (challengeIndex: number, assessmentType: string) => {
    setCurrentAssessment({ challenge: challengeIndex, type: assessmentType });
    setClickedItems((prev) => ({
      ...prev,
      [challengeIndex]: {
        ...prev[challengeIndex],
        [assessmentType]: prev[challengeIndex]?.[assessmentType] || new Set(),
      },
    }));
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleItemClick = (challengeIndex: number, assessmentType: string, item: string) => {
    setClickedItems((prev) => {
      const updatedSet = new Set(prev[challengeIndex]?.[assessmentType] || []);
      updatedSet.add(item);
      
      const requiredItems = assessmentType === "skin" ? 4 : assessmentType === "risk" ? 3 : 2;
      const isCompleted = updatedSet.size >= requiredItems;
      
      setAssessmentCompletion((prev) => {
        const updatedCompletion = {
          ...prev,
          [challengeIndex]: {
            ...prev[challengeIndex],
            [assessmentType]: isCompleted,
          },
        };
        
        if (updatedCompletion[challengeIndex]?.skin && updatedCompletion[challengeIndex]?.risk && updatedCompletion[challengeIndex]?.injury) {
          updatedCompletion[challengeIndex].complete = true;
        }
        return updatedCompletion;
      });
      
      return {
        ...prev,
        [challengeIndex]: {
          ...prev[challengeIndex],
          [assessmentType]: updatedSet,
        },
      };
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between w-full max-w-4xl mb-4">
        <h1 className="text-2xl font-bold">Nurse Gamification Challenge</h1>
        {user && <Button className="bg-red-500 text-white" onClick={handleLogout}>Logout</Button>}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {challenges.map((challenge, index) => (
          <Card key={index} className={`p-4 cursor-pointer hover:shadow-lg ${assessmentCompletion[index]?.complete ? "bg-green-500" : ""}`} onClick={() => setSelectedChallenge(index)}>
            <CardContent className="text-center font-semibold">{challenge}</CardContent>
          </Card>
        ))}
      </div>

      {selectedChallenge !== null && !currentAssessment && (
        <Dialog open={true} onOpenChange={() => setSelectedChallenge(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{challenges[selectedChallenge]}</DialogTitle>
            </DialogHeader>
            
            {/* Patient Image Added Here, only for the challenge card */}
            <div className="flex justify-center my-4">
              <Image src="/patient.png" alt="Patient" width={200} height={150} className="rounded-lg shadow-md" />
            </div>
            
            <div className="flex flex-row justify-center gap-4">
              <Button className={assessmentCompletion[selectedChallenge]?.skin ? "bg-green-500" : ""} onClick={() => startAssessment(selectedChallenge, "skin")}>Skin Assessment</Button>
              <Button className={assessmentCompletion[selectedChallenge]?.risk ? "bg-green-500" : ""} onClick={() => startAssessment(selectedChallenge, "risk")}>Risk Assessment</Button>
              <Button className={assessmentCompletion[selectedChallenge]?.injury ? "bg-green-500" : assessmentCompletion[selectedChallenge]?.skin && assessmentCompletion[selectedChallenge]?.risk ? "" : "bg-gray-400 cursor-not-allowed"} 
                onClick={() => (assessmentCompletion[selectedChallenge]?.skin && assessmentCompletion[selectedChallenge]?.risk) ? startAssessment(selectedChallenge, "injury") : null}
                disabled={!assessmentCompletion[selectedChallenge]?.skin || !assessmentCompletion[selectedChallenge]?.risk}
              >
                Injury Prevention
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {currentAssessment && (
        <Dialog open={true} onOpenChange={() => setCurrentAssessment(null)}>
          <DialogContent>
            <DialogHeader className="relative">
              <Button className="absolute top-2 left-2" onClick={() => setCurrentAssessment(null)}>Go Back</Button>
              <DialogTitle className="text-center">{currentAssessment.type} Assessment</DialogTitle>
            </DialogHeader>
            <div className="flex flex-row justify-center gap-4 mt-4">
              {(currentAssessment.type === "skin" ? ["Item 1", "Item 2", "Item 3", "Item 4"] :
                currentAssessment.type === "risk" ? ["Item 1", "Item 2", "Item 3"] :
                ["Item 1", "Item 2"]).map((item) => (
                <Button key={item} className={clickedItems[currentAssessment.challenge]?.[currentAssessment.type]?.has(item) ? "bg-blue-500" : ""} onClick={() => handleItemClick(currentAssessment.challenge, currentAssessment.type, item)}>
                  {item}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default NurseGame;
