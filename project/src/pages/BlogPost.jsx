import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaChevronLeft, FaCalendarAlt, FaTag, FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'
import { blogPosts } from '../data/blogPosts'

function BlogPost() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState([])
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundPost = blogPosts.find(p => p.id === parseInt(id))
      setPost(foundPost)
      
      if (foundPost) {
        const related = blogPosts
          .filter(p => p.id !== foundPost.id && p.category === foundPost.category)
          .slice(0, 3)
        setRelatedPosts(related)
      }
      
      setLoading(false)
    }, 500)
  }, [id])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center pt-20">
        <div className="glass-card p-8 max-w-md mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-6 bg-primary/20 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-primary/20 rounded w-1/2 mx-auto mb-2"></div>
            <div className="h-4 bg-primary/20 rounded w-2/3 mx-auto mb-2"></div>
            <div className="h-4 bg-primary/20 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    )
  }
  
  if (!post) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center pt-20">
        <div className="glass-card p-8 max-w-md mx-auto text-center">
          <h2 className="text-2xl font-playfair font-bold text-primary mb-4">Article Not Found</h2>
          <p className="text-gray-600 mb-6">The article you are looking for does not exist or has been removed.</p>
          <Link to="/blog" className="btn-primary">
            Browse Other Articles
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <motion.div
      className="bg-cream pt-20 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <Link to="/blog" className="inline-flex items-center text-primary font-medium mb-8 hover:underline">
          <FaChevronLeft className="mr-2" /> Back to Blog
        </Link>
        
        {/* Article Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <motion.h1 
            className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {post.title}
          </motion.h1>
          
          <motion.div 
            className="flex flex-wrap items-center text-gray-600 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center mr-6 mb-2">
              <span className="font-medium">By {post.author}</span>
            </div>
            <div className="flex items-center mr-6 mb-2">
              <FaCalendarAlt className="mr-2 text-primary" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center mb-2">
              <FaTag className="mr-2 text-primary" />
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                {post.category}
              </span>
            </div>
          </motion.div>
        </div>
        
        {/* Featured Image */}
        <motion.div 
          className="max-w-4xl mx-auto mb-10 rounded-lg overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-auto object-cover"
          />
        </motion.div>
        
        {/* Article Content */}
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="glass-card p-8 mb-8">
            <div 
              className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:font-bold prose-headings:text-primary prose-p:text-gray-700 prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></div>
            
            {/* Tags */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-playfair font-semibold text-primary mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-cream-dark text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Share */}
          <div className="glass-card p-6 mb-12">
            <h3 className="text-lg font-playfair font-semibold text-primary mb-4">Share This Article</h3>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-[#3b5998] flex items-center justify-center text-white hover:bg-opacity-90 transition-opacity"
                aria-label="Share on Facebook"
              >
                <FaFacebookF />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-[#1da1f2] flex items-center justify-center text-white hover:bg-opacity-90 transition-opacity"
                aria-label="Share on Twitter"
              >
                <FaTwitter />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-[#0077b5] flex items-center justify-center text-white hover:bg-opacity-90 transition-opacity"
                aria-label="Share on LinkedIn"
              >
                <FaLinkedinIn />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-[#25d366] flex items-center justify-center text-white hover:bg-opacity-90 transition-opacity"
                aria-label="Share on WhatsApp"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
          
          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-playfair font-bold text-primary mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map(relatedPost => (
                  <Link 
                    key={relatedPost.id} 
                    to={`/blog/${relatedPost.id}`}
                    className="glass-card overflow-hidden group"
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={relatedPost.image} 
                        alt={relatedPost.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-playfair font-bold text-primary mb-2 group-hover:text-primary-dark transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {relatedPost.date}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default BlogPost