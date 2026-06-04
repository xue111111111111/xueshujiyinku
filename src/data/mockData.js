export const schools = [
  { id: 'csu', name: '中南大学', shortName: '中南', color: 'bg-orange-500' },
  { id: 'tsinghua', name: '清华大学', shortName: '清华', color: 'bg-blue-500' },
  { id: 'pku', name: '北京大学', shortName: '北大', color: 'bg-red-500' },
  { id: 'fudan', name: '复旦大学', shortName: '复旦', color: 'bg-green-500' },
  { id: 'zjnu', name: '浙江大学', shortName: '浙大', color: 'bg-purple-500' },
  { id: 'sjtu', name: '上海交通大学', shortName: '上交', color: 'bg-indigo-500' },
  { id: 'hust', name: '华中科技大学', shortName: '华科', color: 'bg-teal-500' },
  { id: 'sysu', name: '中山大学', shortName: '中山', color: 'bg-pink-500' }
];

export const courseLibrary = {
  public: [
    '高等数学', '线性代数', '概率论与数理统计', '大学物理',
    '大学英语', '计算机基础', '思想道德修养', '形势与政策',
    '军事理论', '体育'
  ],
  professional: [
    '数据结构', '算法设计', '操作系统', '计算机网络',
    '数据库原理', '软件工程', '人工智能', '机器学习',
    '深度学习', '计算机组成原理', '编译原理', '信息安全',
    '软件工程', '软件测试', '需求工程', '项目管理'
  ],
  general: [
    '创新创业导论', '艺术鉴赏', '心理健康', '法律基础',
    '环境保护', '中国传统文化', '科技史', '领导力'
  ]
};

export const departments = [
  { id: 'cs', name: '计算机学院', majors: ['计算机科学', '软件工程', '人工智能'] },
  { id: 'ee', name: '电子工程学院', majors: ['电子信息', '通信工程', '微电子'] },
  { id: 'math', name: '数学学院', majors: ['数学', '应用数学', '统计学'] },
  { id: 'business', name: '商学院', majors: ['工商管理', '市场营销', '会计学'] }
];

export const teachers = [
  { id: 't1', name: '张明', department: 'cs', courses: ['数据结构', '算法设计'] },
  { id: 't2', name: '李华', department: 'cs', courses: ['操作系统', '计算机网络'] },
  { id: 't3', name: '王芳', department: 'cs', courses: ['人工智能', '机器学习'] },
  { id: 't4', name: '刘伟', department: 'ee', courses: ['电子电路', '信号处理'] },
  { id: 't5', name: '陈静', department: 'math', courses: ['高等数学', '线性代数'] }
];

export const initialUsers = [
  { id: 'u1', name: '张三', role: 'student', department: 'cs', major: '计算机科学', grade: '2023', points: 120, email: 'zhangsan@edu.cn', school: 'csu', bio: '热爱编程，专注于人工智能领域，喜欢分享学习笔记和项目经验。' },
  { id: 'u2', name: '李四', role: 'teacher', department: 'cs', major: '软件工程', grade: '', points: 0, email: 'lisi@edu.cn', school: 'csu', bio: '计算机学院副教授，主要研究方向为机器学习和数据挖掘。' },
  { id: 'u3', name: '王五', role: 'student', department: 'cs', major: '人工智能', grade: '2022', points: 350, email: 'wangwu@edu.cn', school: 'csu', bio: 'AI爱好者，参与多个开源项目，致力于推动学术资源共享。' },
  { id: 'u4', name: '赵六', role: 'admin', department: 'cs', major: '', grade: '', points: 0, email: 'zhaoliu@edu.cn', school: 'csu', bio: '系统管理员，负责维护学术基因库平台的正常运行。' },
  { id: 'u5', name: '孙七', role: 'student', department: 'math', major: '数学', grade: '2021', points: 280, email: 'sunqi@edu.cn', school: 'tsinghua', bio: '数学专业，热爱数学建模和数据分析，乐于分享学习心得。' },
  { id: 'u6', name: '周八', role: 'teacher', department: 'ee', major: '电子信息', grade: '', points: 0, email: 'zhouba@edu.cn', school: 'pku' },
  { id: 'u7', name: '吴九', role: 'student', department: 'business', major: '工商管理', grade: '2023', points: 150, email: 'wujiu@edu.cn', school: 'fudan' },
  { id: 'u8', name: '郑十', role: 'student', department: 'cs', major: '软件工程', grade: '2022', points: 420, email: 'zhengshi@edu.cn', school: 'zjnu' }
];

