// Mock data for HopeChain application

// Mock data service for development
const mockUsers = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    type: 'donor',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    skills: 'I can help with food delivery, tutoring, and handyman services.',
    did: 'did:hopechain:donor:1',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    type: 'recipient',
    phone: '+1 (555) 987-6543',
    location: 'Los Angeles, CA',
    needs: 'Looking for help with groceries and transportation to medical appointments.',
    did: 'did:hopechain:recipient:2',
    createdAt: '2024-02-20T14:22:00Z'
  },
  {
    id: '3',
    name: 'David Chen',
    email: 'david@example.com',
    type: 'donor',
    phone: '+1 (555) 456-7890',
    location: 'Seattle, WA',
    skills: 'Software developer offering coding lessons and tech support.',
    did: 'did:hopechain:donor:3',
    createdAt: '2024-03-10T09:15:00Z'
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    type: 'recipient',
    phone: '+1 (555) 234-5678',
    location: 'Portland, OR',
    needs: 'Need assistance with childcare and meal preparation.',
    did: 'did:hopechain:recipient:4',
    createdAt: '2024-04-05T16:45:00Z'
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'james@example.com',
    type: 'donor',
    phone: '+1 (555) 876-5432',
    location: 'Denver, CO',
    skills: 'Retired teacher offering tutoring and mentoring services.',
    did: 'did:hopechain:donor:5',
    createdAt: '2024-05-12T11:30:00Z'
  },
  // Additional realistic users
  {
    id: '6',
    name: 'Aisha Patel',
    email: 'aisha.patel@example.com',
    type: 'donor',
    phone: '+1 (555) 345-6789',
    location: 'Austin, TX',
    skills: 'Registered nurse offering medical consultations and health checkups.',
    did: 'did:hopechain:donor:6',
    createdAt: '2024-06-18T08:45:00Z'
  },
  {
    id: '7',
    name: 'Robert Thompson',
    email: 'robert.t@example.com',
    type: 'recipient',
    phone: '+1 (555) 567-8901',
    location: 'Chicago, IL',
    needs: 'Need help with moving to a new apartment and furniture assembly.',
    did: 'did:hopechain:recipient:7',
    createdAt: '2024-07-22T13:20:00Z'
  },
  {
    id: '8',
    name: 'Elena Rodriguez',
    email: 'elena.r@example.com',
    type: 'donor',
    phone: '+1 (555) 678-9012',
    location: 'Miami, FL',
    skills: 'Professional chef offering cooking classes and meal planning.',
    did: 'did:hopechain:donor:8',
    createdAt: '2024-08-30T10:15:00Z'
  },
  {
    id: '9',
    name: 'Michael Okafor',
    email: 'michael.okafor@example.com',
    type: 'recipient',
    phone: '+1 (555) 789-0123',
    location: 'Atlanta, GA',
    needs: 'Need assistance with college application process and essay writing.',
    did: 'did:hopechain:recipient:9',
    createdAt: '2024-09-15T15:30:00Z'
  },
  {
    id: '10',
    name: 'Jennifer Kim',
    email: 'j.kim@example.com',
    type: 'donor',
    phone: '+1 (555) 890-1234',
    location: 'Boston, MA',
    skills: 'Lawyer offering free legal advice for immigration and housing issues.',
    did: 'did:hopechain:donor:10',
    createdAt: '2024-10-05T11:45:00Z'
  },
  // Additional community members
  {
    id: '11',
    name: 'Carlos Mendez',
    email: 'carlos.m@example.com',
    type: 'donor',
    phone: '+1 (555) 123-4567',
    location: 'Phoenix, AZ',
    skills: 'Construction worker offering home repair services and handyman work.',
    did: 'did:hopechain:donor:11',
    createdAt: '2024-10-12T09:30:00Z'
  },
  {
    id: '12',
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    type: 'recipient',
    phone: '+1 (555) 234-5678',
    location: 'San Diego, CA',
    needs: 'Need help with English tutoring for my 8-year-old daughter.',
    did: 'did:hopechain:recipient:12',
    createdAt: '2024-10-18T14:20:00Z'
  },
  {
    id: '13',
    name: 'Marcus Johnson',
    email: 'marcus.j@example.com',
    type: 'donor',
    phone: '+1 (555) 345-6789',
    location: 'Detroit, MI',
    skills: 'Retired mechanic offering vehicle repair and maintenance services.',
    did: 'did:hopechain:donor:13',
    createdAt: '2024-10-22T11:15:00Z'
  },
  {
    id: '14',
    name: 'Fatima Al-Hassan',
    email: 'fatima.a@example.com',
    type: 'recipient',
    phone: '+1 (555) 456-7890',
    location: 'Houston, TX',
    needs: 'Need assistance with grocery shopping due to mobility issues.',
    did: 'did:hopechain:recipient:14',
    createdAt: '2024-10-28T16:45:00Z'
  },
  {
    id: '15',
    name: 'Thomas Wright',
    email: 'thomas.w@example.com',
    type: 'donor',
    phone: '+1 (555) 567-8901',
    location: 'Philadelphia, PA',
    skills: 'Professional chef offering cooking lessons and meal planning.',
    did: 'did:hopechain:donor:15',
    createdAt: '2024-11-02T10:30:00Z'
  },
  {
    id: '16',
    name: 'Yuki Tanaka',
    email: 'yuki.t@example.com',
    type: 'recipient',
    phone: '+1 (555) 678-9012',
    location: 'San Jose, CA',
    needs: 'Need help with computer skills and online job applications.',
    did: 'did:hopechain:recipient:16',
    createdAt: '2024-11-08T13:20:00Z'
  },
  {
    id: '17',
    name: 'Amara Osei',
    email: 'amara.o@example.com',
    type: 'donor',
    phone: '+1 (555) 789-0123',
    location: 'Minneapolis, MN',
    skills: 'Nurse offering health screenings and basic medical care guidance.',
    did: 'did:hopechain:donor:17',
    createdAt: '2024-11-15T08:45:00Z'
  },
  {
    id: '18',
    name: 'Elena Volkov',
    email: 'elena.v@example.com',
    type: 'recipient',
    phone: '+1 (555) 890-1234',
    location: 'Denver, CO',
    needs: 'Need winter clothing and blankets for my family.',
    did: 'did:hopechain:recipient:18',
    createdAt: '2024-11-20T15:30:00Z'
  }
];

