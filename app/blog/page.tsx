import React from "react";

const blogPosts = [
  {
    id: 1,
    title: "Understanding Phishing Attacks: How They Work and How to Protect Yourself",
    excerpt: "Phishing attacks are one of the most common cyber threats today. Learn how they operate and the best practices to stay safe.",
    date: "October 15, 2023",
    author: "Sanjana",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "AI-Powered Phishing Detection: The Future of Cybersecurity",
    excerpt: "Explore how artificial intelligence is revolutionizing the way we detect and prevent phishing attempts.",
    date: "October 10, 2023",
    author: "Bikram",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Building Secure Web Applications: Best Practices",
    excerpt: "A comprehensive guide to implementing security measures in modern web applications.",
    date: "October 5, 2023",
    author: "Sushmita",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Machine Learning in Cybersecurity: Real-World Applications",
    excerpt: "How machine learning algorithms are being used to combat evolving cyber threats.",
    date: "September 28, 2023",
    author: "Bishi",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "The Evolution of Phishing Techniques: Staying Ahead of Attackers",
    excerpt: "An analysis of how phishing methods have evolved and what it means for future security measures.",
    date: "September 20, 2023",
    author: "Brikhesh",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    title: "Implementing Zero-Trust Architecture in Modern Applications",
    excerpt: "Learn about zero-trust security models and how to implement them in your applications.",
    date: "September 15, 2023",
    author: "Sanjana",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-800 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">PhishGuard Blog</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Insights, tips, and expert knowledge on cybersecurity, phishing prevention, and AI-powered security solutions.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">
                    {post.date} • By {post.author}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3 hover:text-teal-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <button className="text-teal-600 font-medium hover:text-teal-800 transition-colors">
                    Read More →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-teal-50 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Stay Updated with Latest Security Insights
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Subscribe to our newsletter for the latest articles on cybersecurity and phishing prevention.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
