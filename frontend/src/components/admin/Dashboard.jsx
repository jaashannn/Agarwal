function Dashboard({ stats, profiles, messages }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/50 p-6 rounded-lg border border-gold/20 shadow-sm">
          <h3 className="text-gray-500 font-medium mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
        </div>
        <div className="bg-white/50 p-6 rounded-lg border border-gold/20 shadow-sm">
          <h3 className="text-gray-500 font-medium mb-2">Verified Users</h3>
          <p className="text-3xl font-bold text-primary">{stats.verifiedUsers}</p>
        </div>
        <div className="bg-white/50 p-6 rounded-lg border border-gold/20 shadow-sm">
          <h3 className="text-gray-500 font-medium mb-2">New Users (7d)</h3>
          <p className="text-3xl font-bold text-primary">{stats.newUsers}</p>
        </div>
        <div className="bg-white/50 p-6 rounded-lg border border-gold/20 shadow-sm">
          <h3 className="text-gray-500 font-medium mb-2">Messages</h3>
          <p className="text-3xl font-bold text-primary">{stats.messages}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {profiles.slice(0, 5).map(profile => (
              <div key={profile._id} className="flex items-center justify-between p-3 hover:bg-white/10 rounded-lg">
                <div>
                  <p className="font-medium">{profile.name}</p>
                  <p className="text-sm text-gray-600">{profile.email}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${profile.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {profile.verified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Recent Messages</h3>
          <div className="space-y-4">
            {messages.slice(0, 5).map(message => (
              <div key={message._id} className="p-3 hover:bg-white/10 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-medium">{message.from}</p>
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard