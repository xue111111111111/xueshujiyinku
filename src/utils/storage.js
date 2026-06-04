import {
  initialUsers,
  initialAssets,
  initialRelayProjects,
  initialApplications,
  initialGeneChain,
  initialShopItems,
  initialCitations,
  initialExchanges,
  initialMergeRequests,
  initialNotifications,
  initialComments,
  initialIssues
} from '../data/mockData';

const STORAGE_KEYS = {
  USERS: 'academic_users',
  ASSETS: 'academic_assets',
  RELAY_PROJECTS: 'academic_relay_projects',
  APPLICATIONS: 'academic_applications',
  GENE_CHAIN: 'academic_gene_chain',
  SHOP_ITEMS: 'academic_shop_items',
  CITATIONS: 'academic_citations',
  EXCHANGES: 'academic_exchanges',
  MERGE_REQUESTS: 'academic_merge_requests',
  NOTIFICATIONS: 'academic_notifications',
  COMMENTS: 'academic_comments',
  ISSUES: 'academic_issues',
  CURRENT_USER: 'academic_current_user',
  THEME: 'academic_theme'
};

export const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ASSETS)) {
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(initialAssets));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RELAY_PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.RELAY_PROJECTS, JSON.stringify(initialRelayProjects));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(initialApplications));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GENE_CHAIN)) {
    localStorage.setItem(STORAGE_KEYS.GENE_CHAIN, JSON.stringify(initialGeneChain));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SHOP_ITEMS)) {
    localStorage.setItem(STORAGE_KEYS.SHOP_ITEMS, JSON.stringify(initialShopItems));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CITATIONS)) {
    localStorage.setItem(STORAGE_KEYS.CITATIONS, JSON.stringify(initialCitations));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EXCHANGES)) {
    localStorage.setItem(STORAGE_KEYS.EXCHANGES, JSON.stringify(initialExchanges));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MERGE_REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.MERGE_REQUESTS, JSON.stringify(initialMergeRequests));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(initialComments));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ISSUES)) {
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(initialIssues));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(initialUsers[0]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
    localStorage.setItem(STORAGE_KEYS.THEME, 'light');
  }
};

export const getUsers = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
export const setUsers = (users) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

export const getAssets = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSETS) || '[]');
export const setAssets = (assets) => localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));

export const getRelayProjects = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.RELAY_PROJECTS) || '[]');
export const setRelayProjects = (projects) => localStorage.setItem(STORAGE_KEYS.RELAY_PROJECTS, JSON.stringify(projects));

export const getApplications = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
export const setApplications = (apps) => localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));

export const getGeneChain = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.GENE_CHAIN) || '[]');
export const setGeneChain = (chain) => localStorage.setItem(STORAGE_KEYS.GENE_CHAIN, JSON.stringify(chain));

export const getShopItems = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.SHOP_ITEMS) || '[]');
export const setShopItems = (items) => localStorage.setItem(STORAGE_KEYS.SHOP_ITEMS, JSON.stringify(items));

export const getCitations = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.CITATIONS) || '[]');
export const setCitations = (citations) => localStorage.setItem(STORAGE_KEYS.CITATIONS, JSON.stringify(citations));

export const getExchanges = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.EXCHANGES) || '[]');
export const setExchanges = (exchanges) => localStorage.setItem(STORAGE_KEYS.EXCHANGES, JSON.stringify(exchanges));

export const getMergeRequests = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.MERGE_REQUESTS) || '[]');
export const setMergeRequests = (requests) => localStorage.setItem(STORAGE_KEYS.MERGE_REQUESTS, JSON.stringify(requests));

export const getNotifications = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
export const setNotifications = (notifications) => localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));

export const getComments = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '[]');
export const setComments = (comments) => localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));

export const getIssues = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.ISSUES) || '[]');
export const setIssues = (issues) => localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));

export const getCurrentUser = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
export const setCurrentUser = (user) => localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));

export const getTheme = () => localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
export const setTheme = (theme) => localStorage.setItem(STORAGE_KEYS.THEME, theme);

export const generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const addAsset = (asset) => {
  const assets = getAssets();
  const newAsset = { ...asset, id: generateId('a'), createdAt: new Date().toISOString().split('T')[0] };
  assets.push(newAsset);
  setAssets(assets);
  
  const users = getUsers();
  const user = users.find(u => u.id === asset.uploader);
  if (user) {
    user.points += 10;
    setUsers(users);
    setCurrentUser(user);
  }
  
  return newAsset;
};

