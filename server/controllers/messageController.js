import Message from '../models/Message.js'

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

const createMessage = async (req, res) => {
  const { from, content } = req.body
  try {
    const message = new Message({ from, content })
    await message.save()
    res.status(201).json({ message: 'Message sent successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export { getMessages, createMessage }