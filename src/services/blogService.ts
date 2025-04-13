// Blog service that connects to JSON Server API
import { toast } from "sonner";

// Update API URL to use relative path which will work in both development and production
const API_URL = "/api";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  readingTime: number;
  featured: boolean;
  published?: boolean;
  publishedAt?: string;
  updatedAt?: string;
}

// Fallback to initial blog posts if the API is not available
const initialBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Artificial Intelligence in Content Creation",
    slug: "future-ai-content-creation",
    excerpt: "Exploring how AI is revolutionizing content creation and what it means for writers and creators in the digital age.",
    content: `<p>Artificial Intelligence (AI) has rapidly transformed numerous industries, and content creation is no exception. Advanced language models like GPT-4 have demonstrated remarkable abilities in generating human-like text, sparking both excitement and concern among professional writers.</p>

<h2>The Current State of AI Content Creation</h2>

<p>Today's AI writing tools can produce blog posts, marketing copy, and even creative fiction that's increasingly difficult to distinguish from human-written content. These tools analyze patterns in language, learn from vast datasets, and generate text that adheres to specified styles and formats.</p>

<p>The implications are significant: businesses can now produce content at scale, reducing costs and accelerating production timelines. Small teams can compete with larger content operations, and solo creators can amplify their output.</p>

<h2>Emerging Trends and Capabilities</h2>

<p>Several key developments are shaping the future of AI in content creation:</p>

<ul>
<li><strong>Specialized AI Writers:</strong> Tools tailored for specific industries or content types are emerging, offering deeper expertise in niches like technical documentation or legal writing.</li>
<li><strong>Multimodal Content Generation:</strong> AI systems that integrate text generation with image creation, allowing for comprehensive content packages.</li>
<li><strong>Collaborative Writing:</strong> AI assistants that work alongside human writers, suggesting improvements, generating outlines, or expanding on key points.</li>
</ul>

<h2>The Human-AI Partnership</h2>

<p>Rather than replacing human writers entirely, the most promising future seems to be one of collaboration. AI excels at tasks like research compilation, generating draft content, and optimizing for SEO, while humans bring creativity, emotional intelligence, and strategic thinking.</p>

<p>This partnership allows content creators to focus on higher-level tasks like developing unique perspectives and creating emotional connections with audiences.</p>

<h2>Ethical Considerations</h2>

<p>As AI content creation advances, important ethical questions arise:</p>

<ul>
<li>How should AI-generated content be attributed?</li>
<li>What responsibilities do publishers have regarding transparency?</li>
<li>How can we ensure AI tools don't propagate biases or misinformation?</li>
</ul>

<p>These questions will require ongoing discussion among creators, publishers, and technology developers.</p>

<h2>Looking Ahead</h2>

<p>The future of content creation likely involves a hybrid approach where AI handles routine and scale-dependent tasks while human creativity provides the distinctive voice and strategic direction that resonates with audiences.</p>

<p>For content creators, developing skills that complement AI capabilities—such as strategic thinking, emotional storytelling, and ethical judgment—will be crucial for success in this evolving landscape.</p>`,
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad695",
    author: "Dr. Sarah Chen",
    date: "2024-04-05",
    category: "technology",
    tags: ["artificial intelligence", "content creation", "digital media"],
    readingTime: 6,
    featured: true,
    published: true,
    publishedAt: "2024-04-05T10:30:00Z",
    updatedAt: "2024-04-05T10:30:00Z",
  },
  {
    id: "2",
    title: "Quantum Computing: Breaking Down the Basics",
    slug: "quantum-computing-basics",
    excerpt: "A beginner-friendly exploration of quantum computing principles and why they matter for the future of technology.",
    content: `<p>Quantum computing represents one of the most significant technological leaps of our era, promising computational capabilities that vastly exceed today's most powerful supercomputers. Yet for many, the fundamental concepts remain shrouded in complex physics and mathematics.</p>

<h2>Beyond Binary: The Quantum Difference</h2>

<p>Traditional computers process information in binary digits (bits) that exist as either 0 or 1. Quantum computers, however, use quantum bits or "qubits" that can exist in multiple states simultaneously thanks to the principles of quantum mechanics.</p>

<p>This property, called superposition, allows quantum computers to process vast amounts of information simultaneously rather than sequentially. When combined with another quantum property called entanglement—where qubits become interconnected and act as a system—quantum computers can solve certain problems exponentially faster than classical computers.</p>

<h2>Practical Applications on the Horizon</h2>

<p>While still in relatively early stages of development, quantum computing has several promising applications:</p>

<ul>
<li><strong>Cryptography:</strong> Quantum computers could break many current encryption methods but also enable new, more secure forms of encryption.</li>
<li><strong>Drug Discovery:</strong> Simulating molecular interactions at the quantum level could revolutionize pharmaceutical research and dramatically accelerate drug development.</li>
<li><strong>Climate Modeling:</strong> Complex climate systems could be modeled more accurately, improving our understanding of climate change and potential mitigation strategies.</li>
<li><strong>Optimization Problems:</strong> From logistics to financial modeling, quantum computing excels at finding optimal solutions among countless possibilities.</li>
</ul>

<h2>Current Limitations</h2>

<p>Despite its potential, quantum computing faces significant challenges:</p>

<ul>
<li>Maintaining quantum states is extremely difficult; qubits are highly sensitive to environmental interference.</li>
<li>Error rates remain high, requiring complex error correction mechanisms.</li>
<li>Scaling up quantum systems while maintaining coherence presents major engineering challenges.</li>
</ul>

<h2>The Quantum Timeline</h2>

<p>Most experts believe we are still years away from quantum computers that can consistently outperform classical computers on practical problems—a milestone known as "quantum advantage" or "quantum supremacy."</p>

<p>However, progress has accelerated in recent years. Companies like IBM, Google, and startups like Rigetti Computing are steadily increasing qubit counts and reducing error rates. Major investments from governments and private sector are fueling this progress.</p>

<h2>Preparing for a Quantum Future</h2>

<p>While universal quantum computers may still be on the horizon, organizations are already preparing by:</p>

<ul>
<li>Exploring "quantum-ready" algorithms that could be implemented once the hardware matures</li>
<li>Identifying high-value problems within their operations that quantum computing could address</li>
<li>Developing talent with cross-disciplinary expertise in quantum information science</li>
</ul>

<p>Understanding the basics of quantum computing isn't just for physicists anymore—it's becoming essential knowledge for forward-thinking technologists, business leaders, and policymakers as we enter the quantum era.</p>`,
    coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    author: "Prof. Alan Moretti",
    date: "2024-04-02",
    category: "science",
    tags: ["quantum computing", "technology", "physics"],
    readingTime: 8,
    featured: false,
  },
  {
    id: "3",
    title: "The Renaissance of Analog Hobbies in a Digital World",
    slug: "renaissance-analog-hobbies",
    excerpt: "How traditional crafts and analog pastimes are finding new popularity among digital natives seeking tangible experiences.",
    content: `<p>In an era defined by screens, cloud storage, and digital experiences, something unexpected is happening: analog hobbies are making a powerful comeback. From vinyl records to film photography, letterpress printing to handwritten journaling, activities that seemed destined for obsolescence are instead finding passionate new audiences.</p>

<h2>The Numbers Don't Lie</h2>

<p>This isn't just anecdotal—the statistics reveal a clear trend:</p>

<ul>
<li>Vinyl record sales have increased for the 15th consecutive year, with over 41 million records sold in 2021 alone.</li>
<li>Sales of physical books have remained resilient even as e-books became widely available, with hardcover sales actually increasing in recent years.</li>
<li>Film photography has seen such a resurgence that manufacturers have reintroduced discontinued film stocks to meet demand.</li>
<li>Craft and hobby stores report double-digit growth in sales of traditional crafting supplies.</li>
</ul>

<h2>Why Now? The Psychology Behind the Trend</h2>

<p>Several factors explain this renaissance of the tangible:</p>

<h3>Digital Fatigue</h3>

<p>After spending hours in videoconferences and scrolling through social media, many people crave experiences that engage different senses and exist in physical rather than virtual space.</p>

<h3>The Satisfaction of Creation</h3>

<p>Analog hobbies often produce physical results—a developed photograph, a hand-bound journal, a knitted scarf. In a world where much of our work exists only as digital files, creating something you can touch provides unique satisfaction.</p>

<h3>Mindfulness and Presence</h3>

<p>Many analog activities require focused attention and engage the senses fully, providing a natural form of mindfulness practice that digital activities often lack.</p>

<h3>Connection to History and Tradition</h3>

<p>Learning traditional skills connects practitioners to human history and crafting traditions, offering a sense of continuity and perspective that can be grounding in times of rapid technological change.</p>

<h2>Not Anti-Technology, But Complementary</h2>

<p>Interestingly, the internet has played a crucial role in this analog renaissance. Online communities help newcomers learn traditional skills, social media platforms allow creators to share their analog creations, and e-commerce makes specialized supplies accessible worldwide.</p>

<p>Many enthusiasts move fluidly between digital and analog worlds—the film photographer who shares scanned images on Instagram, or the letterpress printer who designs on a computer before moving to a physical press.</p>

<h2>Five Analog Hobbies Experiencing Renewed Interest</h2>

<h3>1. Paper Crafts and Journaling</h3>

<p>Bullet journals, scrapbooking, and paper planners have found devoted followers who appreciate the tactile experience and creative control impossible to replicate in digital apps.</p>

<h3>2. Analog Gaming</h3>

<p>Board games and tabletop role-playing games are experiencing a golden age, with players valuing the face-to-face social interaction and physical components.</p>

<h3>3. Fiber Arts</h3>

<p>Knitting, crochet, weaving, and embroidery have attracted younger practitioners who appreciate both the meditative process and the sustainable, personalized alternative to fast fashion.</p>

<h3>4. Home Food Production</h3>

<p>Sourdough bread baking, fermentation, canning, and preservation connect people to food traditions while providing tangible (and delicious) results.</p>

<h3>5. Analog Audio</h3>

<p>Beyond vinyl records, interest in cassette tapes, high-fidelity audio equipment, and even radio has grown among audiophiles seeking richer listening experiences.</p>

<h2>The Future is Hybrid</h2>

<p>Rather than representing a rejection of technology, the analog renaissance suggests that many people are seeking a more balanced relationship with the digital world—one that incorporates the best of both realms.</p>

<p>This hybrid approach allows us to enjoy the convenience and connectivity of digital tools while still experiencing the rich sensory engagement, presence, and tangible satisfaction that analog activities uniquely provide.</p>`,
    coverImage: "https://images.unsplash.com/photo-1505850557988-b858c1e42f1c",
    author: "Emma Rodriguez",
    date: "2024-03-28",
    category: "culture",
    tags: ["hobbies", "analog", "crafts", "digital culture"],
    readingTime: 7,
    featured: true,
  },
  {
    id: "4",
    title: "Sustainable Business Models: The Competitive Advantage of Going Green",
    slug: "sustainable-business-models",
    excerpt: "How companies are finding that environmental responsibility isn't just ethical—it's becoming a crucial competitive advantage.",
    content: `<p>For decades, sustainability initiatives were often viewed as corporate social responsibility projects—important for public relations but separate from core business strategy. Today, that paradigm is rapidly shifting as businesses discover that sustainable practices aren't just good for the planet—they're increasingly essential for maintaining competitive advantage.</p>

<h2>The Market Forces Driving Sustainable Business</h2>

<p>Several powerful factors are converging to make sustainability a business imperative:</p>

<h3>Consumer Demand</h3>

<p>Modern consumers increasingly make purchasing decisions based on environmental impact:</p>
<ul>
<li>73% of global consumers say they would definitely or probably change their consumption habits to reduce environmental impact.</li>
<li>Gen Z and Millennial consumers show particularly strong preference for sustainable brands, with over 60% willing to pay more for environmentally responsible products.</li>
</ul>

<h3>Investor Pressure</h3>

<p>The financial markets are driving change from the top:</p>
<ul>
<li>ESG (Environmental, Social, and Governance) investing has grown to over $30 trillion in assets under management globally.</li>
<li>Major investment firms like BlackRock have made climate risk a central factor in investment decisions.</li>
<li>Companies with strong sustainability performance often show lower volatility and better long-term returns.</li>
</ul>

<h3>Resource Economics</h3>

<p>Practical business considerations are aligning with environmental goals:</p>
<ul>
<li>Energy efficiency measures directly reduce operational costs.</li>
<li>Renewable energy prices have fallen dramatically, often making them the most economical energy choice.</li>
<li>Circular economy business models can reduce dependence on volatile raw material markets.</li>
</ul>

<h3>Regulatory Landscape</h3>

<p>Government policy increasingly incentivizes sustainability:</p>
<ul>
<li>Carbon pricing mechanisms are expanding globally.</li>
<li>Disclosure requirements for climate risk and environmental impact are becoming mandatory in many markets.</li>
<li>Government procurement increasingly favors sustainable products and services.</li>
</ul>

<h2>Sustainability as Strategic Advantage</h2>

<p>Forward-thinking companies are finding multiple ways to convert sustainability initiatives into competitive advantages:</p>

<h3>Innovation Driver</h3>

<p>Sustainability challenges can catalyze innovation. When Unilever committed to reducing packaging waste, it developed concentrated detergents that require smaller bottles, cutting shipping weight and costs while addressing environmental concerns.</p>

<h3>Brand Differentiation</h3>

<p>In crowded markets, sustainability can provide meaningful differentiation. Patagonia has built extraordinary brand loyalty through environmental leadership, allowing it to command premium prices while spending minimal amounts on traditional advertising.</p>

<h3>Talent Attraction and Retention</h3>

<p>Environmental commitment increasingly influences employment decisions. Studies show that nearly 40% of millennials have chosen a job because of company sustainability, and 70% say they're more likely to work for a company with a strong environmental agenda.</p>

<h3>Risk Mitigation</h3>

<p>Proactive sustainability programs help companies anticipate and prepare for environmental regulations, resource constraints, and changing market conditions—reducing vulnerability to disruption.</p>

<h2>Case Studies: Sustainability Drives Business Success</h2>

<h3>IKEA: Circular Economy Pioneer</h3>

<p>IKEA has embraced circular business models with initiatives like furniture buyback programs, repair services, and designing products for disassembly and recycling. These initiatives not only reduce environmental impact but create new revenue streams and deepen customer relationships through multiple touchpoints.</p>

<h3>Interface: Radical Transformation</h3>

<p>Carpet manufacturer Interface set an ambitious goal to eliminate any negative environmental impact by 2020. Through radical innovation in manufacturing processes, materials sourcing, and product design, the company reduced greenhouse gas emissions by 96%, water usage by 88%, and has become a highly profitable industry leader recognized for both quality and sustainability.</p>

<h3>Tesla: Sustainability as Core Value Proposition</h3>

<p>While many companies add sustainability to existing business models, Tesla built its entire value proposition around sustainable technology. By focusing relentlessly on making electric vehicles desirable performance products rather than just eco-friendly alternatives, Tesla transformed an entire industry and achieved remarkable market valuation.</p>

<h2>Moving Beyond Trade-offs</h2>

<p>The most successful sustainable businesses are those that move beyond viewing environmental responsibility as a trade-off against profitability. Instead, they strategically redesign their business models to create value through sustainability—developing products and services that are superior precisely because they're more environmentally responsible.</p>

<p>As resource constraints intensify, environmental regulations strengthen, and consumer preferences continue to evolve, this integration of sustainability and strategy will likely become not just an advantage but a prerequisite for business success.</p>`,
    coverImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174",
    author: "Marcus Green",
    date: "2024-03-25",
    category: "business",
    tags: ["sustainability", "business strategy", "corporate responsibility"],
    readingTime: 9,
    featured: false,
  },
  {
    id: "5",
    title: "The Minimalist Approach to Digital Productivity",
    slug: "minimalist-digital-productivity",
    excerpt: "How embracing digital minimalism can help you focus better and accomplish more in a distraction-filled world.",
    content: `<p>In our hyperconnected world, the average knowledge worker faces an unprecedented barrage of digital distractions. Notifications, emails, messages, and the ever-present lure of social media create a fragmented attention environment where sustained focus becomes increasingly rare and valuable.</p>

<p>Enter digital minimalism: a philosophy that applies minimalist principles to our digital lives, focusing on intentionality and maximizing value while reducing digital clutter. This approach isn't about rejecting technology, but rather about being more deliberate about which technologies we allow into our lives and how we use them.</p>

<h2>The Cognitive Cost of Digital Abundance</h2>

<p>Research increasingly shows that the "always-on" digital lifestyle comes with significant cognitive costs:</p>

<ul>
<li>Studies demonstrate that even the presence of a smartphone (even when turned off) reduces available cognitive capacity.</li>
<li>The average worker is interrupted every 3 minutes and 5 seconds, and it takes 23 minutes on average to fully return to the original task.</li>
<li>Multitasking can reduce productivity by up to 40% and lower IQ by 10 points temporarily.</li>
</ul>

<p>These cognitive costs aren't just affecting productivity—they're changing how we think. Many people report diminished ability to read deeply, sustain attention, or engage in complex thinking.</p>

<h2>Core Principles of Digital Minimalism</h2>

<h3>1. Intentionality Over Convenience</h3>

<p>Digital minimalists choose tools and platforms based on how they align with personal values and goals, not just because they're convenient or popular. This might mean using a specialized writing app rather than a multi-purpose platform filled with distractions, or choosing communications tools that respect focus rather than demand immediate attention.</p>

<h3>2. Quality Over Quantity</h3>

<p>Focus on a smaller number of truly valuable digital activities rather than trying to maintain a presence everywhere. This might mean being active on just one or two social platforms where meaningful connections happen, rather than maintaining accounts across a dozen networks.</p>

<h3>3. Return on Attention</h3>

<p>Evaluate digital tools based on the return they provide for the attention they require. Some digital activities provide enormous value for minimal attention cost, while others consume vast amounts of attention while providing minimal benefit.</p>

<h2>Practical Strategies for Digital Minimalism</h2>

<h3>The Digital Declutter</h3>

<p>Begin with a 30-day period where you step back from optional technologies. This break helps reset your digital habits and clarifies which tools genuinely add value to your life. After the declutter period, reintroduce technologies intentionally, with clear rules for when and how you'll use them.</p>

<h3>Attention-Protecting Techniques</h3>

<ul>
<li><strong>Time-Blocking:</strong> Schedule specific times for email, messages, and social media rather than allowing them to interrupt throughout the day.</li>
<li><strong>Tool Consolidation:</strong> Use fewer, better tools rather than maintaining many partially overlapping apps and services.</li>
<li><strong>Notification Batching:</strong> Configure devices to deliver notifications in batches at scheduled times rather than immediately.</li>
<li><strong>Physical Separation:</strong> Create physical distance between yourself and potential digital distractions during focus periods.</li>
</ul>

<h3>Digital Environment Design</h3>

<p>Just as minimalists carefully design their physical spaces, digital minimalists intentionally shape their digital environments:</p>

<ul>
<li>Remove tempting apps from home screens and replace them with tools that support focused work.</li>
<li>Use website blockers during designated deep work periods.</li>
<li>Create separate user profiles or devices for different contexts (e.g., a "work mode" with minimal distractions).</li>
<li>Implement interface minimalism by using simple, text-based tools when possible and reducing visual clutter.</li>
</ul>

<h2>The Productivity Paradox</h2>

<p>Perhaps counterintuitively, doing less in the digital realm often leads to accomplishing more. By eliminating low-value digital activities and protecting attention for high-value work, digital minimalists frequently report not just greater productivity but also improved creativity, deeper thinking, and more meaningful connections.</p>

<p>This happens because digital minimalism facilitates states of flow—the highly productive psychological state where we're fully immersed in challenging, meaningful work. Flow states are nearly impossible to achieve with constant digital interruptions, but become more accessible when we create space for sustained attention.</p>

<h2>Beyond Productivity: Digital Wellness</h2>

<p>While productivity gains are a common benefit, many digital minimalists report that the most significant improvements come in overall well-being:</p>

<ul>
<li>Reduced anxiety and FOMO (fear of missing out)</li>
<li>Improved sleep quality by eliminating pre-bedtime screen exposure</li>
<li>More present and meaningful face-to-face interactions</li>
<li>Enhanced ability to enjoy solitude and engage in deep thinking</li>
<li>Greater intentionality and alignment between digital behavior and personal values</li>
</ul>

<h2>Starting Your Digital Minimalism Practice</h2>

<p>The journey to digital minimalism doesn't require dramatic technological rejection. It starts simply:</p>

<ol>
<li>Identify your highest-value work and the digital tools that genuinely support it.</li>
<li>Notice which digital habits drain time and attention without providing proportional value.</li>
<li>Experiment with temporarily removing or strictly limiting low-value digital activities.</li>
<li>Observe changes in your focus, productivity, and overall well-being.</li>
<li>Gradually build a more intentional digital environment based on what you learn.</li>
</ol>

<p>In a world where attention is increasingly fragmented and scattered, the ability to focus deeply is becoming both rarer and more valuable. Digital minimalism offers a path to reclaiming that attention and directing it toward what truly matters.</p>`,
    coverImage: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72",
    author: "Jasmine Lee",
    date: "2024-03-20",
    category: "technology",
    tags: ["productivity", "digital minimalism", "focus", "attention management"],
    readingTime: 8,
    featured: false,
  },
  {
    id: "6",
    title: "The Science of Sleep: New Discoveries and Practical Applications",
    slug: "science-of-sleep-discoveries",
    excerpt: "Recent breakthroughs in sleep science and how they can help you optimize your rest for better health and cognitive performance.",
    content: `<p>Sleep, once dismissed as a simple state of inactivity, is now recognized as a complex and active process essential to physical health, cognitive function, and emotional wellbeing. Recent scientific advances have dramatically expanded our understanding of what happens during sleep and why it matters so much.</p>

<h2>The Architecture of Sleep: Beyond REM</h2>

<p>For decades, scientists divided sleep into REM (rapid eye movement) and non-REM stages. Recent research has revealed more intricate patterns:</p>

<ul>
<li><strong>N1:</strong> The transitional stage between wakefulness and sleep.</li>
<li><strong>N2:</strong> Characterized by sleep spindles and K-complexes, this stage now appears crucial for memory consolidation and learning.</li>
<li><strong>N3:</strong> Deep slow-wave sleep vital for physical restoration and immune function.</li>
<li><strong>REM:</strong> The dreaming stage critical for emotional processing and creative problem-solving.</li>
</ul>

<p>Advanced neuroimaging has shown that these stages aren't uniform across the brain—different regions can experience different sleep stages simultaneously, creating a more mosaic-like pattern than previously understood.</p>

<h2>Key Discoveries Changing Our Understanding of Sleep</h2>

<h3>The Glymphatic System: Sleep as Brain Maintenance</h3>

<p>Perhaps the most revolutionary recent discovery is the brain's glymphatic system—a waste clearance mechanism that becomes dramatically more active during sleep. This system removes potentially harmful proteins, including beta-amyloid associated with Alzheimer's disease.</p>

<p>This finding helps explain why chronic sleep deprivation is associated with increased risk of neurodegenerative diseases and suggests that adequate sleep isn't just helpful but necessary for long-term brain health.</p>

<h3>Sleep and Memory Consolidation</h3>

<p>Sleep doesn't just restore energy—it actively processes information acquired during wakefulness. During sleep, the brain:</p>

<ul>
<li>Transfers memories from temporary to longer-term storage</li>
<li>Strengthens important neural connections while pruning less important ones</li>
<li>Integrates new information with existing knowledge</li>
<li>Identifies patterns and extracts rules from examples (contributing to insight and creativity)</li>
</ul>

<p>These processes occur during specific sleep stages, with different types of memories preferentially processed during different stages.</p>

<h3>Chronotypes: Beyond "Night Owl" and "Morning Lark"</h3>

<p>Genetic research has moved beyond the simple dichotomy of morning and evening people. Scientists now recognize multiple chronotypes influenced by over 350 genes. These genetic differences affect not just when we naturally fall asleep and wake up, but also when various physiological systems function optimally throughout the day.</p>

<p>This understanding helps explain why forcing some individuals into conventional 9-to-5 schedules can result in "social jet lag"—a chronic misalignment between biological and social time that affects health and performance.</p>

<h2>Practical Applications: Optimizing Your Sleep</h2>

<p>These scientific advances suggest several evidence-based strategies for improving sleep quality:</p>

<h3>Timing: Working With Your Chronobiology</h3>

<ul>
<li>Maintain consistent sleep-wake times that align with your chronotype when possible.</li>
<li>If you can't match your schedule to your chronotype, use strategic light exposure: bright light in the morning helps advance your clock; limiting blue light in the evening helps prevent delays.</li>
<li>Even on weekends, try not to shift your sleep schedule by more than an hour to prevent "social jet lag."</li>
</ul>

<h3>Environment: Optimizing Your Sleep Space</h3>

<ul>
<li><strong>Temperature:</strong> Research confirms 65-68°F (18-20°C) as optimal for most people. Core body temperature must drop to initiate and maintain sleep.</li>
<li><strong>Light:</strong> Even small amounts of light can disrupt melatonin production and sleep architecture. Use blackout curtains or a sleep mask.</li>
<li><strong>Sound:</strong> Continuous white or pink noise can mask disruptive environmental sounds and improve deep sleep.</li>
</ul>

<h3>Preparation: The Crucial Pre-Sleep Period</h3>

<ul>
<li>Create a consistent bedtime routine that signals to your brain that it's time to transition to sleep.</li>
<li>Avoid screens 1-2 hours before bed, or use blue light blocking glasses if screen use is unavoidable.</li>
<li>Consider temperature-regulating strategies like a warm bath 1-2 hours before bed (which paradoxically helps lower core temperature).</li>
</ul>

<h3>Supporting Your Brain's Nighttime Work</h3>

<ul>
<li>If learning new material, review it shortly before sleep to facilitate memory consolidation.</li>
<li>Use sleep to aid problem-solving: reviewing difficult problems before bed can lead to insights upon waking.</li>
<li>Practice "sleep hygiene" not just for the quantity of sleep but its quality—the specific sleep stages matter for different cognitive functions.</li>
</ul>

<h2>The Future of Sleep Science</h2>

<p>Emerging research areas suggest we've only begun to understand sleep's importance:</p>

<ul>
<li>Links between sleep and immune function, including vaccine response</li>
<li>The role of sleep in regulating metabolism and weight</li>
<li>Connections between sleep quality and emotional resilience</li>
<li>Personalized sleep optimization based on genetic profiles</li>
</ul>

<p>As our understanding deepens, it's increasingly clear that quality sleep isn't a luxury or a sign of laziness—it's a biological necessity as fundamental to health as nutrition and exercise.</p>

<p>In a culture that often glorifies busyness and minimal sleep, the science delivers a clear message: prioritizing sleep is one of the most important investments you can make in your cognitive abilities, emotional wellbeing, and long-term health.</p>`,
    coverImage: "https://images.unsplash.com/photo-1541781774-7e8bf6de8504",
    author: "Dr. Maya Johnson",
    date: "2024-03-15",
    category: "science",
    tags: ["sleep", "health", "neuroscience", "productivity"],
    readingTime: 10,
    featured: false,
  },
];

// Helper function to load posts from API with localStorage fallback
const loadPosts = async (): Promise<BlogPost[]> => {
  try {
    console.log("Attempting to fetch posts from API");
    const response = await fetch(`${API_URL}/posts`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const posts = await response.json();
    console.log("Loaded posts from API:", posts.length);
    
    // Cache the data in localStorage as a backup
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    
    return posts;
  } catch (error) {
    console.error("Error loading posts from API:", error);
    console.log("Falling back to localStorage");
    
    // Try to get from localStorage
    try {
      const savedPosts = localStorage.getItem('blogPosts');
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts);
        console.log("Loaded posts from localStorage:", parsedPosts.length);
        return parsedPosts;
      }
    } catch (localError) {
      console.error("Error loading from localStorage:", localError);
    }
    
    // Last resort - use initial posts
    console.log("Using initial blog posts");
    toast.error("Unable to connect to the blog server. Using initial data.");
    return [...initialBlogPosts];
  }
};

// In-memory cache of blog posts
let postCache: BlogPost[] = [];

// Init the cache
(async () => {
  try {
    postCache = await loadPosts();
  } catch (error) {
    console.error("Failed to initialize post cache:", error);
    postCache = [...initialBlogPosts];
  }
})();

// Get all blog posts
export const getAllPosts = async () => {
  try {
    postCache = await loadPosts();
    return [...postCache];
  } catch (error) {
    console.error("Error in getAllPosts:", error);
    return [...postCache];
  }
};

// Get featured posts
export const getFeaturedPosts = async () => {
  try {
    const posts = await loadPosts();
    return posts.filter(post => post.featured);
  } catch (error) {
    console.error("Error in getFeaturedPosts:", error);
    return postCache.filter(post => post.featured);
  }
};

// Get post by slug
export const getPostBySlug = async (slug: string) => {
  console.log(`Looking for post with slug: ${slug}`);
  
  try {
    // Try to get from API first
    const response = await fetch(`${API_URL}/posts?slug=${slug}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const posts = await response.json();
    console.log("API response for slug:", posts);
    
    if (posts.length > 0) {
      return posts[0];
    }
    
    throw new Error("Post not found in API");
  } catch (error) {
    console.error(`Error fetching post by slug ${slug}:`, error);
    
    // Fallback to cache
    console.log(`Looking in cache for slug: ${slug}`);
    const post = postCache.find(post => post.slug === slug);
    console.log("Found in cache:", post ? post.title : "Not found");
    return post;
  }
};

// Get posts by category
export const getPostsByCategory = async (category: string) => {
  try {
    const response = await fetch(`${API_URL}/posts?category=${category}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error in getPostsByCategory:", error);
    return postCache.filter(post => post.category === category);
  }
};

// Search posts
export const searchPosts = async (query: string) => {
  try {
    // For full text search, we'll need to fetch all posts and filter
    const posts = await loadPosts();
    const lowercaseQuery = query.toLowerCase();
    
    return posts.filter(post => 
      post.title.toLowerCase().includes(lowercaseQuery) || 
      post.excerpt.toLowerCase().includes(lowercaseQuery) || 
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      post.category.toLowerCase().includes(lowercaseQuery)
    );
  } catch (error) {
    console.error("Error in searchPosts:", error);
    
    // Fallback to cache
    const lowercaseQuery = query.toLowerCase();
    return postCache.filter(post => 
      post.title.toLowerCase().includes(lowercaseQuery) || 
      post.excerpt.toLowerCase().includes(lowercaseQuery) || 
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      post.category.toLowerCase().includes(lowercaseQuery)
    );
  }
};

// Get all categories
export const getCategories = async () => {
  try {
    const posts = await loadPosts();
    const categories = posts.map(post => post.category);
    return [...new Set(categories)];
  } catch (error) {
    console.error("Error in getCategories:", error);
    const categories = postCache.map(post => post.category);
    return [...new Set(categories)];
  }
};

// Create a new post
export const createPost = async (post: Omit<BlogPost, "id">) => {
  try {
    console.log("Creating post with data:", post);
    
    // Generate a unique ID
    const newId = Math.random().toString(36).substring(2, 9);
    
    // Create new post with generated ID and timestamps
    const newPost: BlogPost = {
      ...post,
      id: newId,
      publishedAt: post.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Send to API
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const savedPost = await response.json();
    console.log("Post created successfully:", savedPost);
    
    // Update cache
    postCache.push(savedPost);
    
    // Update localStorage backup
    localStorage.setItem('blogPosts', JSON.stringify(postCache));
    
    return savedPost;
  } catch (error) {
    console.error("Error creating post:", error);
