import ShippingZones from "../../components/Shipping/ShippingZones/ShippingZones";
import Taxes from "../../components/Tax/Taxes/Taxes";
import Legal from "../../components/Settings/Legal/Legal"
import {useEffect, useState} from "react";
import {IPaypalSetup} from "../../../../types/paypalsetup";
import paypalSetupRequests from "../../api/paypalsetup";

const initialPaymentData: IPaypalSetup = {
  id: 1,
  live_paypal_client_id: '',
  live_paypal_client_secret: '',
  sandbox_paypal_client_id: '',
  sandbox_paypal_client_secret: '',
  live: false,
  paypalSelected: false,
  payProGlobalSelected: false,
  paymentThreeSelected: false
};

const AdditionalSettingsPage = () => {

  const [payments, setPayments] = useState<IPaypalSetup>(initialPaymentData);

  useEffect(() => {
    fetchData().then((r) => console.log(r));
  }, []);

  const fetchData = async () => {
    try {
      const pays: any = await paypalSetupRequests.getAllPaypalSetups();
      setPayments(pays);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <>
      {payments?.paypalSelected && <ShippingZones/>}
      {payments?.paypalSelected && <Taxes/>}
      <Legal/>
    </>
  );
}

export default AdditionalSettingsPage;