export const deleteAsset = (assetId) => {
  const assets = getAssets().filter(a => a.id !== assetId);
  setAssets(assets);
};

export const updateAsset = (assetId, updates) => {
  const assets = getAssets().map(a => a.id === assetId ? { ...a, ...updates } : a);
  setAssets(assets);
};

export const addRelayProject = (project) => {
  const projects = getRelayProjects();
  const newProject = { ...project, id: generateId('r'), status: 'recruiting', createdAt: new Date().toISOString().split('T')[0] };
  projects.push(newProject);
  setRelayProjects(projects);
  return newProject;
};

export const addApplication = (application) => {
  const apps = getApplications();
  const newApp = { ...application, id: generateId('app'), status: 'pending', submittedAt: new Date().toISOString().split('T')[0] };
  apps.push(newApp);
  setApplications(apps);
  return newApp;
};

export const approveApplication = (appId) => {
  const apps = getApplications().map(a => a.id === appId ? { ...a, status: 'approved' } : a);
  setApplications(apps);
};

export const addGeneChainRecord = (record) => {
  const chain = getGeneChain();
  const projectChains = chain.filter(g => g.projectId === record.projectId);
  const generation = projectChains.length + 1;
  const newRecord = { ...record, id: generateId('gc'), generation };
  chain.push(newRecord);
  setGeneChain(chain);
  
  const users = getUsers();
  const contributor = users.find(u => u.id === record.contributor);
  if (contributor) {
    contributor.points += 30;
  }
  if (record.mentor) {
    const mentor = users.find(u => u.id === record.mentor);
    if (mentor) {
      mentor.points += 15;
    }
  }
  setUsers(users);
  
  return newRecord;
};

export const addCitation = (citation) => {
  const citations = getCitations();
  const newCitation = { ...citation, id: generateId('c'), citedAt: new Date().toISOString().split('T')[0] };
  citations.push(newCitation);
  setCitations(citations);
  
  const assets = getAssets();
  const asset = assets.find(a => a.id === citation.citedAsset);
  if (asset) {
    asset.citations += 1;
    setAssets(assets);
  }
  
  const users = getUsers();
  const assetObj = assets.find(a => a.id === citation.citedAsset);
  if (assetObj) {
    const author = users.find(u => u.id === assetObj.uploader);
    if (author) {
      author.points += 5;
      setUsers(users);
    }
  }
  
  return newCitation;
};

export const addExchange = (exchange) => {
  const exchanges = getExchanges();
  const newExchange = { ...exchange, id: generateId('e'), status: 'completed', exchangedAt: new Date().toISOString().split('T')[0] };
  exchanges.push(newExchange);
  setExchanges(exchanges);
  
  const users = getUsers();
  const user = users.find(u => u.id === exchange.userId);
  if (user) {
    user.points -= exchange.points;
    setUsers(users);
    setCurrentUser(user);
  }
  
  const shopItems = getShopItems();
  const item = shopItems.find(i => i.id === exchange.itemId);
  if (item) {
    item.stock -= 1;
    setShopItems(shopItems);
  }
  
  return newExchange;
};

export const toggleTheme = () => {
  const currentTheme = getTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  return newTheme;
};

export const forkAsset = (assetId, userId) => {
  const assets = getAssets();
  const originalAsset = assets.find(a => a.id === assetId);
  if (!originalAsset) return null;

  const forkedAsset = {
    ...originalAsset,
    id: `${assetId}-fork-${Date.now()}`,
    uploader: userId,
    isForked: true,
    forkedFrom: assetId,
    forkedFromAuthor: originalAsset.uploader,
    downloads: 0,
    citations: 0,
    likes: 0,
    createdAt: new Date().toISOString().split('T')[0],
    versions: [{
      id: `v${Date.now()}`,
      versionNumber: 'v1.0',
      author: userId,
      submittedAt: new Date().toLocaleString(),
      description: `复刻自 ${getUsers().find(u => u.id === originalAsset.uploader)?.name || '未知用户'} 的作品`,
      content: originalAsset.description
    }]
  };

  assets.push(forkedAsset);
  setAssets(assets);
  return forkedAsset;
};

export const addMergeRequest = (request) => {
  const requests = getMergeRequests();
  const newRequest = {
    ...request,
    id: generateId('mr'),
    status: 'pending',
    createdAt: new Date().toLocaleString(),
    comments: []
  };
  requests.push(newRequest);
  setMergeRequests(requests);

  const targetAsset = getAssets().find(a => a.id === request.targetAssetId);
  if (targetAsset) {
    addNotification({
      userId: targetAsset.uploader,
      type: 'merge_request',
      title: '收到新的合并请求',
      message: `${getUsers().find(u => u.id === request.author)?.name || '未知用户'} 提交了一个合并请求到"${targetAsset.title}"`,
      relatedId: newRequest.id
    });
  }

  return newRequest;
};