const mockOffers = [
  {
    id: '1',
    userId: '1',
    userName: 'Alex Johnson',
    title: 'Free Food Delivery',
    description: 'I can deliver groceries and meals to those in need within 10 miles of downtown SF.',
    resourceType: 'food',
    location: 'San Francisco, CA',
    urgency: 'medium',
    isActive: true,
    createdAt: '2024-06-01T08:00:00Z',
    expiresAt: '2024-12-31T23:59:59Z'
  },
  {
    id: '2',
    userId: '3',
    userName: 'David Chen',
    title: 'Free Coding Lessons',
    description: 'Offering free coding lessons for beginners. HTML, CSS, JavaScript basics.',
    resourceType: 'education',
    location: 'Seattle, WA',
    urgency: 'low',
    isActive: true,
    createdAt: '2024-06-05T14:30:00Z',
    expiresAt: '2024-12-31T23:59:59Z'
  },
  {
    id: '3',
    userId: '5',
    userName: 'James Wilson',
    title: 'Tutoring Services',
    description: 'Retired teacher offering math and reading tutoring for all ages.',
    resourceType: 'education',
    location: 'Denver, CO',
    urgency: 'low',
    isActive: true,
    createdAt: '2024-06-10T10:15:00Z',
    expiresAt: '2024-12-31T23:59:59Z'
  },
  // Additional realistic offers
  {
    id: '4',
    userId: '6',
    userName: 'Aisha Patel',
    title: 'Free Health Checkups',
    description: 'Registered nurse offering basic health screenings and consultations. Perfect for those without insurance.',
    resourceType: 'medical',
    location: 'Austin, TX',
    urgency: 'medium',
    isActive: true,
    createdAt: '2024-10-20T09:30:00Z',
    expiresAt: '2024-12-31T23:59:59Z'
  },
  {
    id: '5',
    userId: '8',
    userName: 'Elena Rodriguez',
    title: 'Cooking Classes for Families',
    description: 'Professional chef offering free cooking classes focused on budget-friendly, nutritious meals for families.',
    resourceType: 'education',
    location: 'Miami, FL',
    urgency: 'low',
    isActive: true,
    createdAt: '2024-11-05T16:45:00Z',
    expiresAt: '2024-12-31T23:59:59Z'
  },
  {
    id: '6',
    userId: '10',
    userName: 'Jennifer Kim',
    title: 'Legal Aid for Housing Issues',
    description: 'Lawyer offering free legal consultations for housing disputes, evictions, and tenant rights.',
    resourceType: 'legal_help',
    location: 'Boston, MA',
    urgency: 'high',
    isActive: true,
    createdAt: '2024-11-15T11:20:00Z',
    expiresAt: '2024-12-31T23:59:59Z'
  },
  {
    id: '7',
    userId: '1',
    userName: 'Alex Johnson',
    title: 'Moving Help & Furniture Assembly',
    description: 'Can help with packing, loading, unloading, and assembling IKEA furniture. Truck available.',
    resourceType: 'transportation',
    location: 'San Francisco, CA',
    urgency: 'medium',
    isActive: true,
    createdAt: '2024-11-20T13:15:00Z',
    expiresAt: '2024-12-31T23:59:59Z'
  },
  {
    id: '8',
    userId: '3',
    userName: 'David Chen',
    title: 'Tech Support for Seniors',
    description: 'Helping seniors with smartphones, tablets, video calls, and online services. Patient and friendly approach.',
    resourceType: 'skills',
    location: 'Seattle, WA',
    urgency: 'low',
    isActive: true,
    createdAt: '2024-11-25T10:00:00Z',
    expiresAt: '2024-12-31T23:59:59Z'
  },
  // Additional community offers
  {
    id: '9',
    userId: '11',
    userName: 'Carlos Mendez',
    title: 'Free Home Repairs',
    description: 'Offering free minor home repairs, plumbing fixes, and general maintenance for those in need in the Phoenix area.',
    resourceType: 'skills',
    location: 'Phoenix, AZ',
    urgency: 'medium',
    isActive: true,
    createdAt: '2024-11-28T09:15:00Z',
    expiresAt: '2024-12-31T23:59:59Z'
  },
  {
    id: '10',
    userId: '13',
    userName: 'Marcus Johnson',
    title: 'Vehicle Maintenance Help',
    description: 'Retired mechanic offering free oil changes, basic tune-ups, and vehicle safety inspections.',
    resourceType: 'skills',
    location: 'Detroit, MI',
    urgency: 'low',
    isActive: true,
    createdAt: '2024-12-01T14:30:00Z',
    expiresAt: '2024-12-31T23:59:59Z'
  },
  {
    id: '11',
    userId: '15',
    userName: 'Thomas Wright',
    title: 'Cooking Classes for Beginners',
    description: 'Professional chef offering free cooking classes focused on budget-friendly, nutritious meals for families.',
    resourceType: 'education',
    location: 'Philadelphia, PA',
    urgency: 'low',
    isActive: true,
    createdAt: '2024-12-03T11:20:00Z',
    expiresAt: '2024-12-31T23:59:59Z'
  },
  {
    id: '12',
    userId: '17',
    userName: 'Amara Osei',
    title: 'Free Health Screenings',
    description: 'Registered nurse offering basic health screenings, blood pressure checks, and health consultations.',
    resourceType: 'medical',
    location: 'Minneapolis, MN',
    urgency: 'medium',
    isActive: true,
    createdAt: '2024-12-05T16:45:00Z',
    expiresAt: '2024-12-31T23:59:59Z'
  },
  {
    id: '13',
    userId: '1',
    userName: 'Alex Johnson',
    title: 'Weekend Food Delivery',
    description: 'I can deliver groceries and meals to those in need on weekends within 15 miles of downtown San Francisco.',
    resourceType: 'food',
    location: 'San Francisco, CA',
    urgency: 'medium',
    isActive: true,
    createdAt: '2024-12-08T08:30:00Z',
    expiresAt: '2024-12-31T23:59:59Z'
  },
  {
    id: '14',
    userId: '5',
    userName: 'James Wilson',
    title: 'Math Tutoring for Kids',
    description: 'Retired teacher offering free math tutoring for elementary and middle school students.',
    resourceType: 'education',
    location: 'Denver, CO',
    urgency: 'low',
    isActive: true,
    createdAt: '2024-12-10T13:15:00Z',
    expiresAt: '2024-12-31T23:59:59Z'
  },
  {
    id: '15',
    userId: '6',
    userName: 'Aisha Patel',
    title: 'Medical Consultations',
    description: 'Registered nurse offering free medical consultations for minor health concerns and preventive care advice.',
    resourceType: 'medical',
    location: 'Austin, TX',
    urgency: 'medium',
    isActive: true,
    createdAt: '2024-12-12T10:45:00Z',
    expiresAt: '2024-12-31T23:59:59Z'
  },
  {
    id: '16',
    userId: '8',
    userName: 'Elena Rodriguez',
    title: 'Culinary Skills Workshop',
    description: 'Professional chef offering free workshops on meal planning and cooking techniques for busy families.',
    resourceType: 'education',
    location: 'Miami, FL',
    urgency: 'low',
    isActive: true,
    createdAt: '2024-12-15T15:30:00Z',
    expiresAt: '2024-12-31T23:59:59Z'
  }
];

