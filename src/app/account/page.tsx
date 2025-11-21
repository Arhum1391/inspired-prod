'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';

const AccountPage = () => {
  const { isAuthenticated, user, login } = useAuth();
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }

    // Fetch user subscription, payment method, and billing history
    const fetchAccountData = async () => {
      try {
        const [subRes, pmRes, billingRes] = await Promise.all([
          fetch('/api/subscription/current', { credentials: 'include' }),
          fetch('/api/payment-method/current', { credentials: 'include' }),
          fetch('/api/billing-history', { credentials: 'include' })
        ]);

        if (subRes.ok) {
          const subData = await subRes.json();
          setSubscription(subData.subscription || null);
        } else {
          setSubscription(null);
        }

        if (pmRes.ok) {
          const pmData = await pmRes.json();
          setPaymentMethod(pmData.paymentMethod || null);
        } else {
          setPaymentMethod(null);
        }

        if (billingRes.ok) {
          const billingData = await billingRes.json();
          setBillingHistory(billingData.invoices || []);
        } else {
          setBillingHistory([]);
        }
      } catch (error) {
        console.error('Error fetching account data:', error);
        setSubscription(null);
        setPaymentMethod(null);
        setBillingHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [isAuthenticated, router]);

  if (!user) {
    return null;
  }

  const hasActiveSubscription = !!(
    subscription &&
    subscription.status &&
    ['active', 'trialing', 'past_due'].includes(subscription.status)
  );

  const planName = hasActiveSubscription ? subscription.planName : 'Free Plan';
  const planPrice = hasActiveSubscription
    ? subscription.displayPrice || subscription.price
    : 'Free';
  const planStatusClasses = hasActiveSubscription
    ? 'bg-[rgba(222,80,236,0.12)] border border-[#DE50EC]'
    : 'bg-[rgba(5,176,179,0.12)] border border-[#05B0B3]';
  const planStatusTextClasses = hasActiveSubscription
    ? 'text-[#DE50EC]'
    : 'text-[#05B0B3]';
  const planStatusLabel = hasActiveSubscription ? 'Active' : 'Free Access';

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/user/profile-picture', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      // Refresh user data from server
      const userResponse = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store',
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData.user) {
          login(userData.user);
        }
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Error uploading profile picture:', error);
      setUploadError(error.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      <Navbar />
      {/* Hidden file input for profile picture upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {/* Mobile Layout */}
      <div className="lg:hidden relative w-full pt-24 pb-24">
        <div className="max-w-[420px] mx-auto px-4 flex flex-col gap-10">
          {/* Profile Card */}
          <div className="relative bg-[#1F1F1F] rounded-[10px] p-5 flex flex-col gap-10 overflow-hidden">
            <div
              className="absolute pointer-events-none"
              style={{
                position: 'absolute',
                width: '588px',
                height: '588px',
                left: '339.5px',
                top: '-376px',
                background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                filter: 'blur(100px)',
                transform: 'rotate(90deg)',
                flex: 'none',
                order: 0,
                flexGrow: 0,
                zIndex: 0
              }}
            />

            <div className="relative z-10 flex flex-col gap-10">
              <h2 className="text-white text-[20px] font-normal leading-none gilroy-semibold">
                Profile Settings
              </h2>

              {/* Image Section */}
              <div className="flex flex-row items-center gap-4 w-full">
                <div className="relative w-[63px] h-[64px] flex-shrink-0">
                  <div className="absolute w-[64px] h-[64px] left-[-1px] top-0 rounded-full bg-[#D9D9D9] overflow-hidden">
                    {uploading ? (
                      <div className="w-full h-full flex items-center justify-center bg-[#D9D9D9]">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : user?.image ? (
                      <img 
                        src={user.image} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#D9D9D9]" />
                    )}
                  </div>
                  <button
                    onClick={handleImageClick}
                    disabled={uploading}
                    className="absolute right-0 bottom-0 w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute left-0 right-0 top-0 h-6 bg-white rounded-[32px]" />
                    <div className="absolute right-0 bottom-0 w-6 h-6 flex items-center justify-center">
                      <svg width="12.5" height="10" viewBox="0 0 12.5 10" fill="none" className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                        <rect x="2.5" y="2.5" width="7.5" height="5" rx="1" fill="#0A0A0A"/>
                        <circle cx="6.25" cy="5" r="1.5" fill="white"/>
                        <rect x="9.5" y="3.5" width="1.5" height="1" rx="0.25" fill="#0A0A0A"/>
                      </svg>
                    </div>
                  </button>
                </div>
                <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0">
                  <span className="text-white text-lg font-normal leading-[140%] tracking-[0.01em] gilroy-semibold w-full">
                    {user?.name || 'John Doe'}
                  </span>
                  <span className="text-[#656565] text-xs font-normal leading-[140%] tracking-[0.01em] gilroy-medium w-full">
                    {user?.email || 'John.doe24@gmail.com'}
                  </span>
                </div>
                <button 
                  className="hover:opacity-80 transition-opacity flex flex-row justify-center items-center flex-shrink-0"
                  style={{
                    boxSizing: 'border-box',
                    padding: '10px 16px',
                    gap: '8px',
                    width: '120px',
                    height: '38px',
                    background: '#FFFFFF',
                    border: '1px solid #FFFFFF',
                    borderRadius: '100px',
                    fontFamily: 'Gilroy-SemiBold',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '100%',
                    textAlign: 'center',
                    color: '#1F1F1F'
                  }}
                >
                  Edit Profile
                </button>
              </div>

              {uploadError && (
                <div className="text-red-400 text-sm gilroy-medium">
                  {uploadError}
                </div>
              )}

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-white text-sm font-normal gilroy-medium">
                    Full Name (optional)
                  </span>
                  <div className="w-full h-10 border border-white/30 rounded-lg flex items-center px-4">
                    <span className="text-white/60 text-sm gilroy-medium truncate">
                      {user?.name || 'John Doe'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white text-sm font-normal gilroy-medium">
                    Email
                  </span>
                  <div className="w-full h-10 border border-white/30 rounded-lg flex items-center px-4">
                    <span className="text-white/30 text-sm gilroy-medium truncate">
                      {user?.email || 'john.doe@example.com'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white text-sm font-normal gilroy-medium">
                    Password
                  </span>
                  <div className="w-full h-10 border border-white/30 rounded-lg flex items-center px-4">
                    <span className="text-white/30 text-sm gilroy-medium">
                      ••••••••
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Plan Card */}
          <div className="relative bg-[#1F1F1F] rounded-[10px] p-5 flex flex-col gap-8 overflow-hidden">
            <div
              className="absolute pointer-events-none"
              style={{
                position: 'absolute',
                width: '588px',
                height: '588px',
                left: '339.5px',
                top: '-326px',
                background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                filter: 'blur(100px)',
                transform: 'rotate(90deg)',
                flex: 'none',
                order: 0,
                flexGrow: 0,
                zIndex: 0
              }}
            />

            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex flex-row items-center justify-between gap-4">
                <h2 className="text-white text-[20px] font-normal leading-none gilroy-semibold">
                  Current Plan
                </h2>
                <div className={`flex flex-row justify-center items-center px-4 py-1.5 gap-2 rounded-full ${planStatusClasses}`}>
                  <span className={`${planStatusTextClasses} text-xs font-normal gilroy-medium text-center`}>
                    {planStatusLabel}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center justify-between gap-4">
                  <span className="text-white text-lg font-normal gilroy-semibold">
                    {planName}
                  </span>
                  <span className="text-[#D4D737] text-lg font-normal gilroy-semibold">
                    {planPrice}
                  </span>
                </div>
                {!hasActiveSubscription && (
                  <p className="text-white/60 text-sm font-normal gilroy-medium">
                    You have access to the free experience. Upgrade anytime to unlock premium research, tools, and community benefits.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push('/pricing')}
                  className="w-full bg-[#1F1F1F] border border-white text-white px-4 py-3 rounded-full text-sm font-normal gilroy-semibold text-center hover:opacity-80 transition-opacity"
                >
                  Change Plan
                </button>

                {hasActiveSubscription ? (
                  <>
                    {/* <button
                      onClick={() => router.push('/account/payment-method')}
                      className="w-full bg-[#1F1F1F] border border-white text-white px-4 py-3 rounded-full text-sm font-normal gilroy-semibold text-center hover:opacity-80 transition-opacity"
                    >
                      Update Payment
                    </button> */}
                    <button
                      onClick={() => router.push('/account/cancel-plan')}
                      className="w-full bg-[#1F1F1F] border border-white text-white px-4 py-3 rounded-full text-sm font-normal gilroy-semibold text-center hover:opacity-80 transition-opacity"
                    >
                      Cancel Plan
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => router.push('/pricing')}
                    className="w-full bg-white text-[#1F1F1F] px-4 py-3 rounded-full text-sm font-normal gilroy-semibold text-center hover:bg-gray-100 transition-colors"
                  >
                    Upgrade to Premium
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="relative bg-[#1F1F1F] rounded-[10px] p-5 flex flex-col gap-6 overflow-hidden w-full">
            <div className="relative z-10 flex flex-col gap-6 w-full">
              <div className="flex flex-row items-center justify-between gap-4 w-full">
                <h2 className="text-white text-[20px] font-normal leading-none gilroy-semibold">
                  Payment Method
                </h2>
                <button
                  onClick={() => hasActiveSubscription ? router.push('/account/payment-method') : router.push('/pricing')}
                  className="bg-white text-[#1F1F1F] px-3 py-2 rounded-full text-sm font-normal gilroy-semibold text-center hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  {hasActiveSubscription ? 'Update Payment' : 'Add Payment Method'}
                </button>
              </div>

              {paymentMethod ? (
                <div className="w-full border border-white/30 rounded-lg px-4 py-3 flex flex-row items-center gap-3">
                  <div className="w-10 h-6 bg-black/10 rounded-sm relative flex-shrink-0">
                    <div className="absolute inset-0 bg-[#0028FF] rounded-sm" style={{ margin: '1px' }} />
                    <div className="absolute left-1 top-1 right-1 h-1 bg-white rounded-sm" style={{ marginTop: '4px' }} />
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="text-white/60 text-sm gilroy-medium whitespace-nowrap">
                      •••• •••• •••• {paymentMethod.last4 || '4242'}
                    </span>
                    <span className="text-white/60 text-xs gilroy-medium whitespace-nowrap">
                      Expires {String(paymentMethod.expMonth || 12).padStart(2, '0')}/{String(paymentMethod.expYear || 2026).slice(-2)}
                    </span>
                  </div>
                  <div className="px-2 py-1 border border-[#05B0B3] bg-[rgba(5,176,179,0.12)] text-[#05B0B3] text-xs rounded-full flex-shrink-0 whitespace-nowrap">
                    Currently in Use
                  </div>
                </div>
              ) : (
                <div className="w-full border border-white/30 rounded-lg px-4 py-6 text-center text-white/50 text-sm">
                  No payment method on file
                </div>
              )}
            </div>
          </div>

          {/* Billing History */}
          <div
            className="relative bg-[#1F1F1F] rounded-[10px] w-full"
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '20px 12px',
              gap: '8px',
              flex: 'none',
              order: 2,
              flexGrow: 0
            }}
          >
            <div
              className="w-full"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '24px',
                flex: 'none',
                order: 0,
                alignSelf: 'stretch',
                flexGrow: 0
              }}
            >
              <div
                className="flex flex-row items-center w-full"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '24px',
                  height: '20px',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0
                }}
              >
                <div
                  className="flex-1"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '12px',
                    flex: 'none',
                    order: 0,
                    flexGrow: 1
                  }}
                >
                  <h2
                    className="text-white gilroy-semibold"
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '20px',
                      lineHeight: '100%',
                      color: '#FFFFFF',
                      flex: 'none',
                      order: 0,
                      flexGrow: 0
                    }}
                  >
                    Billing History
                  </h2>
                </div>
                <button
                  onClick={() => router.push('/account/billing-history')}
                  className="flex flex-row items-center gap-1 hover:opacity-80"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '0px',
                    gap: '4px',
                    width: '63px',
                    height: '17px',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0
                  }}
                >
                  <span
                    className="text-white gilroy-semibold"
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '12px',
                      lineHeight: '145%',
                      display: 'flex',
                      alignItems: 'center',
                      textAlign: 'center',
                      color: '#FFFFFF',
                      flex: 'none',
                      order: 0,
                      flexGrow: 0
                    }}
                  >
                    View All
                  </span>
                  <span
                    className="inline-block"
                    style={{
                      width: '16px',
                      height: '16px',
                      transform: 'rotate(-90deg)',
                      flex: 'none',
                      order: 1,
                      flexGrow: 0
                    }}
                  >
                    ➜
                  </span>
                </button>
              </div>

              <div className="flex flex-col gap-4 w-full">
                {billingHistory.length > 0 ? (
                  billingHistory.map((invoice: any) => {
                    const invoiceId = invoice.invoiceId || invoice.id || '';
                    const displayInvoiceId =
                      invoiceId && invoiceId.length > 12
                        ? `${invoiceId.slice(0, 10)}…`
                        : invoiceId || '—';

                    return (
                      <div
                        key={invoiceId || invoice.id}
                        className="border border-white/30 rounded-lg w-full"
                        style={{
                          boxSizing: 'border-box',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '16px 12px',
                          gap: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: '8px',
                          flex: 'none',
                          alignSelf: 'stretch',
                          flexGrow: 0
                        }}
                      >
                        <div
                          className="flex flex-row justify-between items-center w-full"
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0px',
                            gap: '16px',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0
                          }}
                        >
                          <div
                            className="flex flex-row items-center gap-2"
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              padding: '0px',
                              gap: '8px',
                              flex: 'none',
                              order: 0,
                              flexGrow: 1
                            }}
                          >
                            <span
                              className="text-white gilroy-medium"
                              style={{
                                fontFamily: 'Gilroy-Medium',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '100%',
                                color: '#FFFFFF',
                                flex: 'none',
                                order: 0,
                                flexGrow: 0
                              }}
                            >
                              Invoice Id :
                            </span>
                            <span
                              className="text-[#909090] gilroy-medium"
                              style={{
                                fontFamily: 'Gilroy-Medium',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '100%',
                                color: '#909090',
                                flex: 'none',
                                order: 1,
                                flexGrow: 0
                              }}
                              title={invoiceId}
                            >
                              {displayInvoiceId}
                            </span>
                          </div>
                          <div
                            className="border border-[#05B353] rounded-full"
                            style={{
                              boxSizing: 'border-box',
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '8px 10px',
                              gap: '10px',
                              width: '64px',
                              height: '24px',
                              background: 'rgba(5, 179, 83, 0.12)',
                              border: '1px solid #05B353',
                              borderRadius: '40px',
                              flex: 'none',
                              order: 1,
                              flexGrow: 0
                            }}
                          >
                            <span
                              className="text-[#05B353] gilroy-medium text-center"
                              style={{
                                fontFamily: 'Gilroy-Medium',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '12px',
                                lineHeight: '100%',
                                textAlign: 'center',
                                color: '#05B353',
                                flex: 'none',
                                order: 0,
                                flexGrow: 0
                              }}
                            >
                              {invoice.status === 'paid' ? 'Paid' : invoice.status}
                            </span>
                          </div>
                        </div>
                        <div
                          className="w-full border-t border-[#404040]"
                          style={{
                            width: '100%',
                            height: '0px',
                            border: '1px solid #404040',
                            flex: 'none',
                            order: 1,
                            alignSelf: 'stretch',
                            flexGrow: 0
                          }}
                        />
                        <div
                          className="flex flex-row justify-between items-center w-full"
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0px',
                            gap: '16px',
                            flex: 'none',
                            order: 2,
                            alignSelf: 'stretch',
                            flexGrow: 0
                          }}
                        >
                          <div
                            className="flex flex-row items-center gap-2"
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              padding: '0px',
                              gap: '8px',
                              flex: 'none',
                              order: 0,
                              flexGrow: 1
                            }}
                          >
                            <span
                              className="text-white gilroy-medium"
                              style={{
                                fontFamily: 'Gilroy-Medium',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '100%',
                                color: '#FFFFFF',
                                flex: 'none',
                                order: 0,
                                flexGrow: 0
                              }}
                            >
                              Date
                            </span>
                            <span
                              className="text-[#909090] gilroy-medium"
                              style={{
                                fontFamily: 'Gilroy-Medium',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '100%',
                                color: '#909090',
                                flex: 'none',
                                order: 1,
                                flexGrow: 0
                              }}
                            >
                              {new Date(invoice.paidAt || invoice.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div
                          className="flex flex-row justify-between items-center w-full"
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0px',
                            gap: '16px',
                            flex: 'none',
                            order: 3,
                            alignSelf: 'stretch',
                            flexGrow: 0
                          }}
                        >
                          <div
                            className="flex flex-row items-center gap-2"
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              padding: '0px',
                              gap: '8px',
                              flex: 'none',
                              order: 0,
                              flexGrow: 1
                            }}
                          >
                            <span
                              className="text-white gilroy-medium"
                              style={{
                                fontFamily: 'Gilroy-Medium',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '100%',
                                color: '#FFFFFF',
                                flex: 'none',
                                order: 0,
                                flexGrow: 0
                              }}
                            >
                              Amount
                            </span>
                            <span
                              className="text-[#909090] gilroy-medium"
                              style={{
                                fontFamily: 'Gilroy-Medium',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '100%',
                                color: '#909090',
                                flex: 'none',
                                order: 1,
                                flexGrow: 0
                              }}
                            >
                              {invoice.amount} {invoice.currency?.toUpperCase() || 'USD'}
                            </span>
                          </div>
                        </div>
                        {invoice.invoiceUrl && (
                          <>
                            <div
                              className="w-full border-t border-[#404040]"
                              style={{
                                width: '100%',
                                height: '0px',
                                border: '1px solid #404040',
                                flex: 'none',
                                order: 4,
                                alignSelf: 'stretch',
                                flexGrow: 0
                              }}
                            />
                            <a
                              href={invoice.invoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full bg-white text-[#0A0A0A] rounded-full flex flex-row justify-center items-center gap-1 hover:bg-gray-100 transition-colors"
                              style={{
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '10px 12px',
                                gap: '8px',
                                width: '100%',
                                height: '36px',
                                background: '#FFFFFF',
                                border: '1px solid #FFFFFF',
                                borderRadius: '100px',
                                flex: 'none',
                                order: 5,
                                alignSelf: 'stretch',
                                flexGrow: 0
                              }}
                            >
                              <div
                                className="relative"
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  flex: 'none',
                                  order: 0,
                                  flexGrow: 0
                                }}
                              >
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                                  <path d="M6 1V8M6 8L3 5M6 8L9 5" stroke="#0A0A0A" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M1 10H11" stroke="#0A0A0A" strokeWidth="1" strokeLinecap="round" />
                                </svg>
                              </div>
                              <span
                                className="text-[#0A0A0A] gilroy-semibold"
                                style={{
                                  fontFamily: 'Gilroy-SemiBold',
                                  fontStyle: 'normal',
                                  fontWeight: 400,
                                  fontSize: '14px',
                                  lineHeight: '100%',
                                  color: '#0A0A0A',
                                  flex: 'none',
                                  order: 1,
                                  flexGrow: 0
                                }}
                              >
                                PDF
                              </span>
                            </a>
                          </>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div
                    className="border border-white/30 rounded-lg w-full"
                    style={{
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '16px 12px',
                      gap: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      flex: 'none',
                      alignSelf: 'stretch',
                      flexGrow: 0
                    }}
                  >
                    <div className="text-white/50 text-sm text-center">
                      No billing history available yet
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <div className="w-full max-w-[846px] flex flex-col items-center">
          {/* Profile Card */}
          <div className="relative w-full max-w-[846px] bg-[#1F1F1F] rounded-2xl p-6 mt-24 flex flex-col items-center gap-4 overflow-hidden">
            <div
              className="absolute pointer-events-none"
              style={{
                position: 'absolute',
                width: '508px',
                height: '508px',
                left: '779.5px',
                top: '-396px',
                background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                filter: 'blur(100px)',
                transform: 'rotate(90deg)',
                zIndex: 0
              }}
            />

            <div className="relative z-10 w-full flex flex-col items-start gap-10">
              <h1 className="text-white text-4xl font-normal leading-none gilroy-semibold">
                Profile Settings
              </h1>

              {/* Image Section */}
              <div className="flex flex-row items-center gap-4 w-full h-16 relative">
                <div className="relative w-[63px] h-16 flex-shrink-0">
                  <div className="absolute w-16 h-16 left-[-1px] top-0 rounded-full bg-[#D9D9D9] overflow-hidden">
                    {uploading ? (
                      <div className="w-full h-full flex items-center justify-center bg-[#D9D9D9]">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : user?.image ? (
                      <img 
                        src={user.image} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#D9D9D9]" />
                    )}
                  </div>
                  <button
                    onClick={handleImageClick}
                    disabled={uploading}
                    className="absolute right-0 bottom-0 w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute left-0 right-0 top-0 h-6 bg-white rounded-[32px]" />
                    <div className="absolute right-0 bottom-0 w-6 h-6 flex items-center justify-center">
                      <svg width="12.5" height="10" viewBox="0 0 12.5 10" fill="none" className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                        <rect x="2.5" y="2.5" width="7.5" height="5" rx="1" fill="#0A0A0A"/>
                        <circle cx="6.25" cy="5" r="1.5" fill="white"/>
                        <rect x="9.5" y="3.5" width="1.5" height="1" rx="0.25" fill="#0A0A0A"/>
                      </svg>
                    </div>
                  </button>
                </div>
                <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0">
                  <span className="text-white text-lg font-normal leading-[140%] tracking-[0.01em] gilroy-semibold w-full">
                    {user?.name || 'John Doe'}
                  </span>
                  <span className="text-[#656565] text-xs font-normal leading-[140%] tracking-[0.01em] gilroy-medium w-full">
                    {user?.email || 'John.doe24@gmail.com'}
                  </span>
                </div>
                <button 
                  className="hover:opacity-80 transition-opacity flex flex-row justify-center items-center flex-shrink-0 absolute right-0"
                  style={{
                    boxSizing: 'border-box',
                    padding: '10px 16px',
                    gap: '8px',
                    width: '120px',
                    height: '38px',
                    background: '#FFFFFF',
                    border: '1px solid #FFFFFF',
                    borderRadius: '100px',
                    fontFamily: 'Gilroy-SemiBold',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '100%',
                    textAlign: 'center',
                    color: '#1F1F1F'
                  }}
                >
                  Edit Profile
                </button>
              </div>

              {uploadError && (
                <div className="text-red-400 text-sm gilroy-medium">
                  {uploadError}
                </div>
              )}

              <div className="w-full flex flex-col items-start gap-6">
                <div className="w-full flex flex-col sm:flex-row items-start gap-6">
                  <div className="w-full sm:w-1/2 flex flex-col items-start gap-1">
                    <label className="text-white text-sm font-normal gilroy-medium">
                      Full Name (optional)
                    </label>
                    <CustomInput
                      type="text"
                      placeholder="John Doe"
                      defaultValue={user?.name || ''}
                    />
                  </div>

                  <div className="w-full sm:w-1/2 flex flex-col items-start gap-1">
                    <label className="text-white text-sm font-normal gilroy-medium">
                      Email
                    </label>
                    <CustomInput
                      type="email"
                      placeholder="John.doe24@gmail.com"
                      defaultValue={user?.email || ''}
                      readOnly
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col items-start gap-1">
                  <label className="text-white text-sm font-normal gilroy-medium">
                    Password
                  </label>
                  <CustomInput type="password" placeholder="••••••••" />
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Plan Card */}
          <div className="relative w-full max-w-[846px] bg-[#1F1F1F] rounded-2xl p-6 flex flex-col items-center gap-8 overflow-hidden mt-16">
            <div
              className="absolute pointer-events-none"
              style={{
                position: 'absolute',
                width: '508px',
                height: '508px',
                left: '779.5px',
                top: '-396px',
                background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                filter: 'blur(100px)',
                transform: 'rotate(90deg)',
                zIndex: 0
              }}
            />

            <div className="relative z-10 w-full flex flex-col items-start gap-10">
              <div className="w-full flex flex-col items-start gap-4">
                <div className="w-full flex flex-row items-center justify-between gap-6">
                  <div className="flex flex-col items-start gap-3 flex-1">
                    <h2 className="text-white text-4xl font-normal leading-none gilroy-semibold">
                      Current Plan
                    </h2>
                  </div>

                  <div className={`flex flex-row justify-center items-center px-6 py-1.5 gap-2.5 rounded-full ${planStatusClasses}`}>
                    <span className={`${planStatusTextClasses} text-xs font-normal gilroy-medium text-center`}>
                      {planStatusLabel}
                    </span>
                  </div>
                </div>

                <div className="w-full flex flex-row items-start justify-between gap-3">
                  <span className="text-white text-xl font-normal gilroy-semibold flex-1">
                    {planName}
                  </span>
                  <span className="text-[#D4D737] text-2xl font-normal gilroy-semibold">
                    {planPrice}
                  </span>
                </div>
              </div>

              {!hasActiveSubscription && (
                <p className="text-white/60 text-sm font-normal gilroy-medium">
                  You have access to the free experience. Upgrade anytime to unlock premium research, tools, and community benefits.
                </p>
              )}

              <div className="w-full flex flex-row items-start gap-6">
                <CustomButton
                  onClick={() => router.push('/pricing')}
                  className="hover:opacity-80 transition-opacity bg-[#1F1F1F] border border-white text-white px-4 py-3 rounded-full text-sm font-normal gilroy-semibold text-center flex-1"
                >
                  Change Plan
                </CustomButton>

                {hasActiveSubscription ? (
                  <>
                    {/* <CustomButton
                      onClick={() => router.push('/account/payment-method')}
                      className="hover:opacity-80 transition-opacity bg-[#1F1F1F] border border-white text-white px-4 py-3 rounded-full text-sm font-normal gilroy-semibold text-center flex-1"
                    >
                      Update Payment
                    </CustomButton> */}

                    <CustomButton
                      onClick={() => router.push('/account/cancel-plan')}
                      className="hover:opacity-80 transition-opacity bg-[#1F1F1F] border border-white text-white px-4 py-3 rounded-full text-sm font-normal gilroy-semibold text-center flex-1"
                    >
                      Cancel Plan
                    </CustomButton>
                  </>
                ) : (
                  <CustomButton
                    onClick={() => router.push('/pricing')}
                    className="hover:opacity-80 transition-opacity bg-white text-[#1F1F1F] px-4 py-3 rounded-full text-sm font-normal gilroy-semibold text-center flex-1"
                  >
                    Upgrade to Premium
                  </CustomButton>
                )}
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="relative w-full max-w-[846px] bg-[#1F1F1F] rounded-2xl p-6 flex flex-col items-center gap-8 mt-16 overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: '16px',
                background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                padding: '1px',
                zIndex: 1
              }}
            >
              <div
                className="w-full h-full rounded-[15px]"
                style={{
                  background: '#1F1F1F'
                }}
              ></div>
            </div>

            <div className="relative z-10 w-full flex flex-col items-start gap-10">
              <div className="w-full flex flex-col items-start gap-4">
                <div className="w-full flex flex-row items-center justify-between gap-6">
                  <div className="flex flex-col items-start gap-3 flex-1">
                    <h2 className="text-white text-4xl font-normal leading-none gilroy-semibold">
                      Payment Method
                    </h2>
                  </div>

                  <CustomButton
                    onClick={() => (hasActiveSubscription ? router.push('/account/payment-method') : router.push('/pricing'))}
                    className="hover:opacity-80 transition-opacity bg-white text-[#1F1F1F] px-4 py-2.5 rounded-full text-sm font-normal gilroy-semibold text-center"
                  >
                    {hasActiveSubscription ? 'Update Payment' : 'Add Payment Method'}
                  </CustomButton>
                </div>

                {paymentMethod ? (
                  <div className="w-full border border-white/30 rounded-lg p-4 flex flex-row items-center gap-4">
                    <div className="w-10 h-6 bg-black/5 relative flex-shrink-0">
                      <div className="absolute inset-0 bg-[#0028FF] rounded-sm" />
                      <div className="absolute left-1 top-1 right-1 h-1 bg-white rounded-sm" />
                    </div>

                    <div className="flex flex-col justify-center items-start gap-2 flex-1">
                      <span className="text-white/30 text-sm font-normal gilroy-medium">
                        •••• •••• •••• {paymentMethod.last4 || '4242'}
                      </span>
                      <span className="text-white/30 text-xs font-normal gilroy-medium">
                        Expires {String(paymentMethod.expMonth || 12).padStart(2, '0')}/{String(paymentMethod.expYear || 2026).slice(-2)}
                      </span>
                    </div>

                    <div className="flex flex-row justify-center items-center px-2.5 py-1.5 gap-2.5 bg-[rgba(5,176,179,0.12)] border border-[#05B0B3] rounded-full">
                      <span className="text-[#05B0B3] text-xs font-normal gilroy-medium text-center">
                        Currently in Use
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full border border-white/30 rounded-lg p-4">
                    <p className="text-white/50 text-sm">No payment method on file</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Billing History Card */}
          <div className="relative w-full max-w-[846px] bg-[#1F1F1F] rounded-2xl p-6 flex flex-col items-center gap-8 mt-16 mb-32 overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: '16px',
                background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                padding: '1px',
                zIndex: 1
              }}
            >
              <div
                className="w-full h-full rounded-[15px]"
                style={{
                  background: '#1F1F1F'
                }}
              ></div>
            </div>

            <div className="relative z-10 w-full flex flex-col items-start gap-10">
              <div className="w-full flex flex-col items-start gap-4">
                <h2 className="text-white text-4xl font-normal leading-none gilroy-semibold">
                  Billing History
                </h2>
              </div>

              <div className="w-full flex flex-col items-start gap-3">
                <div className="w-full border border-white/30 rounded-lg p-4 flex flex-row items-center gap-6">
                  <div className="w-[134px] flex flex-col justify-center items-center">
                    <span className="text-white text-sm font-normal gilroy-medium text-center">
                      Invoice ID
                    </span>
                  </div>
                  <div className="w-[134px] flex flex-col justify-center items-start">
                    <span className="text-white text-sm font-normal gilroy-medium text-center">
                      Date
                    </span>
                  </div>
                  <div className="w-[134px] flex flex-col justify-center items-start">
                    <span className="text-white text-sm font-normal gilroy-medium text-center">
                      Amount
                    </span>
                  </div>
                  <div className="w-[134px] flex flex-col justify-center items-center">
                    <span className="text-white text-sm font-normal gilroy-medium text-center">
                      Status
                    </span>
                  </div>
                  <div className="w-[134px] flex flex-col justify-center items-center">
                    <span className="text-white text-sm font-normal gilroy-medium text-center">
                      Download
                    </span>
                  </div>
                </div>

                {billingHistory.length > 0 ? (
                  billingHistory.map((invoice: any) => {
                    const invoiceId = invoice.invoiceId || invoice.id || '';
                    const displayInvoiceId =
                      invoiceId && invoiceId.length > 12
                        ? `${invoiceId.slice(0, 10)}…`
                        : invoiceId || '—';

                    return (
                      <div key={invoiceId || invoice.id} className="w-full border border-white/30 rounded-lg p-4 flex flex-row items-center gap-6">
                        <div className="w-[134px] flex flex-col justify-center items-center">
                          <span className="text-white text-sm font-normal gilroy-medium text-center">
                            <span title={invoiceId}>{displayInvoiceId}</span>
                          </span>
                        </div>
                        <div className="w-[134px] flex flex-col justify-center items-start">
                          <span className="text-white text-sm font-normal gilroy-medium">
                            {new Date(invoice.paidAt || invoice.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="w-[134px] flex flex-col justify-center items-start">
                          <span className="text-white text-sm font-normal gilroy-medium">
                            {invoice.amount} {invoice.currency?.toUpperCase() || 'USD'}
                          </span>
                        </div>
                        <div className="w-[134px] flex flex-col justify-center items-center">
                          <span className="text-[#05B0B3] text-xs font-normal gilroy-medium text-center px-2.5 py-1.5 bg-[rgba(5,176,179,0.12)] border border-[#05B0B3] rounded-full">
                            {invoice.status === 'paid' ? 'Paid' : invoice.status}
                          </span>
                        </div>
                        <div className="w-[134px] flex flex-col justify-center items-center">
                          {invoice.invoiceUrl && (
                            <a
                              href={invoice.invoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white text-sm font-normal gilroy-medium hover:opacity-80 underline"
                            >
                              PDF
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full">
                    <p className="text-white/50 text-sm text-center py-8">
                      No billing history available yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AccountPage;