export const initialAssets = [
  {
    id: 'a1',
    title: '数据结构课程设计-图书管理系统',
    type: '课程设计',
    course: '数据结构',
    teacher: '张明',
    grade: '2022',
    semester: '2023秋',
    description: '基于链表实现的图书管理系统，支持增删改查操作',
    tags: ['优秀', '完整'],
    score: 95,
    downloads: 42,
    citations: 8,
    likes: 15,
    isCase: true,
    createdAt: '2023-12-15',
    uploader: 'u3',
    school: 'csu',
    versions: [
      {
        id: 'v1',
        versionNumber: 'v1.0',
        author: 'u3',
        submittedAt: '2023-12-15 10:30',
        description: '初始版本，完成基本功能',
        content: '基于链表的图书管理系统\n\n## 功能特性\n- 图书信息录入\n- 图书查询\n- 借书还书\n- 图书删除'
      },
      {
        id: 'v2',
        versionNumber: 'v1.1',
        author: 'u3',
        submittedAt: '2023-12-18 14:20',
        description: '添加图书分类功能',
        content: '基于链表的图书管理系统\n\n## 功能特性\n- 图书信息录入\n- 图书查询\n- 借书还书\n- 图书删除\n- 图书分类管理'
      },
      {
        id: 'v3',
        versionNumber: 'v1.2',
        author: 'u3',
        submittedAt: '2023-12-20 09:15',
        description: '优化界面和增加统计功能',
        content: '基于链表的图书管理系统\n\n## 功能特性\n- 图书信息录入\n- 图书查询\n- 借书还书\n- 图书删除\n- 图书分类管理\n- 借阅统计报表'
      }
    ]
  },
  {
    id: 'a2',
    title: '机器学习期末实验报告',
    type: '实验报告',
    course: '机器学习',
    teacher: '王芳',
    grade: '2022',
    semester: '2024春',
    description: '使用神经网络进行图像分类实验，准确率达到92%',
    tags: ['优秀', '创新'],
    score: 92,
    downloads: 38,
    citations: 5,
    likes: 12,
    isCase: false,
    createdAt: '2024-01-20',
    uploader: 'u3',
    school: 'csu',
    versions: [
      {
        id: 'v1',
        versionNumber: 'v1.0',
        author: 'u3',
        submittedAt: '2024-01-20 16:45',
        description: '初始提交',
        content: '# 机器学习期末实验报告\n\n## 实验目的\n使用神经网络进行图像分类\n\n## 实验方法\n采用CNN卷积神经网络\n\n## 实验结果\n准确率：88%'
      },
      {
        id: 'v2',
        versionNumber: 'v1.1',
        author: 'u3',
        submittedAt: '2024-01-22 11:30',
        description: '优化模型参数，提升准确率',
        content: '# 机器学习期末实验报告\n\n## 实验目的\n使用神经网络进行图像分类\n\n## 实验方法\n采用CNN卷积神经网络，增加Dropout层\n\n## 实验结果\n准确率：92%'
      }
    ]
  },
  {
    id: 'a3',
    title: '操作系统笔记整理',
    type: '笔记',
    course: '操作系统',
    teacher: '李华',
    grade: '2023',
    semester: '2024春',
    description: '详细整理了进程管理、内存管理、文件系统等章节',
    tags: ['实用'],
    score: 88,
    downloads: 156,
    citations: 12,
    likes: 35,
    isCase: false,
    createdAt: '2024-03-10',
    uploader: 'u1',
    school: 'csu'
  },
  {
    id: 'a4',
    title: '基于深度学习的图像识别系统',
    type: '毕设',
    course: '毕业设计',
    teacher: '王芳',
    grade: '2020',
    semester: '2024春',
    description: '毕业设计作品，基于YOLOv5实现实时目标检测',
    tags: ['优秀', '创新', '完整'],
    score: 98,
    downloads: 89,
    citations: 23,
    likes: 45,
    isCase: true,
    createdAt: '2024-05-01',
    uploader: 'u3',
    school: 'csu'
  },
  {
    id: 'a5',
    title: '数学建模竞赛论文',
    type: '竞赛作品',
    course: '数学建模',
    teacher: '陈静',
    grade: '2023',
    semester: '2023秋',
    description: '2023年全国大学生数学建模竞赛获奖作品',
    tags: ['优秀', '创新'],
    score: 96,
    downloads: 124,
    citations: 18,
    likes: 52,
    isCase: true,
    createdAt: '2023-09-15',
    uploader: 'u1',
    school: 'csu'
  },
  {
    id: 'a6',
    title: '矩阵论课程论文',
    type: '课程论文',
    course: '矩阵论',
    teacher: '陈静',
    grade: '2021',
    semester: '2022春',
    description: '关于矩阵分解在机器学习中的应用研究',
    tags: ['优秀'],
    score: 94,
    downloads: 67,
    citations: 15,
    likes: 28,
    isCase: true,
    createdAt: '2022-06-10',
    uploader: 'u5',
    school: 'tsinghua'
  },
  {
    id: 'a7',
    title: '信号与系统实验报告',
    type: '实验报告',
    course: '信号与系统',
    teacher: '周八',
    grade: '2022',
    semester: '2023秋',
    description: '傅里叶变换实验及其应用分析',
    tags: ['完整'],
    score: 90,
    downloads: 45,
    citations: 8,
    likes: 18,
    isCase: false,
    createdAt: '2023-11-20',
    uploader: 'u6',
    school: 'pku'
  },
  {
    id: 'a8',
    title: '市场营销案例分析',
    type: '课程论文',
    course: '市场营销',
    teacher: '刘伟',
    grade: '2023',
    semester: '2024春',
    description: '互联网时代的营销策略分析',
    tags: ['创新'],
    score: 87,
    downloads: 32,
    citations: 6,
    likes: 14,
    isCase: false,
    createdAt: '2024-04-15',
    uploader: 'u7',
    school: 'fudan'
  },
  {
    id: 'a9',
    title: '软件工程综合实践项目',
    type: '课程设计',
    course: '软件工程',
    teacher: '张明',
    grade: '2022',
    semester: '2023秋',
    description: '基于微服务架构的电商平台设计与实现',
    tags: ['优秀', '完整', '创新'],
    score: 97,
    downloads: 78,
    citations: 22,
    likes: 41,
    isCase: true,
    createdAt: '2023-12-20',
    uploader: 'u8',
    school: 'zjnu'
  }
];

export const initialRelayProjects = [
  {
    id: 'r1',
    title: '数据结构课程设计接力项目',
    originalAsset: 'a1',
    originalAuthor: 'u3',
    teacher: 'u2',
    achievements: '已完成基础的图书管理系统功能，包括：1.图书信息录入；2.图书查询；3.借书还书功能',
    todo: '待完成：1.用户权限管理；2.图书分类统计；3.借阅历史记录；4.界面优化',
    difficulty: '中级',
    status: 'recruiting',
    createdAt: '2024-03-01'
  },
  {
    id: 'r2',
    title: '深度学习图像识别接力项目',
    originalAsset: 'a4',
    originalAuthor: 'u3',
    teacher: 'u2',
    achievements: '已完成基于YOLOv5的目标检测系统，支持20种常见物体识别',
    todo: '待完成：1.模型轻量化优化；2.实时视频流检测；3.移动端部署；4.新类别扩展',
    difficulty: '高级',
    status: 'in_progress',
    createdAt: '2024-02-15'
  }
];

export const initialApplications = [
  {
    id: 'app1',
    projectId: 'r2',
    applicant: 'u1',
    resume: '我是计算机科学专业大二学生，熟悉Python和深度学习，曾参与过多个AI项目。',
    plan: '计划在3个月内完成：1.模型剪枝优化；2.TensorRT部署；3.Android APP开发',
    status: 'approved',
    submittedAt: '2024-03-10'
  }
];

export const initialGeneChain = [
  {
    id: 'gc1',
    projectId: 'r1',
    generation: 1,
    contributor: 'u3',
    mentor: null,
    contribution: '完成基础图书管理系统开发',
    createdAt: '2023-12-15'
  },
  {
    id: 'gc2',
    projectId: 'r2',
    generation: 1,
    contributor: 'u3',
    mentor: null,
    contribution: '完成YOLOv5目标检测系统',
    createdAt: '2024-05-01'
  }
];

export const initialShopItems = [
  { id: 's1', name: '图书馆座位优先权', type: 'service', points: 50, stock: 100 },
  { id: 's2', name: '打印券(10张)', type: 'coupon', points: 30, stock: 200 },
  { id: 's3', name: '实验室时长(2小时)', type: 'service', points: 40, stock: 150 },
  { id: 's4', name: '创新创业学分(1学分)', type: 'credit', points: 200, stock: 50 }
];

export const initialCitations = [
  { id: 'c1', citer: 'u1', citedAsset: 'a1', citedAt: '2024-03-15', format: '[1] 王五. 数据结构课程设计-图书管理系统[课程设计]. 数据结构, 2023.' }
];

export const initialExchanges = [
  { id: 'e1', userId: 'u1', itemId: 's2', points: 30, status: 'completed', exchangedAt: '2024-03-01' }
];

export const initialMergeRequests = [
  {
    id: 'mr1',
    sourceAssetId: 'a1-fork',
    targetAssetId: 'a1',
    author: 'u1',
    title: '添加借阅历史功能',
    description: '在原有的图书管理系统基础上，增加了借阅历史记录功能，可以查看每本书的借阅记录。',
    status: 'pending',
    createdAt: '2024-03-15 10:30',
    comments: [
      { id: 'c1', author: 'u3', content: '功能描述很清晰，我需要先看看具体实现。', createdAt: '2024-03-15 14:00' }
    ]
  },
  {
    id: 'mr2',
    sourceAssetId: 'a3-fork',
    targetAssetId: 'a3',
    author: 'u5',
    title: '补充内存管理章节内容',
    description: '增加了虚拟内存、分页管理等内容的详细说明',
    status: 'approved',
    mergedAt: '2024-03-18 16:00',
    createdAt: '2024-03-17 09:00',
    comments: [
      { id: 'c2', author: 'u1', content: '内容很全面，已合并！', createdAt: '2024-03-18 16:00' }
    ]
  },
  {
    id: 'mr3',
    sourceAssetId: 'a2-fork',
    targetAssetId: 'a2',
    author: 'u8',
    title: '优化实验参数设置',
    description: '调整了学习率和批大小参数，准确率提升到94%',
    status: 'rejected',
    rejectedAt: '2024-03-20 11:00',
    rejectionReason: '当前版本已经有类似的优化，感谢你的贡献！',
    createdAt: '2024-03-19 14:30',
    comments: []
  }
];

export const initialComments = [
  {
    id: 'cm1',
    assetId: 'a1',
    author: 'u1',
    content: '这个图书管理系统设计得很棒！请问可以分享一下链表实现的具体细节吗？',
    createdAt: '2024-03-16 10:30',
    likes: 5,
    likedBy: ['u2', 'u5'],
    replies: [
      {
        id: 'r1',
        author: 'u3',
        content: '@李四 当然可以！链表部分主要使用了双向链表结构，支持O(1)时间复杂度的插入和删除操作。',
        createdAt: '2024-03-16 11:00',
        likes: 3
      },
      {
        id: 'r2',
        author: 'u1',
        content: '谢谢解答！学习了',
        createdAt: '2024-03-16 11:30',
        likes: 1
      }
    ]
  },
  {
    id: 'cm2',
    assetId: 'a2',
    author: 'u4',
    content: '实验报告写得很详细，数据图表也很清晰！',
    createdAt: '2024-03-17 14:00',
    likes: 8,
    likedBy: ['u1', 'u3', 'u6'],
    replies: []
  }
];

export const initialIssues = [
  {
    id: 'issue1',
    assetId: 'a1',
    author: 'u7',
    title: '建议增加图书分类功能',
    description: '目前的系统只有基本的增删查改功能，建议增加图书分类管理，可以按类别筛选图书。',
    type: 'enhancement',
    status: 'in_progress',
    createdAt: '2024-03-15 09:00',
    comments: [
      {
        id: 'ic1',
        author: 'u3',
        content: '好建议！我会在下一个版本中考虑添加这个功能。',
        createdAt: '2024-03-15 10:00'
      }
    ]
  },
  {
    id: 'issue2',
    assetId: 'a2',
    author: 'u8',
    title: '实验数据有误',
    description: '第3.2节的实验数据表格中，准确率计算似乎有问题，建议检查一下。',
    type: 'bug',
    status: 'resolved',
    resolvedAt: '2024-03-18 16:00',
    createdAt: '2024-03-18 10:00',
    comments: [
      {
        id: 'ic2',
        author: 'u1',
        content: '感谢指出！确实有计算错误，已经修正了。',
        createdAt: '2024-03-18 16:00'
      }
    ]
  },
  {
    id: 'issue3',
    assetId: 'a3',
    author: 'u2',
    title: '关于内存管理章节的疑问',
    description: '在虚拟内存部分，页表的结构描述不够清晰，能否详细解释一下？',
    type: 'question',
    status: 'pending',
    createdAt: '2024-03-20 15:00',
    comments: []
  }
];

export const initialNotifications = [
  {
    id: 'n1',
    userId: 'u3',
    type: 'merge_request',
    title: '收到新的合并请求',
    message: '张三提交了一个合并请求到"数据结构课程设计-图书管理系统"',
    relatedId: 'mr1',
    read: false,
    createdAt: '2024-03-15 10:30'
  },
  {
    id: 'n2',
    userId: 'u1',
    type: 'merge_request_status',
    title: '合并请求已通过',
    message: '您的合并请求"补充内存管理章节内容"已被接受并合并',
    relatedId: 'mr2',
    read: false,
    createdAt: '2024-03-18 16:00'
  },
  {
    id: 'n3',
    userId: 'u8',
    type: 'merge_request_status',
    title: '合并请求已拒绝',
    message: '您的合并请求"优化实验参数设置"被拒绝，理由：当前版本已经有类似的优化',
    relatedId: 'mr3',
    read: true,
    createdAt: '2024-03-20 11:00'
  }
];
