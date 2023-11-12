import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the type for your context data
type StepperContextType = {
  userData: string;
  setUserData: React.Dispatch<React.SetStateAction<string>>;
};

const StepperContext = createContext<StepperContextType | undefined>(undefined);

export function UseContextProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<string>("");

  return (
    <StepperContext.Provider value={{ userData, setUserData }}>
        {children}
     </StepperContext.Provider>
);
}

export function useStepperContext() {
  const context = useContext(StepperContext);
  if (context === undefined) {
    throw new Error("useStepperContext must be used within a StepperContextProvider");
  }

  return context;
}
