'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AccountPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      <Navbar />
      
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <div className="w-full max-w-[846px] flex flex-col items-center">
          {/* Profile Card */}
          <div className="relative w-full max-w-[846px] bg-[#1F1F1F] rounded-2xl p-6 mt-24 flex flex-col items-center gap-4 overflow-hidden">
            {/* Background Gradient Ellipse */}
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
                flex: 'none',
                order: 0,
                flexGrow: 0,
                zIndex: 0
              }}
            />

            {/* Main Content Container */}
            <div className="relative z-10 w-full flex flex-col items-start gap-10">
              {/* Header Section */}
              <div className="w-full flex flex-row items-start justify-between gap-6">
                {/* Title Section */}
                <div className="flex flex-col items-start gap-3 flex-1">
                  <h1 className="text-white text-4xl font-normal leading-none gilroy-semibold">
                    Profile Settings
                  </h1>
                </div>

                {/* Edit Profile Button */}
                <button className="hover:opacity-80 transition-opacity bg-white text-[#1F1F1F] px-4 py-2.5 rounded-full text-sm font-normal gilroy-semibold whitespace-nowrap">
                  Edit Profile
                </button>
              </div>

              {/* Form Section */}
              <div className="w-full flex flex-col items-start gap-6">
                {/* Name and Email Row */}
                <div className="w-full flex flex-col sm:flex-row items-start gap-6">
                  {/* Full Name Field */}
                  <div className="w-full sm:w-1/2 flex flex-col items-start gap-1">
                    <label className="text-white text-sm font-normal gilroy-medium">
                      Full Name (optional)
                    </label>
                    <div className="w-full h-10 border border-white/30 rounded-lg flex items-center px-4 focus-within:border-white/30">
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 text-sm font-normal gilroy-medium focus:outline-none focus:ring-0 focus:border-none focus:shadow-none focus:ring-transparent focus:ring-offset-0"
                        style={{ boxShadow: 'none', border: 'none', outline: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="w-full sm:w-1/2 flex flex-col items-start gap-1">
                    <label className="text-white text-sm font-normal gilroy-medium">
                      Email
                    </label>
                    <div className="w-full h-10 border border-white/30 rounded-lg flex items-center px-4 focus-within:border-white/30">
                      <input
                        type="email"
                        placeholder="John.doe24@gmail.com"
                        className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 text-sm font-normal gilroy-medium focus:outline-none focus:ring-0 focus:border-none focus:shadow-none focus:ring-transparent focus:ring-offset-0"
                        style={{ boxShadow: 'none', border: 'none', outline: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="w-full flex flex-col items-start gap-1">
                  <label className="text-white text-sm font-normal gilroy-medium">
                    Password
                  </label>
                  <div className="w-full h-10 border border-white/30 rounded-lg flex items-center px-4 focus-within:border-white/30">
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 text-sm font-normal gilroy-medium focus:outline-none focus:ring-0 focus:border-none focus:shadow-none focus:ring-transparent focus:ring-offset-0"
                      style={{ boxShadow: 'none', border: 'none', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Card - Subscription Plan */}
          <div className="relative w-full max-w-[846px] bg-[#1F1F1F] rounded-2xl p-6 flex flex-col items-center gap-8 overflow-hidden mt-16">
            {/* Background Gradient Ellipse */}
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
                flex: 'none',
                order: 0,
                flexGrow: 0,
                zIndex: 0
              }}
            />

            {/* Main Content Container */}
            <div className="relative z-10 w-full flex flex-col items-start gap-10">
              {/* Header Section */}
              <div className="w-full flex flex-col items-start gap-4">
                {/* Title and Status Row */}
                <div className="w-full flex flex-row items-center justify-between gap-6">
                  {/* Title Section */}
                  <div className="flex flex-col items-start gap-3 flex-1">
                    <h2 className="text-white text-4xl font-normal leading-none gilroy-semibold">
                      Current Plan
                    </h2>
                  </div>

                  {/* Active Status Badge */}
                  <div className="flex flex-row justify-center items-center px-6 py-1.5 gap-2.5 bg-[rgba(222,80,236,0.12)] border border-[#DE50EC] rounded-full">
                    <span className="text-[#DE50EC] text-xs font-normal gilroy-medium text-center">
                      Active
                    </span>
                  </div>
                </div>

                {/* Plan Details Row */}
                <div className="w-full flex flex-row items-start justify-between gap-3">
                  <span className="text-white text-xl font-normal gilroy-semibold flex-1">
                    Premium Monthly
                  </span>
                  <span className="text-[#D4D737] text-2xl font-normal gilroy-semibold">
                    30 BNB /month
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full flex flex-row items-start gap-6">
                {/* Change Plan Button */}
                <button className="hover:opacity-80 transition-opacity bg-[#1F1F1F] border border-white text-white px-4 py-3 rounded-full text-sm font-normal gilroy-semibold text-center flex-1">
                  Change Plan
                </button>

                {/* Update Payment Button */}
                <button 
                  onClick={() => router.push('/account/payment-method')}
                  className="hover:opacity-80 transition-opacity bg-[#1F1F1F] border border-white text-white px-4 py-3 rounded-full text-sm font-normal gilroy-semibold text-center flex-1"
                >
                  Update Payment
                </button>

                {/* Cancel Plan Button */}
                <button 
                  onClick={() => router.push('/account/cancel-plan')}
                  className="hover:opacity-80 transition-opacity bg-[#1F1F1F] border border-white text-white px-4 py-3 rounded-full text-sm font-normal gilroy-semibold text-center flex-1"
                >
                  Cancel Plan
                </button>
              </div>
            </div>
          </div>

          {/* Third Card - Payment Method */}
          <div className="relative w-full max-w-[846px] bg-[#1F1F1F] rounded-2xl p-6 flex flex-col items-center gap-8 mt-16 overflow-hidden">
            {/* Curved Gradient Border */}
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

            {/* Main Content Container */}
            <div className="relative z-10 w-full flex flex-col items-start gap-10">
              {/* Header Section */}
              <div className="w-full flex flex-col items-start gap-4">
                {/* Title and Update Button Row */}
                <div className="w-full flex flex-row items-center justify-between gap-6">
                  {/* Title Section */}
                  <div className="flex flex-col items-start gap-3 flex-1">
                    <h2 className="text-white text-4xl font-normal leading-none gilroy-semibold">
                      Payment Method
                    </h2>
                  </div>

                  {/* Update Payment Button */}
                  <button 
                    onClick={() => router.push('/account/payment-method')}
                    className="hover:opacity-80 transition-opacity bg-white text-[#1F1F1F] px-4 py-2.5 rounded-full text-sm font-normal gilroy-semibold text-center"
                  >
                    Update Payment
                  </button>
                </div>

                {/* Payment Card Details */}
                <div className="w-full border border-white/30 rounded-lg p-4 flex flex-row items-center gap-4">
                  {/* Card Icon */}
                  <div className="w-10 h-6 bg-black/5 relative flex-shrink-0">
                    {/* Card background */}
                    <div className="absolute inset-0 bg-[#0028FF] rounded-sm" />
                    {/* Card stripes */}
                    <div className="absolute left-1 top-1 right-1 h-1 bg-white rounded-sm" />
                  </div>

                  {/* Card Details */}
                  <div className="flex flex-col justify-center items-start gap-2 flex-1">
                    <span className="text-white/30 text-sm font-normal gilroy-medium">
                      •••• •••• •••• 4242
                    </span>
                    <span className="text-white/30 text-xs font-normal gilroy-medium">
                      Expires 12/26
                    </span>
                  </div>

                  {/* Currently in Use Badge */}
                  <div className="flex flex-row justify-center items-center px-2.5 py-1.5 gap-2.5 bg-[rgba(5,176,179,0.12)] border border-[#05B0B3] rounded-full">
                    <span className="text-[#05B0B3] text-xs font-normal gilroy-medium text-center">
                      Currently in Use
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fourth Card - Billing History */}
          <div className="relative w-full max-w-[846px] bg-[#1F1F1F] rounded-2xl p-6 flex flex-col items-center gap-8 mt-16 mb-32 overflow-hidden">
            {/* Curved Gradient Border */}
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

            {/* Main Content Container */}
            <div className="relative z-10 w-full flex flex-col items-start gap-10">
              {/* Header Section */}
              <div className="w-full flex flex-col items-start gap-4">
                <h2 className="text-white text-4xl font-normal leading-none gilroy-semibold">
                  Billing History
                </h2>
              </div>

              {/* Billing Table */}
              <div className="w-full flex flex-col items-start gap-3">
                {/* Table Header */}
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

                {/* Table Rows */}
                {[
                  { id: 'INV-001', date: '01/05/2023', amount: '30 BNB', status: 'Paid' },
                  { id: 'INV-002', date: '01/06/2023', amount: '30 BNB', status: 'Paid' },
                  { id: 'INV-003', date: '01/07/2023', amount: '30 BNB', status: 'Paid' },
                  { id: 'INV-004', date: '01/08/2023', amount: '30 BNB', status: 'Paid' },
                  { id: 'INV-005', date: '01/09/2023', amount: '30 BNB', status: 'Paid' },
                  { id: 'INV-006', date: '01/10/2023', amount: '30 BNB', status: 'Paid' },
                  { id: 'INV-007', date: '01/11/2023', amount: '30 BNB', status: 'Paid' },
                  { id: 'INV-008', date: '01/12/2023', amount: '30 BNB', status: 'Paid' },
                  { id: 'INV-009', date: '01/01/2024', amount: '30 BNB', status: 'Paid' },
                  { id: 'INV-010', date: '01/02/2024', amount: '30 BNB', status: 'Paid' }
                ].map((invoice, index) => (
                  <div key={index} className="w-full border border-white/10 rounded-lg p-4 flex flex-row items-center gap-6">
                    <div className="w-[134px] flex flex-col justify-center items-start">
                      <span className="text-[#909090] text-sm font-normal gilroy-medium text-center">
                        {invoice.id}
                      </span>
                    </div>
                    <div className="w-[134px] flex flex-col justify-center items-start">
                      <span className="text-[#909090] text-sm font-normal gilroy-medium text-center">
                        {invoice.date}
                      </span>
                    </div>
                    <div className="w-[134px] flex flex-col justify-center items-start">
                      <span className="text-[#909090] text-sm font-normal gilroy-medium text-center">
                        {invoice.amount}
                      </span>
                    </div>
                    <div className="w-[134px] flex flex-col justify-center items-center">
                      <div className="flex flex-row justify-center items-center px-5 py-1 gap-2.5 bg-[rgba(5,179,83,0.12)] border border-[#05B353] rounded-full">
                        <span className="text-[#05B353] text-xs font-normal gilroy-medium text-center">
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                    <div className="w-[134px] flex flex-row justify-center items-center gap-1">
                      <div className="w-4 h-4 relative">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <path d="M6 1V8M6 8L3 5M6 8L9 5" stroke="#909090" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-[#909090] text-sm font-normal gilroy-medium">
                        PDF
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="w-full flex flex-row justify-between items-center gap-6">
                <span className="text-[#909090] text-sm font-normal gilroy-medium">
                  10 of 100
                </span>
                <div className="flex flex-row items-start gap-2">
                  <button className="w-8 h-8 bg-[#667EEA] border border-[#667EEA] rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-normal gilroy-medium">1</span>
                  </button>
                  <button className="w-8 h-8 border border-[#909090] rounded-lg flex items-center justify-center">
                    <span className="text-[#909090] text-sm font-normal gilroy-medium">2</span>
                  </button>
                  <button className="w-8 h-8 border border-[#909090] rounded-lg flex items-center justify-center">
                    <span className="text-[#909090] text-sm font-normal gilroy-medium">3</span>
                  </button>
                  <button className="w-8 h-8 border border-[#909090] rounded-lg flex items-center justify-center">
                    <span className="text-[#909090] text-sm font-normal gilroy-medium">4</span>
                  </button>
                  <button className="w-8 h-8 border border-[#909090] rounded-lg flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="transform rotate-90">
                      <path d="M5 1L9 5L5 9" stroke="#909090" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AccountPage;
