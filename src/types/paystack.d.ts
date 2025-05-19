
interface PaystackPopInterface {
  setup(options: {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    ref?: string;
    onClose: () => void;
    callback: (response: PaystackResponse) => void;
    [key: string]: any;
  }): {
    openIframe: () => void;
  };
}

interface PaystackResponse {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  message: string;
  [key: string]: any;
}

declare global {
  interface Window {
    PaystackPop: PaystackPopInterface;
  }
}

export {};