const mockNeeds = [
  {
    id: '1',
    userId: '2',
    userName: 'Maria Garcia',
    title: 'Grocery Assistance Needed',
    description: 'Need help with weekly grocery shopping and transportation to the store.',
    resourceType: 'food',
    location: 'Los Angeles, CA',
    urgency: 'high',
    isFulfilled: false,
    isActive: true,
    createdAt: '2024-06-02T12:00:00Z'
  },
  {
    id: '2',
    userId: '4',
    userName: 'Sarah Williams',
    title: 'Childcare Help',
    description: 'Need reliable childcare 2 days a week for school pickup and evening care.',
    resourceType: 'childcare',
    location: 'Portland, OR',
    urgency: 'critical',
    isFulfilled: false,
    isActive: true,
    createdAt: '2024-06-08T16:45:00Z'
  },
  // Additional realistic needs
  {
    id: '3',
    userId: '7',
    userName: 'Robert Thompson',
    title: 'Help Moving to New Apartment',
    description: 'Need help packing, loading truck, and unloading at new place. Also need furniture assembly assistance.',
    resourceType: 'transportation',
    location: 'Chicago, IL',
    urgency: 'medium',
    isFulfilled: false,
    isActive: true,
    createdAt: '2024-11-10T09:30:00Z'
  },
  {
    id: '4',
    userId: '9',
    userName: 'Michael Okafor',
    title: 'College Application Assistance',
    description: 'Need help with college applications, essay writing, and financial aid forms. First-generation college student.',
    resourceType: 'education',
    location: 'Atlanta, GA',
    urgency: 'high',
    isFulfilled: false,
    isActive: true,
    createdAt: '2024-11-18T14:20:00Z'
  },
  {
    id: '5',
    userId: '2',
    userName: 'Maria Garcia',
    title: 'Medical Appointment Transportation',
    description: 'Need rides to monthly doctor appointments. No car available and public transit is difficult with mobility issues.',
    resourceType: 'transportation',
    location: 'Los Angeles, CA',
    urgency: 'medium',
    isFulfilled: false,
    isActive: true,
    createdAt: '2024-11-22T11:15:00Z'
  },
  {
    id: '6',
    userId: '4',
    userName: 'Sarah Williams',
    title: 'Evening Meal Preparation Help',
    description: 'Need help preparing simple, healthy meals for my family during weekdays. Work full-time and exhausted in evenings.',
    resourceType: 'food',
    location: 'Portland, OR',
    urgency: 'medium',
    isFulfilled: false,
    isActive: true,
    createdAt: '2024-11-28T17:30:00Z'
  },
  {
    id: '7',
    userId: '7',
    userName: 'Robert Thompson',
    title: 'Furniture Assembly Help',
    description: 'Need help assembling new bedroom furniture and bookshelves. Tools available but lack experience.',
    resourceType: 'skills',
    location: 'Chicago, IL',
    urgency: 'low',
    isFulfilled: false,
    isActive: true,
    createdAt: '2024-12-01T10:45:00Z'
  },
  {
    id: '8',
    userId: '9',
    userName: 'Michael Okafor',
    title: 'Scholarship Application Help',
    description: 'Need guidance on finding and applying for scholarships for undergraduate studies. Limited internet access at home.',
    resourceType: 'education',
    location: 'Atlanta, GA',
    urgency: 'high',
    isFulfilled: false,
    isActive: true,
    createdAt: '2024-12-05T13:20:00Z'
  },
  // Additional community needs
  {
    id: '9',
    userId: '12',
    userName: 'Priya Sharma',
    title: 'English Tutoring for Child',
    description: 'Need help with English tutoring for my 8-year-old daughter who is learning English as a second language.',
    resourceType: 'education',
    location: 'San Diego, CA',
    urgency: 'medium',
    isFulfilled: false,
    isActive: true,
    createdAt: '2024-12-08T11:15:00Z'
  },
  {
    id: '10',
    userId: '14',
    userName: 'Fatima Al-Hassan',
    title: 'Grocery Shopping Assistance',
    description: 'Need assistance with weekly grocery shopping due to mobility issues from recent surgery.',
    resourceType: 'food',
    location: 'Houston, TX',
    urgency: 'high',
    isFulfilled: false,
    isActive: true,
    createdAt: '2024-12-10T09:30:00Z'
  },
  {
    id: '11',
    userId: '16',
    userName: 'Yuki Tanaka',
    title: 'Computer Skills Training',
    description: 'Need help learning basic computer skills and how to apply for jobs online. Recently moved to the US.',
    resourceType: 'education',
    location: 'San Jose, CA',
    urgency: 'medium',
    isFulfilled: false,
    isActive: true,
    createdAt: '2024-12-12T14:20:00Z'
  },
  {
    id: '12',
    userId: '18',
    userName: 'Elena Volkov',
    title: 'Winter Clothing and Blankets',
    description: 'Need winter clothing and blankets for my family of four. Recently lost job and struggling financially.',
    resourceType: 'clothing',
    location: 'Denver, CO',
    urgency: 'high',
    isFulfilled: false,
    isActive: true,
    createdAt: '2024-12-15T16:45:00Z'
  },
  {
    id: '13',
    userId: '2',
    userName: 'Maria Garcia',
    title: 'Spanish Translation Help',
    description: 'Need help with Spanish translation for medical documents and forms. Limited English proficiency.',
    resourceType: 'skills',
    location: 'Los Angeles, CA',
    urgency: 'medium',
    isFulfilled: false,
    isActive: true,
    createdAt: '2024-12-18T10:30:00Z'
  },
  {
    id: '14',
    userId: '4',
    userName: 'Sarah Williams',
    title: 'After-School Care',
    description: 'Need reliable after-school care for my 6-year-old daughter 3 days a week. Work part-time.',
    resourceType: 'childcare',
    location: 'Portland, OR',
    urgency: 'medium',
    isFulfilled: false,
    isActive: true,
    createdAt: '2024-12-20T13:15:00Z'
  },
  {
    id: '15',
    userId: '7',
    userName: 'Robert Thompson',
    title: 'Furniture for New Apartment',
    description: 'Need basic furniture (bed, table, chairs) for new apartment. Recently got job after homelessness.',
    resourceType: 'other',
    location: 'Chicago, IL',
    urgency: 'medium',
    isFulfilled: false,
    isActive: true,
    createdAt: '2024-12-22T11:45:00Z'
  },
  {
    id: '16',
    userId: '9',
    userName: 'Michael Okafor',
    title: 'Professional Resume Review',
    description: 'Need professional resume review and interview preparation for job applications in engineering field.',
    resourceType: 'skills',
    location: 'Atlanta, GA',
    urgency: 'high',
    isFulfilled: false,
    isActive: true,
    createdAt: '2024-12-25T09:20:00Z'
  }
];

