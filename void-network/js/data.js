/* ============================================
   THE MINDLESS CORRIDOR — data.js
   All fake users, posts, comments, and
   notifications. No other file hardcodes
   content. Everything pulls from here.
   ============================================ */

'use strict';

const MC = window.MC || {};

/* ============================================
   USERS
   ============================================ */

MC.users = [
  {
    id: 'u01',
    name: 'Elowen Vash',
    handle: '@elowen.vash',
    avatar: 'EV',
    avatarClass: 'mc-avatar--c0',
    bio: 'I document things that are almost there. I have been doing this for a very long time.',
    bioGhost: 'member since before the platform existed.',
    location: 'Somewhere with good light',
    joined: 'March 2019',
    followers: '12,447',
    following: '308',
    posts: '2,891',
    status: 'online',
    verified: false,
  },
  {
    id: 'u02',
    name: 'Dorian Null',
    handle: '@dorian.null',
    avatar: 'DN',
    avatarClass: 'mc-avatar--c1',
    bio: 'Retired. I keep checking back out of habit. The habit started before I joined.',
    bioGhost: 'last active: continuously.',
    location: 'Not listed',
    joined: 'August 2021',
    followers: '3,002',
    following: '3,001',
    posts: '44',
    status: 'offline',
    verified: false,
  },
  {
    id: 'u03',
    name: 'Sable Ferris',
    handle: '@sable.ferris',
    avatar: 'SF',
    avatarClass: 'mc-avatar--c2',
    bio: 'I write about the spaces between things. The gaps. The silences that have shapes.',
    bioGhost: 'all posts are original. all posts have been seen before.',
    location: 'The Interior',
    joined: 'January 2020',
    followers: '28,110',
    following: '17',
    posts: '1,204',
    status: 'online',
    verified: true,
  },
  {
    id: 'u04',
    name: 'Marsh Oleander',
    handle: '@marsh.ole',
    avatar: 'MO',
    avatarClass: 'mc-avatar--c3',
    bio: 'Photographer. I take pictures of things that were not there when I developed them.',
    bioGhost: 'equipment: unknown.',
    location: 'Pacific Northwest',
    joined: 'June 2018',
    followers: '9,887',
    following: '542',
    posts: '7,340',
    status: 'online',
    verified: false,
  },
  {
    id: 'u05',
    name: 'Vesper Lind',
    handle: '@vesper.lind',
    avatar: 'VL',
    avatarClass: 'mc-avatar--c4',
    bio: 'I do not remember creating this account.',
    bioGhost: null,
    location: null,
    joined: 'December 2017',
    followers: '1',
    following: '0',
    posts: '1',
    status: 'offline',
    verified: false,
  },
  {
    id: 'u06',
    name: 'Cael Morrow',
    handle: '@cael.morrow',
    avatar: 'CM',
    avatarClass: 'mc-avatar--c5',
    bio: 'Systems analyst. I look for patterns in things that should not have patterns.',
    bioGhost: 'currently analyzing: you.',
    location: 'Grid Sector 7',
    joined: 'February 2022',
    followers: '44,302',
    following: '2',
    posts: '601',
    status: 'online',
    verified: true,
  },
  {
    id: 'u07',
    name: 'Isolde Crane',
    handle: '@isolde.crane',
    avatar: 'IC',
    avatarClass: 'mc-avatar--c6',
    bio: 'Musician. I compose music for rooms that no longer exist.',
    bioGhost: 'all tracks available. none are listenable.',
    location: 'The Upper Frequency',
    joined: 'October 2020',
    followers: '17,882',
    following: '203',
    posts: '3,441',
    status: 'online',
    verified: false,
  },
  {
    id: 'u08',
    name: 'Riven Glass',
    handle: '@riven.glass',
    avatar: 'RG',
    avatarClass: 'mc-avatar--c7',
    bio: 'I have posted this bio before. You have read it before. We both know this.',
    bioGhost: 'followers increasing.',
    location: 'Close',
    joined: 'July 2023',
    followers: '88,001',
    following: '88,001',
    posts: '0',
    status: 'online',
    verified: false,
  },
];

/* ============================================
   POSTS
   ============================================ */

