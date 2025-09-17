import { useState } from 'react'
import type { Screen } from '../App'

interface SharingScreenProps {
  onNavigate: (screen: Screen) => void
}

interface ChatMessage {
  id: string
  sender: string
  message: string
  timestamp: string
  isOwn: boolean
}

interface ChatConversation {
  id: string
  participant: string
  lastMessage: string
  timestamp: string
  unread: number
  messages: ChatMessage[]
}

interface ForumReply {
  id: string
  content: string
  author: string
  timestamp: string
  likes: number
  isLiked: boolean
}

interface ForumPost {
  id: string
  title: string
  content: string
  author: string
  timestamp: string
  tags: string[]
  likes: number
  replies: ForumReply[]
  isLiked: boolean
}



// Mock data for chat conversations
const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: '1',
    participant: 'Alex',
    lastMessage: 'Thanks for sharing your experience with meditation...',
    timestamp: '2 min ago',
    unread: 1,
    messages: [
      { id: '1', sender: 'Alex', message: 'Hi! I saw your post about anxiety management. I\'ve been struggling with similar issues.', timestamp: '10:30 AM', isOwn: false },
      { id: '2', sender: 'You', message: 'Hey Alex! I\'m glad you reached out. What techniques have you tried so far?', timestamp: '10:32 AM', isOwn: true },
      { id: '3', sender: 'Alex', message: 'I\'ve tried breathing exercises but find it hard to stay consistent. Any tips?', timestamp: '10:35 AM', isOwn: false },
      { id: '4', sender: 'You', message: 'I found that setting a daily reminder really helped. Start with just 5 minutes.', timestamp: '10:37 AM', isOwn: true },
      { id: '5', sender: 'Alex', message: 'Thanks for sharing your experience with meditation...', timestamp: '10:40 AM', isOwn: false },
    ]
  },
  {
    id: '2',
    participant: 'Jordan',
    lastMessage: 'That\'s a great perspective on self-care',
    timestamp: '1 hour ago',
    unread: 0,
    messages: [
      { id: '1', sender: 'Jordan', message: 'Your journal entry about self-compassion really resonated with me.', timestamp: '9:15 AM', isOwn: false },
      { id: '2', sender: 'You', message: 'Thank you! It took me a while to learn to be kinder to myself.', timestamp: '9:20 AM', isOwn: true },
      { id: '3', sender: 'Jordan', message: 'That\'s a great perspective on self-care', timestamp: '9:25 AM', isOwn: false },
    ]
  },
  {
    id: '3',
    participant: 'Sam',
    lastMessage: 'How do you handle work stress?',
    timestamp: '3 hours ago',
    unread: 2,
    messages: [
      { id: '1', sender: 'Sam', message: 'I noticed you mentioned work-life balance. How do you handle work stress?', timestamp: '7:30 AM', isOwn: false },
    ]
  }
]

// Mock data for forum posts
const MOCK_POSTS: ForumPost[] = [
  {
    id: '1',
    title: 'Dealing with Sunday anxiety - anyone else?',
    content: 'Does anyone else get really anxious on Sunday nights thinking about the upcoming work week? I\'ve been trying different strategies but would love to hear what works for others.',
    author: 'MindfulMike',
    timestamp: '2 hours ago',
    tags: ['anxiety', 'work-stress', 'sunday-scaries'],
    likes: 24,
    isLiked: false,
    replies: [
      {
        id: '1',
        content: 'Yes! I call it the "Sunday scaries". What helps me is planning something fun for Sunday evening - like watching a good movie or video calling a friend.',
        author: 'ZenSeeker',
        timestamp: '1 hour ago',
        likes: 8,
        isLiked: true
      },
      {
        id: '2',
        content: 'I prepare for Monday on Friday so I don\'t have to think about work over the weekend. Game changer!',
        author: 'CalmCollector',
        timestamp: '45 min ago',
        likes: 12,
        isLiked: false
      },
      {
        id: '3',
        content: 'Try a Sunday wind-down routine - tea, gentle music, maybe some journaling about what you\'re grateful for from the week.',
        author: 'PeacefulPath',
        timestamp: '30 min ago',
        likes: 6,
        isLiked: false
      }
    ]
  },
  {
    id: '2',
    title: 'Small wins in my mental health journey 🌱',
    content: 'Been working on my mental health for 6 months now. Today I managed to do my morning meditation even though I didn\'t feel like it. Celebrating these small victories!',
    author: 'GrowingDaily',
    timestamp: '5 hours ago',
    tags: ['progress', 'meditation', 'self-care', 'motivation'],
    likes: 47,
    isLiked: true,
    replies: [
      {
        id: '1',
        content: 'This is so inspiring! Those small consistent actions really add up over time. Proud of you! 💪',
        author: 'SupportiveSoul',
        timestamp: '4 hours ago',
        likes: 15,
        isLiked: false
      },
      {
        id: '2',
        content: 'Yes! I\'ve learned that showing up even when you don\'t feel like it is actually the most important time to do it.',
        author: 'WisdomSeeker',
        timestamp: '3 hours ago',
        likes: 9,
        isLiked: true
      }
    ]
  },
  {
    id: '3',
    title: 'Therapist recommendations for social anxiety?',
    content: 'I\'m finally ready to seek professional help for my social anxiety. Does anyone have recommendations for finding the right therapist? What should I look for?',
    author: 'TakingSteps',
    timestamp: '1 day ago',
    tags: ['therapy', 'social-anxiety', 'professional-help'],
    likes: 18,
    isLiked: false,
    replies: [
      {
        id: '1',
        content: 'Psychology Today has a great therapist finder. Look for someone who specializes in anxiety disorders and uses CBT or exposure therapy.',
        author: 'TherapyAdvocate',
        timestamp: '1 day ago',
        likes: 22,
        isLiked: false
      },
      {
        id: '2',
        content: 'Don\'t be afraid to schedule consultations with a few different therapists. The therapeutic relationship is so important!',
        author: 'HealingJourney',
        timestamp: '20 hours ago',
        likes: 14,
        isLiked: false
      }
    ]
  }
]