const mockConnections = [
  {
    id: '1',
    userId: '1',
    otherUserId: '2',
    otherUser: mockUsers[1],
    status: 'active',
    post: mockNeeds[0],
    messages: [
      {
        id: '1',
        senderId: '1',
        text: 'Hi Maria, I saw your post about grocery assistance. I\'d be happy to help!',
        timestamp: '2024-06-03T09:30:00Z'
      },
      {
        id: '2',
        senderId: '2',
        text: 'Thank you so much, Alex! That would be a huge help.',
        timestamp: '2024-06-03T10:15:00Z'
      }
    ],
    createdAt: '2024-06-03T09:00:00Z'
  },
  {
    id: '2',
    userId: '3',
    otherUserId: '4',
    otherUser: mockUsers[3],
    status: 'pending',
    post: mockNeeds[1],
    messages: [
      {
        id: '1',
        senderId: '3',
        text: 'Hello Sarah, I\'m interested in helping with childcare. Can we discuss details?',
        timestamp: '2024-06-09T11:20:00Z'
      }
    ],
    createdAt: '2024-06-09T11:00:00Z'
  },
  // Additional realistic connections
  {
    id: '3',
    userId: '6',
    otherUserId: '7',
    otherUser: mockUsers[6],
    status: 'active',
    post: mockNeeds[2],
    messages: [
      {
        id: '1',
        senderId: '6',
        text: 'Hi Robert, I saw your moving post. I have a truck and can help with the heavy lifting!',
        timestamp: '2024-11-11T10:30:00Z'
      },
      {
        id: '2',
        senderId: '7',
        text: 'That\'s wonderful! When would you be available next week?',
        timestamp: '2024-11-11T11:15:00Z'
      },
      {
        id: '3',
        senderId: '6',
        text: 'I\'m free Tuesday and Thursday afternoons. Which works better for you?',
        timestamp: '2024-11-11T12:00:00Z'
      }
    ],
    createdAt: '2024-11-11T10:00:00Z'
  },
  {
    id: '4',
    userId: '10',
    otherUserId: '9',
    otherUser: mockUsers[8],
    status: 'active',
    post: mockNeeds[3],
    messages: [
      {
        id: '1',
        senderId: '10',
        text: 'Hello Michael, I\'d be happy to help with your college applications. I specialize in this area.',
        timestamp: '2024-11-19T09:45:00Z'
      },
      {
        id: '2',
        senderId: '9',
        text: 'Thank you so much! I really appreciate the help.',
        timestamp: '2024-11-19T10:30:00Z'
      }
    ],
    createdAt: '2024-11-19T09:30:00Z'
  },
  // Additional community connections
  {
    id: '5',
    userId: '11',
    otherUserId: '14',
    otherUser: mockUsers[13],
    status: 'active',
    post: mockNeeds[9],
    messages: [
      {
        id: '1',
        senderId: '11',
        text: 'Hi Fatima, I saw your post about grocery shopping assistance. I\'d be happy to help with that!',
        timestamp: '2024-12-10T10:30:00Z'
      },
      {
        id: '2',
        senderId: '14',
        text: 'That would be wonderful, Carlos. Thank you so much for your kindness.',
        timestamp: '2024-12-10T11:15:00Z'
      },
      {
        id: '3',
        senderId: '11',
        text: 'I can help this Saturday morning around 10 AM. Would that work for you?',
        timestamp: '2024-12-10T12:00:00Z'
      }
    ],
    createdAt: '2024-12-10T10:00:00Z'
  },
  {
    id: '6',
    userId: '17',
    otherUserId: '18',
    otherUser: mockUsers[17],
    status: 'pending',
    post: mockNeeds[11],
    messages: [
      {
        id: '1',
        senderId: '17',
        text: 'Hello Elena, I\'m a nurse and saw your need for winter clothing. I\'d like to help with this.',
        timestamp: '2024-12-15T17:30:00Z'
      }
    ],
    createdAt: '2024-12-15T17:00:00Z'
  },
  {
    id: '7',
    userId: '15',
    otherUserId: '16',
    otherUser: mockUsers[15],
    status: 'active',
    post: mockNeeds[10],
    messages: [
      {
        id: '1',
        senderId: '15',
        text: 'Hi Yuki, I saw your post about computer skills training. I\'d be happy to help you with that.',
        timestamp: '2024-12-12T15:30:00Z'
      },
      {
        id: '2',
        senderId: '16',
        text: 'Thank you so much, Thomas! I really need help with this.',
        timestamp: '2024-12-12T16:15:00Z'
      },
      {
        id: '3',
        senderId: '15',
        text: 'We can meet at the public library this Saturday. They have computers available for training.',
        timestamp: '2024-12-12T17:00:00Z'
      }
    ],
    createdAt: '2024-12-12T15:00:00Z'
  }
];

