import {useStepperContext} from "../../../contexts/StepperContext";

export const Details = () => {
  const { userData, setUserData } = useStepperContext();
  const handleChange = (e) => {
    const { name, value } = e.target;
    // @ts-ignore
    setUserData({ ...userData, [name]: value });
  };
  return (<>Details</>)
}
