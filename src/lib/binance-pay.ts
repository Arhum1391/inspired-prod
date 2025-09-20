import crypto from 'crypto';
import axios from 'axios';

interface BinancePayConfig {
  apiKey: string;
  secretKey: string;
  certId: string;
  environment: 'sandbox' | 'production';
}

interface CreateOrderRequest {
  merchantTradeNo: string;
  orderAmount: number;
  currency: string;
  goods: {
    goodsType: string;
    goodsCategory: string;
    referenceGoodsId: string;
    goodsName: string;
    goodsDetail: string;
  };
}

interface CreateOrderResponse {
  status: string;
  code: string;
  data: {
    prepayId: string;
    terminalType: string;
    expireTime: number;
    qrcodeLink: string;
    qrContent: string;
    checkoutUrl: string;
    deeplink: string;
    universalUrl: string;
  };
}

export class BinancePayClient {
  private config: BinancePayConfig;
  private baseUrl = 'https://bpay.binanceapi.com';

  constructor(config: BinancePayConfig) {
    this.config = config;
  }

  private generateSignature(timestamp: string, nonce: string, body: string): string {
    const payload = `${timestamp}\n${nonce}\n${body}\n`;

    return crypto
      .createSign('sha256')
      .update(payload)
      .sign(this.config.secretKey, 'base64');
  }

  private generateHeaders(body: string) {
    const timestamp = Date.now().toString();
    const nonce = crypto.randomBytes(16).toString('hex');
    const signature = this.generateSignature(timestamp, nonce, body);

    return {
      'Content-Type': 'application/json',
      'BinancePay-Timestamp': timestamp,
      'BinancePay-Nonce': nonce,
      'BinancePay-Certificate-SN': this.config.certId,
      'BinancePay-Signature': signature,
    };
  }

  async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    const body = JSON.stringify(orderData);
    const headers = this.generateHeaders(body);

    try {
      const response = await axios.post(
        `${this.baseUrl}/binancepay/openapi/v2/order`,
        orderData,
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error('Binance Pay API Error:', error);
      throw error;
    }
  }

  async queryOrder(merchantTradeNo: string) {
    const body = JSON.stringify({ merchantTradeNo });
    const headers = this.generateHeaders(body);

    try {
      const response = await axios.post(
        `${this.baseUrl}/binancepay/openapi/v2/order/query`,
        { merchantTradeNo },
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error('Binance Pay Query Error:', error);
      throw error;
    }
  }

  verifyWebhookSignature(timestamp: string, nonce: string, body: string, signature: string): boolean {
    const expectedSignature = this.generateSignature(timestamp, nonce, body);
    return signature === expectedSignature;
  }
}

// Initialize client
export const binancePayClient = new BinancePayClient({
  apiKey: process.env.BINANCE_PAY_API_KEY!,
  secretKey: process.env.BINANCE_PAY_SECRET_KEY!,
  certId: process.env.BINANCE_PAY_CERT_ID!,
  environment: (process.env.BINANCE_PAY_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox'
});