// Mock connections service
export const mockConnectionService = {
  async getConnections(filters = {}) {
    return mockConnections;
  },

  async getConnection(connectionId) {
    return mockConnections.find(conn => conn.id === connectionId);
  },

  async updateConnection(connectionId, connectionData) {
    const connectionIndex = mockConnections.findIndex(conn => conn.id === connectionId);
    if (connectionIndex === -1) return null;
    
    mockConnections[connectionIndex] = {
      ...mockConnections[connectionIndex],
      ...connectionData
    };
    
    return mockConnections[connectionIndex];
  },

  async connectToPost(postId, postType, message = '') {
    // Simulate creating a new connection
    const newConnection = {
      id: (mockConnections.length + 1).toString(),
      userId: '1',
      otherUserId: postType === 'offer' ? mockOffers.find(o => o.id === postId)?.userId : mockNeeds.find(n => n.id === postId)?.userId,
      status: 'pending',
      post: postType === 'offer' ? mockOffers.find(o => o.id === postId) : mockNeeds.find(n => n.id === postId),
      messages: message ? [{
        id: '1',
        senderId: '1',
        text: message,
        timestamp: new Date().toISOString()
      }] : [],
      createdAt: new Date().toISOString()
    };
    
    mockConnections.push(newConnection);
    return newConnection;
  }
};

