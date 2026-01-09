const OrganizerRequestsTable = ({ requests, onApprove, onReject }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Applicant</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Organization</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Type</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Submitted</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Status</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map(request => (
              <tr key={request._id} className="hover:bg-slate-50">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {request.user?.avatar ? (
                        <img src={request.user.avatar} alt={request.user.fullName} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-primary font-semibold">
                          {request.user?.fullName?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{request.user?.fullName}</p>
                      <p className="text-sm text-slate-500">{request.user?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-600">{request.organizationName}</td>
                <td className="py-4 px-6 text-slate-600 capitalize">{request.organizationType}</td>
                <td className="py-4 px-6 text-slate-600">
                  {new Date(request.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    request.status === 'approved' ? 'bg-green-100 text-green-700' :
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {request.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onApprove(request._id)}
                        className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onReject(request._id)}
                        className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {requests.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-slate-500">No organizer requests yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerRequestsTable;