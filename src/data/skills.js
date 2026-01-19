// src/data/skills.js
// Sample skills data grouped by category with levels (0-100)
// TODO: Edit this file to match your actual skills and levels

export const skillsData = [
  // Frontend (retain structure; adjust as needed)
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'React', level: 75, tip: 'Component patterns, hooks, state management' },
      { name: 'Tailwind CSS', level: 70, tip: 'Utility-first responsive UI, theming' },
      { name: 'JavaScript (ES6+)', level: 80, tip: 'Modern syntax, modules, tooling' },
    ],
  },

  // AI / Machine Learning (replacing generic backend)
  {
    id: 'ml',
    label: 'AI / Machine Learning',
    skills: [
      { name: 'Python', level: 90, tip: 'Primary language for ML/CV, scripting, tooling' },
      { name: 'TensorFlow', level: 80, tip: 'Model building, training, deployment' },
      { name: 'Keras', level: 85, tip: 'High-level APIs for fast experimentation' },
      { name: 'Model Evaluation (Accuracy, F1, CER/WER)', level: 80, tip: 'Metrics for classifiers and OCR systems' },
      { name: 'Data Augmentation', level: 75, tip: 'Robustness via synthetic transformations' },
      { name: 'Transfer Learning', level: 80, tip: 'Fine-tune pretrained models effectively' },
    ],
  },

  // Computer Vision
  {
    id: 'cv',
    label: 'Computer Vision (CV)',
    skills: [
      { name: 'OpenCV', level: 85, tip: 'Image IO, preprocessing, feature ops' },
      { name: 'CNN', level: 80, tip: 'Convolutional architectures for vision tasks' },
      { name: 'Handwritten Text Recognition (HTR)', level: 78, tip: 'CTC, decoding, Arabic HTR pipeline' },
      { name: 'Image Preprocessing', level: 85, tip: 'Denoising, thresholding, normalization, morphology' },
      { name: 'Dataset Labeling', level: 70, tip: 'Annotation workflows and tools (e.g., Roboflow/LabelImg)' },
      { name: 'Error Rate Evaluation', level: 78, tip: 'CER/WER analysis and model diagnostics' },
    ],
  },

  // Robotics
  {
    id: 'robotics',
    label: 'Robotics',
    skills: [
      { name: 'ROS (Robot Operating System)', level: 70, tip: 'Nodes, topics, packages, launch files' },
      { name: 'RViz', level: 65, tip: 'Robot state and sensor visualization' },
      { name: 'Gazebo', level: 60, tip: 'Simulation environments for testing' },
      { name: 'SLAM', level: 60, tip: 'Mapping and localization fundamentals' },
      { name: 'Path Planning (A*, Dijkstra)', level: 70, tip: 'Classical shortest-path algorithms' },
    ],
  },

  // Data Science & Analysis
  {
    id: 'ds',
    label: 'Data Science & Analysis',
    skills: [
      { name: 'Pandas', level: 85, tip: 'Dataframes, joins, groupby, cleaning' },
      { name: 'NumPy', level: 85, tip: 'Vectorized operations and numerical computing' },
      { name: 'Matplotlib', level: 70, tip: 'Foundational plotting library' },
      { name: 'Seaborn', level: 70, tip: 'Statistical visualization, aesthetics' },
      { name: 'Jupyter Notebooks', level: 80, tip: 'Exploration, prototyping, reporting' },
      { name: 'Data Preprocessing', level: 80, tip: 'Cleaning, encoding, scaling, splitting' },
      { name: 'Exploratory Data Analysis (EDA)', level: 80, tip: 'Hypothesis generation and insights' },
    ],
  },

  // Tools (updated per CV hints)
  {
    id: 'tools',
    label: 'Tools',
    skills: [
      { name: 'Git & GitHub', level: 85, tip: 'Branching, PR reviews, CI (Actions)' },
      { name: 'Linux', level: 80, tip: 'CLI productivity, package management' },
      { name: 'Bash', level: 70, tip: 'Automation scripts and pipelines' },
      { name: 'Hugging Face (Transformers/Datasets)', level: 70, tip: 'Model pipelines and dataset handling' },
    ],
  },

  // Soft Skills
  {
    id: 'soft',
    label: 'Soft Skills',
    skills: [
      { name: 'Communication', level: 85, tip: 'Clear, concise updates and documentation' },
      { name: 'Problem Solving', level: 85, tip: 'Root-cause analysis and iteration' },
      { name: 'Collaboration', level: 80, tip: 'Team-first mindset, code reviews' },
    ],
  },
];