// Mock authentication service
export const mockAuthService = {
  async login(credentials) {
    const user = mockUsers.find(u => u.email === credentials.email);
    if (!user || credentials.password !== 'password123') {
      throw new Error('Invalid credentials');
    }
    
    // Simulate JWT token
    const token = btoa(JSON.stringify({ 
      id: user.id, 
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour expiration
    }));
    
    return { 
      success: true, 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        phone: user.phone,
        location: user.location,
        did: user.did
      }
    };
  },

  async register(userData) {
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }
    
    // Create new user
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      type: userData.type,
      phone: userData.phone || '',
      location: userData.location || '',
      [userData.type === 'donor' ? 'skills' : 'needs']: userData.type === 'donor' ? userData.skills : userData.needs,
      did: `did:hopechain:${userData.type}:${mockUsers.length + 1}`,
      createdAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    
    // Simulate JWT token
    const token = btoa(JSON.stringify({ 
      id: newUser.id, 
      email: newUser.email,
      exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour expiration
    }));
    
    return { 
      success: true, 
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        type: newUser.type,
        phone: newUser.phone,
        location: newUser.location,
        did: newUser.did
      }
    };
  },

  async getCurrentUser() {
    // In a real implementation, this would decode the token
    // For mock purposes, we'll return the first user
    return mockUsers[0];
  },

  async getProfile() {
    return mockUsers[0];
  },

  async updateProfile(profileData) {
    // In a real implementation, this would update the user's profile
    return { ...mockUsers[0], ...profileData };
  }
};

