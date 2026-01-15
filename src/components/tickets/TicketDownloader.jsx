import { useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';

const TicketDownloader = ({ ticket, onClose }) => {
  const ticketRef = useRef(null);
  const qrCodeRef = useRef(null);

  // Generate QR code when component mounts
  useEffect(() => {
    if (qrCodeRef.current) {
      // Create ticket data for QR code
      const ticketData = JSON.stringify({
        ticketId: ticket._id,
        eventId: ticket.event._id,
        eventTitle: ticket.event.title,
        ticketType: ticket.ticketType,
        quantity: ticket.quantity,
        bookingDate: ticket.bookingDate,
      });

      QRCode.toCanvas(qrCodeRef.current, ticketData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
    }
  }, [ticket]);

  const downloadTicket = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
      });

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ticket-${ticket.event.title.replace(/\s+/g, '-')}-${ticket._id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error('Error generating ticket:', error);
      alert('Failed to download ticket. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">Download Ticket</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Ticket Preview */}
        <div className="p-6">
          <div
            ref={ticketRef}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #9333ea 100%)',
              borderRadius: '16px',
              overflow: 'hidden',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {/* Top Section - White Background */}
            <div style={{ backgroundColor: '#ffffff', padding: '32px' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: '#e0e7ff',
                    color: '#4338ca',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '12px'
                  }}>
                    {ticket.event.category || 'Event'}
                  </div>
                  <h1 style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '8px',
                    lineHeight: '1.2'
                  }}>
                    {ticket.event.title}
                  </h1>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>
                    Ticket ID: #{ticket._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <div style={{
                    backgroundColor: '#d1fae5',
                    color: '#065f46',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    letterSpacing: '0.5px'
                  }}>
                    CONFIRMED
                  </div>
                </div>
              </div>

              {/* Event Details Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '20px'
              }}>
                {/* Date */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280' }}>Date</span>
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>
                    {formatDate(ticket.event.startDate)}
                  </p>
                </div>

                {/* Time */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280' }}>Time</span>
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>
                    {ticket.event.startTime || 'TBD'}
                  </p>
                </div>

                {/* Venue */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280' }}>Venue</span>
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>
                    {ticket.event.venueName || (ticket.event.venueType === 'online' ? 'Online Event' : 'Location TBD')}
                  </p>
                </div>

                {/* Ticket Type */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                      <path d="M15 5v2" />
                      <path d="M15 11v2" />
                      <path d="M15 17v2" />
                      <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
                    </svg>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280' }}>Ticket Type</span>
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>
                    {ticket.ticketType}
                  </p>
                </div>
              </div>

              {/* Quantity and Price */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '20px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Quantity</p>
                  <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#111827' }}>
                    {ticket.quantity} {ticket.quantity === 1 ? 'Ticket' : 'Tickets'}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Total Amount</p>
                  <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#6366f1' }}>
                    NPR {ticket.totalPrice?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative Divider */}
            <div style={{ position: 'relative', height: '32px', background: 'linear-gradient(135deg, #6366f1 0%, #9333ea 100%)' }}>
              <div style={{
                position: 'absolute',
                top: '-16px',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: '#ffffff', borderRadius: '50%' }}></div>
                <div style={{
                  flex: 1,
                  borderTop: '2px dashed rgba(255, 255, 255, 0.3)',
                  margin: '0 8px'
                }}></div>
                <div style={{ width: '32px', height: '32px', backgroundColor: '#ffffff', borderRadius: '50%' }}></div>
              </div>
            </div>

            {/* Bottom Section - QR Code */}
            <div style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #9333ea 100%)',
              padding: '32px',
              textAlign: 'center'
            }}>
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                display: 'inline-block',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
              }}>
                <p style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '12px'
                }}>
                  Scan QR Code at Entry
                </p>
                <canvas
                  ref={qrCodeRef}
                  style={{ display: 'block', margin: '0 auto 12px', width: '200px', height: '200px' }}
                />
                <p style={{
                  fontSize: '11px',
                  color: '#6b7280'
                }}>
                  Please present this QR code at the event entrance
                </p>
              </div>

              {/* Footer Info */}
              <div style={{ marginTop: '24px', color: '#ffffff', fontSize: '13px' }}>
                <p style={{ fontWeight: '600', marginBottom: '8px' }}>EventQueue</p>
                <p style={{ opacity: 0.8, marginBottom: '4px' }}>
                  Booking Date: {new Date(ticket.bookingDate).toLocaleDateString()}
                </p>
                <p style={{ fontSize: '11px', opacity: 0.6, marginTop: '8px', maxWidth: '400px', margin: '8px auto 0' }}>
                  This ticket is non-transferable and valid only for the event date specified
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={downloadTicket}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDownloader;
