// src/data/site.js
// Centralized site data: name, title, contacts, projects, labs, blog, certificates
// TODO: Replace placeholders with your real data/links.
import { defaultTheme } from '../theme/themeConfig.js';

export const site = {
  name: 'Abdallah Salah',
  title: 'AI Engineer · Deep Learning & Computer Vision',
  taglinePhrases: ['AI Engineer', 'Agentic Workflows', 'RAG Systems', 'n8n Automations'],
  location: 'Amman, Jordan',
  email: 'abdallah.tech.ai@gmail.com',
  phone: '+962796698015',
  linkedin: 'https://www.linkedin.com/in/abdallah-salaah',
  github: 'https://github.com/yourusername',
  resumeUrl: '/resume/Abdallah_Salah_CV.pdf',
  skillsFlat: [
    'Python', 'TensorFlow', 'PyTorch', 'Computer Vision', 'NLP', 'Deep Learning', 'Data Science', 'MLOps', 'React'
  ],
  projects: [
    {
      title: 'Arabic Handwritten Text Recognition',
      slug: 'arabic-ocr',
      tags: ['Computer Vision', 'Deep Learning', 'OCR'],
      blurb: 'Deep learning model recognizing handwritten Arabic with high accuracy.',
      highlights: [
        '94% accuracy on benchmark datasets',
        'Custom CNN-LSTM architecture',
        'Optimized for mobile deployment'
      ],
      tech: ['PyTorch', 'OpenCV', 'TensorFlow Lite'],
      image: '/images/arabic-ocr.png',
      repo: 'https://github.com/yourusername/arabic-ocr',
      demo: 'https://demo-url.com'
    },
    {
      title: 'RAG Chatbot',
      slug: 'rag-chatbot',
      tags: ['NLP', 'LLM', 'RAG'],
      blurb: 'Retrieval-augmented generation chatbot for domain-specific Q&A.',
      highlights: [
        'OpenAI API integration',
        'Vector search for knowledge retrieval',
        'Web service deployment'
      ],
      tech: ['LangChain', 'Pinecone', 'FastAPI', 'React'],
      image: '/images/rag-chatbot.png',
      repo: 'https://github.com/yourusername/rag-chatbot',
      demo: 'https://demo-url.com'
    },
    {
      title: 'Object Detection System',
      slug: 'object-detection',
      tags: ['Computer Vision', 'YOLO', 'Edge AI'],
      blurb: 'Real-time object detection for edge devices.',
      highlights: [
        'YOLOv8 with custom dataset',
        '30+ FPS on Jetson Nano',
        'TensorRT optimization'
      ],
      tech: ['PyTorch', 'YOLO', 'NVIDIA TensorRT', 'OpenCV'],
      lottie: '/assets/anim/object-detection.json',
      repo: 'https://github.com/yourusername/object-detection'
    }
  ],
  labs: [
    {
      title: 'Vision Transformer Demo',
      kind: 'gif',
      src: '/images/labs/vit-demo.gif',
      note: 'May use CPU when running locally'
    },
    {
      title: 'Arabic HTR Inference',
      kind: 'video',
      src: '/videos/htr-demo.mp4',
      note: 'Model preview only'
    },
    {
      title: 'Agent Tool-Use Trace',
      kind: 'image',
      src: '/images/labs/agent-trace.webp',
      note: 'Synthetic trace for visualization'
    }
  ],
  blog: [
    { title: 'Deploying Tiny RAG', slug: 'tiny-rag', tags: ['RAG', 'LLM'], read: '4 min', date: '2024-08-12' },
    { title: 'Arabic OCR: CER/WER Deep Dive', slug: 'arabic-ocr-cer-wer', tags: ['OCR', 'CV'], read: '6 min', date: '2024-07-02' },
    { title: 'ROS SLAM Notes', slug: 'ros-slam-notes', tags: ['Robotics'], read: '5 min', date: '2024-05-14' },
  ],
  certificates: [
    {
      title: 'Deep Learning Specialization',
      issuer: 'Coursera (Andrew Ng)',
      year: '2022',
      credentialUrl: 'https://www.coursera.org/account/accomplishments/specialization/123456',
      logo: '/images/certs/coursera.png',
      takeaway: 'Neural networks, CNN/RNN, optimization techniques.'
    },
    {
      title: 'TensorFlow Developer Certificate',
      issuer: 'Google',
      year: '2021',
      credentialUrl: 'https://www.tensorflow.org/certificate',
      logo: '/images/certs/tensorflow.png',
      takeaway: 'Built TensorFlow models for ML tasks.'
    }
  ],
  theme: { ...defaultTheme },
};
