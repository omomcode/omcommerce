export interface IPaypalSetup {
  id: number;
  live_paypal_client_id: string;
  live_paypal_client_secret: string;
  sandbox_paypal_client_id: string;
  sandbox_paypal_client_secret: string;
  live: boolean;
}