export const approveMergeRequest = (requestId) => {
  const requests = getMergeRequests();
  const requestIndex = requests.findIndex(r => r.id === requestId);
  if (requestIndex === -1) return null;

  const request = requests[requestIndex];
  const sourceAsset = getAssets().find(a => a.id === request.sourceAssetId);
  const targetAsset = getAssets().find(a => a.id === request.targetAssetId);

  if (sourceAsset && targetAsset) {
    const newVersion = {
      id: `v${Date.now()}`,
      versionNumber: `v${(targetAsset.versions?.length || 0) + 1}.0`,
      author: request.author,
      submittedAt: new Date().toLocaleString(),
      description: request.description,
      content: sourceAsset.description
    };

    targetAsset.description = sourceAsset.description;
    targetAsset.versions = [...(targetAsset.versions || []), newVersion];
    
    if (!targetAsset.contributors) {
      targetAsset.contributors = [];
    }
    if (!targetAsset.contributors.includes(request.author)) {
      targetAsset.contributors.push(request.author);
    }

    setAssets(getAssets());
  }

  requests[requestIndex] = { ...request, status: 'approved', mergedAt: new Date().toLocaleString() };
  setMergeRequests(requests);

  addNotification({
    userId: request.author,
    type: 'merge_request_status',
    title: '合并请求已通过',
    message: `您的合并请求"${request.title}"已被接受并合并`,
    relatedId: requestId
  });

  return requests[requestIndex];
};

export const rejectMergeRequest = (requestId, reason) => {
  const requests = getMergeRequests();
  const requestIndex = requests.findIndex(r => r.id === requestId);
  if (requestIndex === -1) return null;

  const request = requests[requestIndex];
  requests[requestIndex] = { 
    ...request, 
    status: 'rejected', 
    rejectedAt: new Date().toLocaleString(),
    rejectionReason: reason 
  };
  setMergeRequests(requests);

  addNotification({
    userId: request.author,
    type: 'merge_request_status',
    title: '合并请求已拒绝',
    message: `您的合并请求"${request.title}"被拒绝，理由：${reason}`,
    relatedId: requestId
  });

  return requests[requestIndex];
};

export const addCommentToMergeRequest = (requestId, authorId, content) => {
  const requests = getMergeRequests();
  const requestIndex = requests.findIndex(r => r.id === requestId);
  if (requestIndex === -1) return null;

  const comment = {
    id: generateId('c'),
    author: authorId,
    content,
    createdAt: new Date().toLocaleString()
  };

  requests[requestIndex].comments = [...(requests[requestIndex].comments || []), comment];
  setMergeRequests(requests);

  const request = requests[requestIndex];
  const targetAsset = getAssets().find(a => a.id === request.targetAssetId);
  if (targetAsset && targetAsset.uploader !== authorId) {
    addNotification({
      userId: targetAsset.uploader,
      type: 'merge_request_comment',
      title: '合并请求有新评论',
      message: `${getUsers().find(u => u.id === authorId)?.name || '未知用户'} 在您的合并请求下发表了评论`,
      relatedId: requestId
    });
  }

  return comment;
};

export const addNotification = (notification) => {
  const notifications = getNotifications();
  const newNotification = {
    ...notification,
    id: generateId('n'),
    read: false,
    createdAt: notification.createdAt || new Date().toLocaleString()
  };
  notifications.push(newNotification);
  setNotifications(notifications);
  return newNotification;
};

export const markNotificationAsRead = (notificationId) => {
  const notifications = getNotifications().map(n => 
    n.id === notificationId ? { ...n, read: true } : n
  );
  setNotifications(notifications);
};

export const markAllNotificationsAsRead = () => {
  const notifications = getNotifications().map(n => ({ ...n, read: true }));
  setNotifications(notifications);
};

export const getUnreadNotificationCount = (userId) => {
  const notifications = getNotifications();
  return notifications.filter(n => n.userId === userId && !n.read).length;
};

export const addComment = (comment) => {
  const comments = getComments();
  const newComment = {
    ...comment,
    id: generateId('cm'),
    createdAt: new Date().toLocaleString(),
    likes: 0,
    likedBy: [],
    replies: []
  };
  comments.push(newComment);
  setComments(comments);

  const asset = getAssets().find(a => a.id === comment.assetId);
  if (asset && asset.uploader !== comment.author) {
    addNotification({
      userId: asset.uploader,
      type: 'comment',
      title: '收到新评论',
      message: `${getUsers().find(u => u.id === comment.author)?.name || '未知用户'} 在您的资料"${asset.title}"下发表了评论`,
      relatedId: comment.assetId
    });
  }

  return newComment;
};