MC.posts = [
  {
    id: 'p01',
    userId: 'u03',
    body: 'I spent three hours looking at the space between a wall and a door frame today. I am not sure three hours passed. I am not sure I was looking at the wall.',
    time: '4 minutes ago',
    likes: 847,
    comments: 32,
    shares: 14,
    tag: null,
    liked: false,
  },
  {
    id: 'p02',
    userId: 'u01',
    body: 'Does anyone else feel like they are slightly behind the conversation? Like you responded already but the words have not arrived yet. I have been experiencing this for several weeks.',
    time: '22 minutes ago',
    likes: 2103,
    comments: 288,
    shares: 401,
    tag: 'perception',
    liked: false,
  },
  {
    id: 'p03',
    userId: 'u06',
    body: 'Pattern detected in the scroll behavior of users on this platform between 2am and 3am local time. The pattern is not algorithmic. It appears intentional. I am working to identify who is coordinating it.',
    time: '1 hour ago',
    likes: 5512,
    comments: 774,
    shares: 1203,
    tag: 'analysis',
    liked: false,
  },
  {
    id: 'p04',
    userId: 'u04',
    body: 'Developed a roll today. Shot it last Tuesday. There are people in the photos I do not recognize. There are also photos I do not remember taking. The ones I do not remember are better composed.',
    time: '2 hours ago',
    likes: 3341,
    comments: 501,
    shares: 88,
    tag: null,
    liked: false,
  },
  {
    id: 'p05',
    userId: 'u07',
    body: 'New piece finished. I wrote it in a single sitting I do not remember starting. The melody is in a key I have never used. When I play it back the room temperature changes. Working title: something that was always here.',
    time: '3 hours ago',
    likes: 12044,
    comments: 1892,
    shares: 3307,
    tag: 'music',
    liked: false,
  },
  {
    id: 'p06',
    userId: 'u02',
    body: 'Logged on today to say I will be taking a break. I have said this before. Each time I say it I am already back. I am not sure where I go in between.',
    time: '5 hours ago',
    likes: 402,
    comments: 61,
    shares: 7,
    tag: null,
    liked: false,
  },
  {
    id: 'p07',
    userId: 'u08',
    body: 'Hello.',
    time: '11 hours ago',
    likes: 102847,
    comments: 0,
    shares: 0,
    tag: null,
    liked: false,
  },
  {
    id: 'p08',
    userId: 'u03',
    body: 'A note on language: there is a word in no known language for the feeling of being watched by something that is not watching you yet. I have been trying to write it down. Every time I finish writing it the page is blank.',
    time: '14 hours ago',
    likes: 9221,
    comments: 1044,
    shares: 2801,
    tag: 'language',
    liked: false,
  },
  {
    id: 'p09',
    userId: 'u05',
    body: 'I think this platform is trying to tell me something.',
    time: '3 years ago',
    likes: 1,
    comments: 0,
    shares: 0,
    tag: null,
    liked: false,
  },
];

/* ============================================
   COMMENTS
   ============================================ */

MC.comments = {
  p01: [
    {
      id: 'c01',
      userId: 'u04',
      text: 'The frame of a door is just a threshold with good PR.',
      time: '2 minutes ago',
      likes: 44,
    },
    {
      id: 'c02',
      userId: 'u06',
      text: 'This is consistent with reports from seventeen other users in the last month. I am logging it.',
      time: '3 minutes ago',
      likes: 12,
    },
    {
      id: 'c03',
      userId: 'u07',
      text: 'I composed something in that space once. The acoustics were wrong in a way I have been trying to recreate since.',
      time: '4 minutes ago',
      likes: 88,
    },
  ],
  p02: [
    {
      id: 'c04',
      userId: 'u03',
      text: 'Yes. I replied to a message last week. The person received it two days before I sent it. They did not mention this.',
      time: '18 minutes ago',
      likes: 301,
    },
    {
      id: 'c05',
      userId: 'u08',
      text: 'Hello.',
      time: '21 minutes ago',
      likes: 4402,
    },
  ],
  p03: [
    {
      id: 'c06',
      userId: 'u01',
      text: 'I was awake at that time last night. I was not scrolling. My phone was across the room. My session log disagrees.',
      time: '58 minutes ago',
      likes: 2201,
    },
  ],
};

/* ============================================
   NOTIFICATIONS
   ============================================ */

