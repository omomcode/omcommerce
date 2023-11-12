
import React, {ChangeEvent, useState} from 'react';

import Billing from "../../components/Settings/Billing/Billing";
import Profile from "../../components/Settings/Profile/Profile";
import Currency from "../../components/Settings/Currency/Currency";
import Timezone from "../../components/Settings/Timezone/Timezone";
import Gmail from "../../components/Settings/Gmail/Gmail";
import Conversion from "../../components/Settings/Conversion/Conversion";

const SettingsPage = () => {


 return (
   <>
     <Profile />
     <Billing />
     <Currency />
     <Conversion/>
     <Timezone />
     <Gmail/>
  </>


 );
};

export default SettingsPage;
