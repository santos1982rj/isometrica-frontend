import { api } from '../../core/api/client';

type CreatePreferenceResponse = {
  preference: {
    preferenceId: string;
    checkoutUrl: string;
  };
};

export type TransparentPaymentFormData = {
  token?: string;
  installments?: number;
  transaction_amount?: number;
  payment_method_id: string;
  issuer_id?: string | null;
  payer: {
    email: string;
    identification?: {
      type?: string;
      number?: string;
    };
    [key: string]: unknown;
  };
  metadata?: object;
  transaction_details?: object;
  additional_info?: object;
};

type ProcessTransparentPaymentInput = TransparentPaymentFormData & {
  courseId: string;
  paymentAttemptId: string;
};

export type TransparentPaymentResult = {
  paymentId: string;
  paymentStatus: string;
  statusDetail: string | null;
  transactionAmount: number;
  instructions: {
    pixQrCode: string | null;
    pixQrCodeBase64: string | null;
    ticketUrl: string | null;
  };
  persisted: {
    ignored: boolean;
    transactionId?: string;
    status?: string;
    reason?: string;
  };
};

export async function createPaymentPreference(courseId: string) {
  const response = await api.post<CreatePreferenceResponse>(
    '/payments/preferences',
    { courseId },
  );

  return response.data.preference;
}

export async function processTransparentPayment(
  data: ProcessTransparentPaymentInput,
) {
  const response = await api.post<{ payment: TransparentPaymentResult }>('/payments/process', {
    ...data,
  });

  return response.data.payment;
}
