import {useStepperContext} from "../../../contexts/StepperContext";

export const Details = () => {
  const { userData, setUserData } = useStepperContext();
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    // @ts-ignore
    setUserData({ ...userData, [name]: value });
  };
  return (<>Details</>)
}
