import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function BlogCard({ post }) {
  return (
    <Link to={`/blog/${post.id}`}>
      <motion.article 
        className="glass-card h-full overflow-hidden group"
        whileHover={{ 
          y: -5, 
          boxShadow: '0 10px 25px rgba(4, 106, 56, 0.15)',
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative h-48 md:h-64 overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="mx-2">•</span>
            <span>{post.date}</span>
          </div>
          
          <h3 className="text-xl font-playfair font-bold text-primary mb-3 group-hover:text-primary-dark transition-colors">
            {post.title}
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-2">
            {post.excerpt}
          </p>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">By {post.author}</span>
            <motion.span 
              className="text-primary font-medium flex items-center"
              whileHover={{ x: 5 }}
            >
              Read More
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.span>
          </div>
        </div>
      </motion.article>
    </Link>
  )
}

export default BlogCard