// Mock post service
export const mockPostService = {
  async getOffers(filters = {}) {
    return mockOffers.filter(offer => {
      if (filters.location && !offer.location.includes(filters.location)) return false;
      if (filters.resourceType && offer.resourceType !== filters.resourceType) return false;
      if (filters.isActive !== undefined && offer.isActive !== filters.isActive) return false;
      return true;
    });
  },

  async getNeeds(filters = {}) {
    return mockNeeds.filter(need => {
      if (filters.location && !need.location.includes(filters.location)) return false;
      if (filters.resourceType && need.resourceType !== filters.resourceType) return false;
      if (filters.isFulfilled !== undefined && need.isFulfilled !== filters.isFulfilled) return false;
      if (filters.isActive !== undefined && need.isActive !== filters.isActive) return false;
      return true;
    });
  },

  async createOffer(offerData) {
    const newOffer = {
      id: (mockOffers.length + 1).toString(),
      userId: '1',
      userName: 'Current User',
      ...offerData,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    mockOffers.push(newOffer);
    return newOffer;
  },

  async createNeed(needData) {
    const newNeed = {
      id: (mockNeeds.length + 1).toString(),
      userId: '1',
      userName: 'Current User',
      ...needData,
      createdAt: new Date().toISOString(),
      isFulfilled: false,
      isActive: true
    };
    mockNeeds.push(newNeed);
    return newNeed;
  }
};

// Combined mock data service
export const mockDataService = {
  ...mockAuthService,
  ...mockPostService,
  ...mockConnectionService
};

export default mockDataService;