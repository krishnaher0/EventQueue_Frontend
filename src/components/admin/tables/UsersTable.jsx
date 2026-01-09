const UsersTable = ({ users, onUpdateRole }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">User</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Email</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Role</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Joined</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-slate-50">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.fullName} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-primary font-semibold">
                          {u.fullName?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-slate-800">{u.fullName}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-600">{u.email}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    u.role === 'admin' ? 'bg-red-100 text-red-700' :
                    u.role === 'organizer' ? 'bg-purple-100 text-purple-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-4 px-6 text-slate-600">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  {u.role !== 'admin' && (
                    <select
                      value={u.role}
                      onChange={(e) => onUpdateRole(u._id, e.target.value)}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    >
                      <option value="user">User</option>
                      <option value="organizer">Organizer</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;