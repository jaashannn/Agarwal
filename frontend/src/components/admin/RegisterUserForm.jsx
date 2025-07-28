import { FaUserPlus } from 'react-icons/fa'

function RegisterUserForm({ newUserForm, handleInputChange, handleRegisterUser }) {
  return (
    <div>
      <h2 className="text-xl font-playfair font-semibold text-primary mb-6">
        Register New User
      </h2>
      <form onSubmit={handleRegisterUser} className="max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-600 font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={newUserForm.name}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-white/50 border border-gold/20 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter full name"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={newUserForm.email}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-white/50 border border-gold/20 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter email"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-2">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={newUserForm.mobile}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-white/50 border border-gold/20 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter mobile number"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-2">Who is creating?</label>
            <select
              name="creatorRole"
              value={newUserForm.creatorRole}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-white/50 border border-gold/20 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="self">Myself</option>
              <option value="mother">Mother</option>
              <option value="father">Father</option>
              <option value="friend">Friend</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-2">Mother's Name</label>
            <input
              type="text"
              name="motherName"
              value={newUserForm.motherName}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-white/50 border border-gold/20 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter mother's name"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-2">Father's Name</label>
            <input
              type="text"
              name="fatherName"
              value={newUserForm.fatherName}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-white/50 border border-gold/20 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter father's name"
              required
            />
          </div>
        </div>
        <div className="mt-6">
          <p className="text-gray-600 mb-4">
            A default password will be generated for the user. They can change it after first login.
          </p>
          <button
            type="submit"
            className="btn-primary"
          >
            <FaUserPlus className="mr-2" /> Register User
          </button>
        </div>
      </form>
    </div>
  )
}

export default RegisterUserForm