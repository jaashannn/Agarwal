import { FaSearch, FaCheckCircle, FaTrash, FaUserEdit } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function ProfilesTable({ profiles, searchQuery, setSearchQuery, handleVerify, handleDelete }) {
  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (profile.location && profile.location.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div>
      <div className="mb-8">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg bg-white/50 border border-gold/20 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Search profiles by name, email, or location"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gold/10">
              <th className="py-3 px-4 text-gray-600 font-medium">Name</th>
              <th className="py-3 px-4 text-gray-600 font-medium">Email</th>
              <th className="py-3 px-4 text-gray-600 font-medium">Age</th>
              <th className="py-3 px-4 text-gray-600 font-medium">Location</th>
              <th className="py-3 px-4 text-gray-600 font-medium">Status</th>
              <th className="py-3 px-4 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map(profile => (
                <tr key={profile._id} className="border-b border-gold/10 hover:bg-white/10">
                  <td className="py-3 px-4 text-gray-800">{profile.name}</td>
                  <td className="py-3 px-4 text-gray-800">{profile.email}</td>
                  <td className="py-3 px-4 text-gray-800">{profile.age || 'N/A'}</td>
                  <td className="py-3 px-4 text-gray-800">{profile.location || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <span className={`flex items-center ${profile.verified ? 'text-primary' : 'text-gray-500'}`}>
                      <FaCheckCircle className="mr-1" />
                      {profile.verified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex space-x-2">
                    <button
                      onClick={() => handleVerify(profile._id)}
                      className={`btn-primary px-3 py-1 text-sm ${profile.verified ? 'bg-gray-400' : ''}`}
                      aria-label={profile.verified ? 'Unverify profile' : 'Verify profile'}
                    >
                      {profile.verified ? 'Unverify' : 'Verify'}
                    </button>
                    <button
                      onClick={() => handleDelete(profile._id)}
                      className="btn-secondary px-3 py-1 text-sm"
                      aria-label="Delete profile"
                    >
                      <FaTrash />
                    </button>
                    <Link
                      to={`/admin/edit-profile/${profile._id}`}
                      className="btn-primary px-3 py-1 text-sm bg-blue-500"
                      aria-label="Edit profile"
                    >
                      <FaUserEdit />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-600">
                  No profiles found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProfilesTable