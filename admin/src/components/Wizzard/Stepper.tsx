import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  ContentLayout,
  Grid,
  GridItem,
  IconButton,
  Layout,
  Typography,
  Flex,
} from '@strapi/design-system';

interface Step {
  description: string;
  completed: boolean;
  highlighted: boolean;
  selected: boolean;
}

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const Stepper = ({ steps, currentStep } : StepperProps) => {
  const [newStep, setNewStep] = useState<Step[]>([]);
  const stepsRef = useRef<Step[] | null>(null);

  const updateStep = (stepNumber: number, steps: Step[]): Step[] => {
    const newSteps = [...steps];
    let count = 0;
    while (count < newSteps.length) {
      // Current step
      if (count === stepNumber) {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: true,
          selected: true,
          completed: true,
        };
        count++;
      }
      // Step completed
      else if (count < stepNumber) {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: false,
          selected: true,
          completed: true,
        };
        count++;
      }
      // Step pending
      else {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: false,
          selected: false,
          completed: false,
        };
        count++;
      }
    }
    return newSteps;
  };

  useEffect(() => {
    const stepsState: Step[] = steps.map((step, index) => ({
      description: step,
      completed: false,
      highlighted: index === 0,
      selected: index === 0,
    }));

    stepsRef.current = stepsState;
    const current = updateStep(currentStep - 1, stepsRef.current);
    setNewStep(current);
  }, [steps, currentStep]);

  const stepCircleStyle = (step: Step) => {
    const baseStyle: React.CSSProperties = {
      borderRadius: "50%",
      transition: "all 0.5s ease-in-out",
      border: "2px solid #888888",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "24px",
      height: "24px",
      fontWeight: "bold",
      fontSize: "16px",
      color: "white"
    };

    if (step.selected) {
      return {
        ...baseStyle,
        backgroundColor: "#4945ff",
        color: "white",
        borderColor: "#007500",
      };
    }

    return baseStyle;
  };


  const stepsDisplay = newStep.map((step, index) => (
    <Layout>
      <ContentLayout>
        <div key={index} style={{display: "flex", alignItems: "center", paddingLeft:16,paddingRight:16}}>
          <div >
            <div style={stepCircleStyle(step)}>
              {step.completed ? <span>&#10003;</span> : index + 1}
            </div>
            <div style={{
              marginTop: "16px",
              textTransform: "uppercase",
              fontSize: "12px",
              color: step.highlighted ? "#4945ff" : "#888888"
            }}>
              {step.description}
            </div>
          </div>
          {index !== newStep.length - 1 &&
            <div style={{flex: 1, borderTop: step.completed ? "2px solid #007500" : "2px solid #888888"}}></div>}
        </div>
      </ContentLayout>
    </Layout>
  ));

  return (
    <div style={{margin: "0 auto", padding: "16px", display: "flex", justifyContent: "space-between", width: "100%"}}>
      {stepsDisplay}
    </div>
  );
};

  export default Stepper;
