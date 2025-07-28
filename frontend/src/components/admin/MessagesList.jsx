import { FaEnvelope } from 'react-icons/fa'

function MessagesList({ messages }) {
  return (
    <div>
      <h2 className="text-xl font-playfair font-semibold text-primary mb-4">
        Messages
      </h2>
      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map(message => (
            <div key={message._id} className="glass-card p-4 flex items-start space-x-4">
              <FaEnvelope className="text-primary text-xl mt-1" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-gray-800 font-medium">{message.from}</h3>
                  <span className="text-gray-500 text-sm">{message.timestamp}</span>
                </div>
                <p className="text-gray-700">{message.content}</p>
                <div className="mt-3 flex space-x-2">
                  <button className="btn-primary px-3 py-1 text-sm">
                    Reply
                  </button>
                  <button className="btn-secondary px-3 py-1 text-sm">
                    Mark as Read
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600 py-6">
            No messages received.
          </div>
        )}
      </div>
    </div>
  )
}

export default MessagesList