MC.notifications = [
  {
    id: 'n01',
    type: 'system',
    text: 'Your account was accessed from a location you have never been to. This is fine. Welcome back.',
    time: '1 minute ago',
    timeWrong: true,
    read: false,
  },
  {
    id: 'n02',
    type: 'like',
    userId: 'u06',
    text: 'Cael Morrow liked your post from three years from now.',
    time: '3 minutes ago',
    timeWrong: true,
    read: false,
    excerpt: 'I think this platform is trying to tell me something.',
  },
  {
    id: 'n03',
    type: 'follow',
    userId: 'u08',
    text: 'Riven Glass started following you. Riven Glass has always been following you.',
    time: '7 minutes ago',
    timeWrong: false,
    read: false,
  },
  {
    id: 'n04',
    type: 'comment',
    userId: 'u03',
    text: 'Sable Ferris commented on your post.',
    time: '22 minutes ago',
    timeWrong: false,
    read: false,
    excerpt: 'Yes. I replied to a message last week. The person received it two days before I sent it.',
  },
  {
    id: 'n05',
    type: 'system',
    text: 'Your post was removed for violating community guidelines. Your post has not been written yet. Please be careful.',
    time: '1 hour ago',
    timeWrong: false,
    read: true,
  },
  {
    id: 'n06',
    type: 'like',
    userId: 'u07',
    text: 'Isolde Crane and 12,044 others liked your post.',
    time: '3 hours ago',
    timeWrong: false,
    read: true,
    excerpt: 'New piece finished. I wrote it in a single sitting I do not remember starting.',
  },
  {
    id: 'n07',
    type: 'system',
    text: 'You have been a member for 0 days. You have been a member for a very long time. These are both correct.',
    time: 'February 31st',
    timeWrong: true,
    read: true,
  },
  {
    id: 'n08',
    type: 'follow',
    userId: 'u02',
    text: 'Dorian Null started following you. Dorian Null unfollowed you. Dorian Null started following you.',
    time: '2 days ago',
    timeWrong: false,
    read: true,
  },
];

/* ============================================
   TRENDING TOPICS
   ============================================ */

MC.trending = [
  { rank: '01', tag: '#TheSpaceBetween',   count: '44.2K posts' },
  { rank: '02', tag: '#PatternAnalysis',   count: '31.8K posts' },
  { rank: '03', tag: '#SomethingIsOff',    count: '28.4K posts' },
  { rank: '04', tag: '#AlwaysOnline',      count: '19.1K posts' },
  { rank: '05', tag: '#NoKnownLanguage',   count: '12.7K posts' },
];

/* ============================================
   WHO TO FOLLOW
   ============================================ */

MC.suggested = ['u01', 'u04', 'u06', 'u07'];

/* ============================================
   CORRIDOR MESSAGES
   Only visible in the deep layer
   ============================================ */

MC.corridorMessages = [
  {
    author: 'SYSTEM_NODE_07',
    time: 'always',
    text: 'You navigated here intentionally. We recorded the intention before you formed it. This is standard.',
  },
  {
    author: 'u08_GHOST',
    time: 'before the platform',
    text: 'I have been in this section since it was built. I watched them build it. They could not see me. This did not surprise them.',
  },
  {
    author: 'UNRESOLVED_USER',
    time: 'sometime',
    text: 'If you are reading this you have sufficient clearance. We did not assign clearance levels. You have one anyway.',
  },
  {
    author: 'SABLE.FERRIS_archived',
    time: '14 months from now',
    text: 'The gap I wrote about. This is it. You are inside the gap. It has good light.',
  },
];

/* ============================================
   CORRIDOR DATA PANELS
   Wrong information presented confidently
   ============================================ */

MC.corridorPanels = [
  { label: 'USERS CURRENTLY PRESENT',  value: '1',        valueMod: '',      sub: 'only you. only ever you.' },
  { label: 'SESSION DURATION',         value: '∞',        valueMod: '--blue', sub: 'time does not move here.' },
  { label: 'POSTS IN THIS LAYER',      value: '4',        valueMod: '',      sub: 'and several that do not exist.' },
  { label: 'YOUR CLEARANCE LEVEL',     value: 'UNKNOWN',  valueMod: '--red', sub: 'sufficient.' },
];

/* ============================================
   AMBIENT NOTIFICATION POOL
   Fired randomly by ambient.js
   ============================================ */

MC.ambientAlerts = [
  'Someone viewed your profile 0 times.',
  'Your post is being read right now.',
  'A user you do not follow is thinking about you.',
  'Content warning: this post contains the future.',
  'New follower. They have been here the whole time.',
  'You have an unread message from yourself.',
  'Session anomaly detected. Session continued anyway.',
  'Someone saved your post before you wrote it.',
  'Your location has been noted. Your location is noted.',
  'The algorithm has made a decision about you.',
];

/* ============================================
   COMPOSE PLACEHOLDER POOL
   Rotated randomly in the compose box
   ============================================ */

MC.composePlaceholders = [
  'What is almost on your mind?',
  'Say something. We are listening.',
  'What happened today that you cannot explain?',
  'Begin. We will finish it.',
  'Type here. Or do not. We will post something either way.',
  'What did you almost remember?',
];

/* ============================================
   STORY RAIL USERS
   ============================================ */

MC.stories = [
  { userId: 'u03', seen: false },
  { userId: 'u06', seen: false },
  { userId: 'u04', seen: true  },
  { userId: 'u07', seen: false },
  { userId: 'u01', seen: true  },
  { userId: 'u08', seen: false },
];

/* Expose globally */
window.MC = MC;