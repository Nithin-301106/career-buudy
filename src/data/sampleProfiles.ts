export const SAMPLE_RESUME_PROFILES = [
  {
    label: 'CS / Software Fresher',
    fullName: 'Maya Patel',
    email: 'maya.patel@stateuniv.edu',
    phone: '(555) 349-8201',
    location: 'Austin, TX',
    targetRole: 'Junior Software Engineer / Frontend Intern',
    education: 'B.S. in Computer Science, State University, Expected May 2027 (GPA: 3.8/4.0). Relevant Coursework: Data Structures & Algorithms, Web Applications, Database Systems, Software Engineering.',
    skills: 'TypeScript, JavaScript, React, Node.js, Express, Tailwind CSS, Python, Git, PostgreSQL, REST APIs, Agile Collaboration, Problem Solving',
    projects: '1. StudySquad Peer Tutor App: Full-stack React & Express platform enabling 200+ campus students to book tutoring sessions; implemented real-time slot booking.\n2. Campus Budget Tracker: Python & SQLite tool parsing student meal-card statements with data visualization.',
    achievements: 'Dean\'s Honor List (4 semesters), Hackathon 2nd Place Winner (HackState 2026), Vice President of Association for Computing Machinery (ACM) Student Chapter',
    experience: 'Undergraduate Teaching Assistant (CS 101) - Hosted weekly laboratory sessions for 45 students, graded assignments, and guided debugging.',
  },
  {
    label: 'Data Science & Analytics',
    fullName: 'Liam Reynolds',
    email: 'l.reynolds@college.edu',
    phone: '(555) 782-9914',
    location: 'Chicago, IL',
    targetRole: 'Data Analyst Intern',
    education: 'B.S. in Data Science & Applied Statistics, Metro University, Class of 2026. Relevant Coursework: Predictive Modeling, Statistical Inference, Machine Learning, Data Wrangling.',
    skills: 'Python (Pandas, NumPy, Scikit-Learn), SQL, Tableau, Power BI, Excel (Advanced, PivotTables), Git, Statistical Hypothesis Testing, Data Storytelling',
    projects: '1. Urban Transit Delay Predictor: Built classification models using Chicago Open Data; achieved 84% accuracy in predicting bus delay patterns.\n2. Campus Dining Food Waste Dashboard: Interactive Tableau dashboard analyzing dining hall surplus food metrics.',
    achievements: 'Kaggle Bronze Notebook Contributor, Certified Google Data Analytics Professional Certificate, 1st Place Campus Datathon 2026',
    experience: 'Student Research Assistant (Economics Lab) - Cleaned 10,000+ consumer survey rows and produced regression summary charts for faculty publication.',
  },
  {
    label: 'Marketing & Business Intern',
    fullName: 'Sarah Jenkins',
    email: 'sjenkins@univ.edu',
    phone: '(555) 412-6733',
    location: 'Seattle, WA',
    targetRole: 'Digital Marketing & Growth Intern',
    education: 'B.B.A. in Marketing, School of Business, Graduating Dec 2026 (Minor in Communications). Coursework: Consumer Behavior, Digital Marketing Analytics, Brand Strategy.',
    skills: 'Google Analytics 4, Meta Ads Manager, SEO Copywriting, Canva, Figma (Basics), HubSpot CRM, Content Strategy, Email Campaigns',
    projects: '1. Campus Sustainable Thrift Fair: Designed Instagram campaign generating 1,400+ attendees and $8,000 in student donations.\n2. Small Business Rebrand Case Study: Formulated 6-month organic TikTok growth strategy for a local cafe.',
    achievements: 'Google Ads Search Certification, HubSpot Inbound Marketing Certified, President of American Marketing Association Student Chapter',
    experience: 'Student Union Marketing Coordinator - Managed social accounts with 12k followers, published weekly reels and increased engagement by 35%.',
  },
];

export const POPULAR_ROLES = [
  'Frontend Developer',
  'Full Stack Engineer',
  'Data Analyst',
  'Product Management Intern',
  'Machine Learning Intern',
  'Cybersecurity Analyst',
  'UI/UX Designer',
  'Digital Marketing Intern',
];

export const SAMPLE_INTERVIEW_QUESTIONS = [
  {
    role: 'Frontend Developer',
    question: 'How do you optimize the loading performance of a web application built with React?',
    draftAnswer: 'I make sure to compress images and use React lazy loading for components that are not needed right away. Also I check the network tab in Chrome to see big bundles and use code splitting with Vite so the user doesn\'t download everything at once.',
  },
  {
    role: 'Software Engineer',
    question: 'Tell me about a time you faced a difficult technical bug in a group project and how you solved it.',
    draftAnswer: 'In my database project, our team got strange race condition errors when multiple users tried to reserve a room at the exact same second. My team was stressed and didn\'t know why. I read the logs, realized we didn\'t have row-level locks or transactions in PostgreSQL. I wrote a small reproduction script, added transaction isolation, and tested with 50 concurrent simulated requests. It fixed the error and we submitted our project on time with an A grade.',
  },
  {
    role: 'Any Role (Behavioral)',
    question: 'Tell me about a time you had to learn a completely new tool or programming language under a tight deadline.',
    draftAnswer: 'For our 36-hour hackathon, we decided to build a mobile app, but I had only written Python before and we needed to use Flutter and Dart. I spent the first 3 hours reading the official flutter docs, followed a quick starter tutorial, and was able to build the 4 main screens and connect our backend API before the final demo presentation.',
  },
];

export const SAMPLE_CAREER_GUIDANCE_PRESETS = [
  {
    label: 'Tech + Creative Design',
    interests: 'Creating intuitive digital products, visual storytelling, understanding how humans interact with technology, and building modern web apps.',
    skills: 'HTML/CSS, Figma basics, JavaScript, empathy, communication, eye for typography and color schemes.',
    favoriteSubjects: 'Human-Computer Interaction, Web Development, Cognitive Psychology, Graphic Design.',
    degree: 'B.S. in Computer Science (or Design / Interactive Media)',
  },
  {
    label: 'Data + Problem Solving',
    interests: 'Uncovering trends in numbers, finding solutions to business problems, automating repetitive tasks, building predictive models.',
    skills: 'Python, Excel, basic SQL, statistical reasoning, critical thinking, attention to detail.',
    favoriteSubjects: 'Statistics, Linear Algebra, Microeconomics, Intro to Programming.',
    degree: 'B.S. in Mathematics / Economics / Data Science',
  },
  {
    label: 'People + Strategy & Tech',
    interests: 'Leading student clubs, organizing hackathons, bridging the gap between developers and end users, prioritizing feature roadmaps.',
    skills: 'Public speaking, organization, project management, active listening, basic agile concepts.',
    favoriteSubjects: 'Product Management, Organizational Behavior, Marketing, Computer Science principles.',
    degree: 'B.S. in Business Information Systems or Management',
  },
];