export const likeComment = (commentId, userId) => {
  const comments = getComments();
  const commentIndex = comments.findIndex(c => c.id === commentId);
  if (commentIndex === -1) return null;

  const comment = comments[commentIndex];
  if (comment.likedBy.includes(userId)) {
    comment.likedBy = comment.likedBy.filter(id => id !== userId);
    comment.likes -= 1;
  } else {
    comment.likedBy.push(userId);
    comment.likes += 1;
  }
  setComments(comments);
  return comment;
};

export const addReply = (commentId, reply) => {
  const comments = getComments();
  const commentIndex = comments.findIndex(c => c.id === commentId);
  if (commentIndex === -1) return null;

  const newReply = {
    ...reply,
    id: generateId('r'),
    createdAt: new Date().toLocaleString(),
    likes: 0
  };

  comments[commentIndex].replies.push(newReply);
  setComments(comments);

  const comment = comments[commentIndex];
  const asset = getAssets().find(a => a.id === comment.assetId);
  if (asset && asset.uploader !== reply.author) {
    addNotification({
      userId: asset.uploader,
      type: 'comment',
      title: '收到新回复',
      message: `${getUsers().find(u => u.id === reply.author)?.name || '未知用户'} 在您的资料"${asset.title}"的评论下回复了`,
      relatedId: comment.assetId
    });
  }

  return newReply;
};

export const deleteComment = (commentId) => {
  const comments = getComments().filter(c => c.id !== commentId);
  setComments(comments);
};

export const deleteReply = (commentId, replyId) => {
  const comments = getComments().map(c => 
    c.id === commentId 
      ? { ...c, replies: c.replies.filter(r => r.id !== replyId) }
      : c
  );
  setComments(comments);
};

export const addIssue = (issue) => {
  const issues = getIssues();
  const newIssue = {
    ...issue,
    id: generateId('issue'),
    status: 'pending',
    createdAt: new Date().toLocaleString(),
    comments: []
  };
  issues.push(newIssue);
  setIssues(issues);

  const asset = getAssets().find(a => a.id === issue.assetId);
  if (asset && asset.uploader !== issue.author) {
    addNotification({
      userId: asset.uploader,
      type: 'issue',
      title: '收到新Issue',
      message: `${getUsers().find(u => u.id === issue.author)?.name || '未知用户'} 在您的资料"${asset.title}"下提交了一个${issue.type === 'bug' ? 'bug报告' : issue.type === 'enhancement' ? '改进建议' : '问题'}`,
      relatedId: issue.assetId
    });
  }

  return newIssue;
};

export const updateIssueStatus = (issueId, status) => {
  const issues = getIssues().map(i => 
    i.id === issueId 
      ? { 
          ...i, 
          status,
          resolvedAt: status === 'resolved' ? new Date().toLocaleString() : undefined 
        }
      : i
  );
  setIssues(issues);

  const issue = issues.find(i => i.id === issueId);
  if (issue) {
    addNotification({
      userId: issue.author,
      type: 'issue_status',
      title: 'Issue状态更新',
      message: `您提交的Issue"${issue.title}"状态已更新为${status === 'pending' ? '待处理' : status === 'in_progress' ? '处理中' : status === 'resolved' ? '已解决' : '已关闭'}`,
      relatedId: issueId
    });
  }

  return issues.find(i => i.id === issueId);
};

export const addIssueComment = (issueId, comment) => {
  const issues = getIssues();
  const issueIndex = issues.findIndex(i => i.id === issueId);
  if (issueIndex === -1) return null;

  const newComment = {
    ...comment,
    id: generateId('ic'),
    createdAt: new Date().toLocaleString()
  };

  issues[issueIndex].comments.push(newComment);
  setIssues(issues);

  const issue = issues[issueIndex];
  const asset = getAssets().find(a => a.id === issue.assetId);
  if (asset && asset.uploader !== comment.author) {
    addNotification({
      userId: asset.uploader,
      type: 'issue_comment',
      title: 'Issue有新评论',
      message: `${getUsers().find(u => u.id === comment.author)?.name || '未知用户'} 在您的资料"${asset.title}"的Issue下发表了评论`,
      relatedId: issueId
    });
  }

  return newComment;
};
