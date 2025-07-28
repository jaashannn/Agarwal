import { useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/shared/PageHeader'
import BlogCard from '../components/blog/BlogCard'
import { blogPosts } from '../data/blogPosts'

function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const categories = ['All', ...new Set(blogPosts.map(post => post.category))]
  
  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory)
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader 
        title="Marriage & Relationship Insights" 
        subtitle="Explore our collection of articles on marriage, traditions, relationships, and cultural insights from the Agarwal community."
        backgroundImage="https://images.pexels.com/photos/733856/pexels-photo-733856.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />
      
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          {/* Category Filters */}
          <div className="mb-12 overflow-x-auto">
            <div className="flex space-x-2 pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full transition-colors duration-300 whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-primary/10'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Blog Posts Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredPosts.map(post => (
              <motion.div key={post.id} variants={itemVariants}>
                <BlogCard post={post} />
              </motion.div>
            ))}
          </motion.div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-playfair text-primary mb-4">No Articles Found</h3>
              <p className="text-gray-600 mb-8">
                We couldn't find any articles in this category.
              </p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="btn-primary"
              >
                View All Articles
              </button>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  )
}

export default Blog