export default function SharingScreen({ onNavigate: _ }: SharingScreenProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'forum'>('forum')
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null)
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostTags, setNewPostTags] = useState('')

  const [conversations] = useState<ChatConversation[]>(MOCK_CONVERSATIONS)
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(MOCK_POSTS)

  const handleLikePost = (postId: string) => {
    setForumPosts(posts => 
      posts.map(post => 
        post.id === postId 
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    )
  }

  const handleLikeReply = (postId: string, replyId: string) => {
    setForumPosts(posts =>
      posts.map(post =>
        post.id === postId
          ? {
              ...post,
              replies: post.replies.map(reply =>
                reply.id === replyId
                  ? { ...reply, isLiked: !reply.isLiked, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1 }
                  : reply
              )
            }
          : post
      )
    )
  }

  const handleCreatePost = () => {
    if (newPostTitle.trim() && newPostContent.trim()) {
      const newPost: ForumPost = {
        id: String(Date.now()),
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        author: 'You',
        timestamp: 'Just now',
        tags: newPostTags.split(',').map(tag => tag.trim()).filter(tag => tag),
        likes: 0,
        isLiked: false,
        replies: []
      }
      
      setForumPosts([newPost, ...forumPosts])
      setNewPostTitle('')
      setNewPostContent('')
      setNewPostTags('')
      setShowNewPost(false)
    }
  }

  // Chat interface
  if (selectedChat) {
    return (
      <div className="min-h-screen relative pb-24 flex flex-col overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img src="https://images.pexels.com/photos/18071149/pexels-photo-18071149.jpeg" alt="Community background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        {/* Chat Header */}
        <div className="relative z-10 px-6 pt-12 pb-4">
          <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 flex items-center space-x-4 text-white">
            <button 
              onClick={() => setSelectedChat(null)}
              className="text-white hover:text-white/80"
            >
              ← Back
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
                👤
              </div>
              <div>
                <h2 className="font-semibold">{selectedChat.participant}</h2>
                <p className="text-sm text-white/80">Available for support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="relative z-10 flex-1 px-6 py-4 overflow-y-auto">
          <div className="space-y-4">
            {selectedChat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.isOwn ? 'bg-primary-purple text-white' : 'bg-white/30 backdrop-blur text-white'}`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${message.isOwn ? 'text-white/70' : 'text-white/70'}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="relative z-10 px-6 py-4">
          <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-full flex items-center px-3 py-2">
            <input
              type="text"
              placeholder="Type a supportive message..."
              className="flex-1 px-3 py-2 bg-transparent text-white placeholder-white/70 focus:outline-none"
            />
            <button className="px-4 py-2 bg-primary-purple text-white rounded-full hover:bg-primary-purple/90 transition-colors">
              Send
            </button>
          </div>
          <p className="text-xs text-white/70 mt-2 text-center">
            💡 This is a prototype - messages are for demonstration only
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative pb-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.pexels.com/photos/18071149/pexels-photo-18071149.jpeg" alt="Community background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/35" />
      </div>
      {/* Header */}
      <div className="relative z-10 px-6 pt-12 pb-4">
        <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-5 text-white">
          <h1 className="text-2xl font-bold mb-1">Community</h1>
          <p className="text-white/80 text-sm">Connect, share, and support each other</p>
        </div>
      </div>

      <div className="relative z-10 px-6 -mt-2">
        {/* Tab Navigation */}
        <div className="mb-4">
          <div className="flex bg-white/15 backdrop-blur-xl border border-white/20 rounded-full p-1">
            <button
              onClick={() => setActiveTab('forum')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${activeTab === 'forum' ? 'bg-white text-gray-900 shadow' : 'text-white/80 hover:text-white'}`}
            >
              Forum
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${activeTab === 'chat' ? 'bg-white text-gray-900 shadow' : 'text-white/80 hover:text-white'}`}
            >
              Support Chat
            </button>
          </div>
        </div>

        {/* Forum Tab */}
        {activeTab === 'forum' && (
          <div>
            {/* New Post Button */}
            <div className="mb-4 bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowNewPost(true)}
                  className="px-4 py-2 bg-primary-purple text-white rounded-full hover:bg-primary-purple/90 transition-colors"
                >
                  ✏️ Share Your Experience
                </button>
                <div className="text-white/80 text-sm">
                  <button className="px-3 py-1 rounded-full hover:bg-white/10">Top</button>
                  <button className="px-3 py-1 rounded-full hover:bg-white/10">Latest</button>
                </div>
              </div>
            </div>

            {/* New Post Modal */}
            {showNewPost && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                <div className="bg-white/95 rounded-2xl w-full max-w-md p-6 backdrop-blur-md">
                  <h3 className="text-lg font-semibold mb-4">Create New Post</h3>
                  
                  <input
                    type="text"
                    placeholder="Post title..."
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-primary-purple"
                  />
                  
                  <textarea
                    placeholder="Share your thoughts, experiences, or questions..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-primary-purple resize-none"
                  />
                  
                  <input
                    type="text"
                    placeholder="Tags (separate with commas)"
                    value={newPostTags}
                    onChange={(e) => setNewPostTags(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-primary-purple"
                  />
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowNewPost(false)}
                      className="flex-1 py-2 px-4 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreatePost}
                      className="flex-1 py-2 px-4 bg-primary-purple text-white rounded-lg hover:bg-primary-purple/90 transition-colors"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Forum Posts */}
            <div className="space-y-4">
              {forumPosts.map((post) => (
                <div key={post.id} className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-5 text-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
                        👤
                      </div>
                      <div>
                        <span className="font-medium">{post.author}</span>
                        <span className="text-white/70 text-sm ml-2">{post.timestamp}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${
                        post.isLiked ? 'text-rose-400' : 'text-white/70 hover:text-rose-300'
                      }`}
                    >
                      <span>{post.isLiked ? '❤️' : '🤍'}</span>
                      <span>{post.likes}</span>
                    </button>
                  </div>
                  
                  <h3 className="font-semibold text-white mb-2 text-lg">{post.title}</h3>
                  <p className="text-white/90 mb-3">{post.content}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-white/15 text-white text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Replies */}
                  {post.replies.length > 0 && (
                    <div className="border-t border-white/20 pt-4 space-y-3">
                      {post.replies.map((reply) => (
                        <div key={reply.id} className="bg-white/10 p-3 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                                👤
                              </div>
                              <span className="font-medium text-white text-sm">{reply.author}</span>
                              <span className="text-white/70 text-xs">{reply.timestamp}</span>
                            </div>
                            <button
                              onClick={() => handleLikeReply(post.id, reply.id)}
                              className={`flex items-center space-x-1 text-xs ${
                                reply.isLiked ? 'text-rose-300' : 'text-white/70 hover:text-rose-300'
                              }`}
                            >
                              <span>{reply.isLiked ? '❤️' : '🤍'}</span>
                              <span>{reply.likes}</span>
                            </button>
                          </div>
                          <p className="text-white/90 text-sm">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div>
            <div className="mb-4 bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-white">
              <h3 className="text-lg font-semibold mb-1">Support Conversations</h3>
              <p className="text-sm text-white/80">Connect one-on-one with others who understand your journey</p>
            </div>

            <div className="space-y-3">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation)}
                  className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-4 cursor-pointer transition-colors hover:bg-white/20"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg text-white">
                        👤
                      </div>
                      {conversation.unread > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 text-white">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{conversation.participant}</h4>
                        <span className="text-xs text-white/70">{conversation.timestamp}</span>
                      </div>
                      <p className="text-sm text-white/80 truncate">{conversation.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-white">
              <h3 className="text-sm font-semibold mb-2">💡 About Support Chat</h3>
              <div className="space-y-2 text-xs text-white/80">
                <p>• Anonymous conversations with others facing similar challenges</p>
                <p>• Share experiences and coping strategies</p>
                <p>• This is a prototype - real implementation would include matching algorithms</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}