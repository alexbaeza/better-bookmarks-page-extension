import type { ChromeBookmarks } from '@/features/bookmarks/lib/browser/api/chrome-api';

// Helper function to create bookmark items as raw Chrome BookmarkTreeNode
const createBookmark = (id: string, parentId: string, title: string, url: string): ChromeBookmarks => ({
  id,
  parentId,
  title,
  url,
  dateAdded: Date.now(),
  // Mock data never syncs
  syncing: false,
});

// Helper function to create folder items as raw Chrome BookmarkTreeNode
const createFolder = (
  id: string,
  parentId: string,
  title: string,
  children: ChromeBookmarks[] = []
): ChromeBookmarks => {
  const folderType = id === '1' ? 'bookmarks-bar' : id === '2' ? 'other' : undefined;

  return {
    id,
    parentId,
    title,
    children,
    dateAdded: Date.now(),
    dateGroupModified: Date.now(),
    folderType,
    syncing: false,
  };
};

/**
 * Chrome mock data with Chrome-style IDs:
 * - '0' = Root
 * - '1' = Bookmarks Bar (folderType: 'bookmarks-bar')
 * - '2' = Other Bookmarks (folderType: 'other')
 */
export const chromeMockData: ChromeBookmarks[] = [
  {
    id: '0',
    title: '',
    dateAdded: Date.now(),
    children: [
      // Bookmarks Bar (id: '1')
      createFolder('1', '0', 'Bookmarks Bar', [
        createBookmark('61', '1', 'Gmail', 'https://gmail.com'),
        createBookmark('62', '1', 'Calendar', 'https://calendar.google.com'),
        createBookmark('63', '1', 'Google Drive', 'https://drive.google.com'),
        createBookmark('64', '1', 'Keep', 'https://keep.google.com'),
      ]),

      // Other Bookmarks (id: '2')
      createFolder('2', '0', 'Other Bookmarks', [
        // Deep nesting test
        createFolder('11', '2', '📚 Long Title Folder with Special Characters !@#$%^&*()', [
          createFolder('12', '11', 'Nested Folder Level 1', [
            createFolder('13', '12', 'Nested Folder Level 2', [
              createBookmark('14', '13', 'Nested Bookmark Level 3', 'https://deep.link.example.com/'),
            ]),
          ]),
          createFolder('15', '11', 'Empty Folder', []),
          createBookmark('16', '11', 'Example Link Inside Long Title Folder', 'https://example.com/inside-long-folder'),
        ]),

        // Mixed content folder
        createFolder('17', '2', 'Mixed Content', [
          createBookmark('18', '17', 'GitHub', 'https://github.com'),
          createBookmark('19', '17', 'Stack Overflow', 'https://stackoverflow.com'),
          createFolder('20', '17', 'Projects', []),
          createBookmark('21', '17', '', 'https://empty-title.com'),
        ]),

        // Empty folder at root level
        createFolder('22', '2', 'Empty Folder at Root Level', []),

        // Development Resources - Large folder
        createFolder('32', '2', '💾 Development Resources', [
          createBookmark('33', '32', 'TypeScript Docs', 'https://www.typescriptlang.org/docs/'),
          createBookmark('34', '32', 'MDN Web Docs', 'https://developer.mozilla.org/'),
          createBookmark('35', '32', 'Mozilla Firefox', 'https://www.mozilla.org/firefox/'),
          createBookmark('36', '32', 'DevDocs', 'https://devdocs.io'),
          createBookmark('37', '32', 'React – Official Site', 'https://reactjs.org/'),
          createBookmark('38', '32', 'Node.js Documentation', 'https://nodejs.org/en/docs/'),
          createBookmark('39', '32', 'JavaScript Info – Deep JS Guide', 'https://javascript.info'),
          createBookmark('40', '32', 'Frontend Masters', 'https://frontendmasters.com'),
          createBookmark('51', '32', 'StackBlitz', 'https://stackblitz.com/'),
          createBookmark('52', '32', 'CodeSandbox', 'https://codesandbox.io'),
          createBookmark('53', '32', 'W3Schools', 'https://w3schools.com'),
        ]),

        // Programming Languages - Large folder with nested structure
        createFolder('100', '2', '🚀 Programming Languages', [
          createFolder('101', '100', 'JavaScript & TypeScript', [
            createBookmark('102', '101', 'JavaScript MDN', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'),
            createBookmark(
              '103',
              '101',
              'TypeScript Handbook',
              'https://www.typescriptlang.org/docs/handbook/intro.html'
            ),
            createBookmark('104', '101', 'You Dont Know JS', 'https://github.com/getify/You-Dont-Know-JS'),
            createBookmark('105', '101', 'Modern JavaScript Tutorial', 'https://javascript.info'),
            createFolder('106', '101', 'Frameworks', [
              createBookmark('107', '106', 'React', 'https://react.dev'),
              createBookmark('108', '106', 'Vue.js', 'https://vuejs.org'),
              createBookmark('109', '106', 'Angular', 'https://angular.io'),
              createBookmark('110', '106', 'Svelte', 'https://svelte.dev'),
            ]),
          ]),
          createFolder('111', '100', 'Python', [
            createBookmark('112', '111', 'Python.org', 'https://www.python.org'),
            createBookmark('113', '111', 'Real Python', 'https://realpython.com'),
            createBookmark('114', '111', 'Python Tutor', 'https://pythontutor.com'),
            createBookmark('115', '111', 'PyPI', 'https://pypi.org'),
          ]),
          createFolder('116', '100', 'Go', [
            createBookmark('117', '116', 'Go Language', 'https://go.dev'),
            createBookmark('118', '116', 'Go by Example', 'https://gobyexample.com'),
            createBookmark('119', '116', 'Effective Go', 'https://go.dev/doc/effective_go'),
          ]),
          createFolder('120', '100', 'Rust', [
            createBookmark('121', '120', 'Rust Language', 'https://www.rust-lang.org'),
            createBookmark('122', '120', 'Rust Book', 'https://doc.rust-lang.org/book/'),
            createBookmark('123', '120', 'Rust by Example', 'https://doc.rust-lang.org/rust-by-example/'),
          ]),
        ]),

        // Design & UI - Large folder
        createFolder('200', '2', '🎨 Design & UI', [
          createFolder('201', '200', 'Design Inspiration', [
            createBookmark('202', '201', 'Dribbble', 'https://dribbble.com'),
            createBookmark('203', '201', 'Behance', 'https://www.behance.net'),
            createBookmark('204', '201', 'Awwwards', 'https://www.awwwards.com'),
            createBookmark('205', '201', 'SiteInspire', 'https://www.siteinspire.com'),
            createBookmark('206', '201', 'Product Hunt', 'https://www.producthunt.com'),
          ]),
          createFolder('207', '200', 'Design Tools', [
            createBookmark('208', '207', 'Figma', 'https://www.figma.com'),
            createBookmark('209', '207', 'Adobe XD', 'https://www.adobe.com/products/xd.html'),
            createBookmark('210', '207', 'Sketch', 'https://www.sketch.com'),
            createBookmark('211', '207', 'Framer', 'https://www.framer.com'),
          ]),
          createFolder('212', '200', 'UI Libraries', [
            createBookmark('213', '212', 'Material-UI', 'https://mui.com'),
            createBookmark('214', '212', 'Ant Design', 'https://ant.design'),
            createBookmark('215', '212', 'Chakra UI', 'https://chakra-ui.com'),
            createBookmark('216', '212', 'Tailwind UI', 'https://tailwindui.com'),
          ]),
        ]),

        // Learning & Courses
        createFolder('300', '2', '📖 Learning & Courses', [
          createFolder('301', '300', 'Online Courses', [
            createBookmark('302', '301', 'Udemy', 'https://www.udemy.com'),
            createBookmark('303', '301', 'Coursera', 'https://www.coursera.org'),
            createBookmark('304', '301', 'Khan Academy', 'https://www.khanacademy.org'),
            createBookmark('305', '301', 'edX', 'https://www.edx.org'),
            createBookmark('306', '301', 'Pluralsight', 'https://www.pluralsight.com'),
            createBookmark('307', '301', 'LinkedIn Learning', 'https://www.linkedin.com/learning'),
          ]),
          createFolder('308', '300', 'Coding Challenges', [
            createBookmark('309', '308', 'LeetCode', 'https://leetcode.com'),
            createBookmark('310', '308', 'HackerRank', 'https://www.hackerrank.com'),
            createBookmark('311', '308', 'CodeWars', 'https://www.codewars.com'),
            createBookmark('312', '308', 'Exercism', 'https://exercism.org'),
            createBookmark('313', '308', 'Project Euler', 'https://projecteuler.net'),
          ]),
        ]),

        // Tools & Productivity
        createFolder('400', '2', '⚙️ Tools & Productivity', [
          createFolder('401', '400', 'Development Tools', [
            createBookmark('402', '401', 'GitHub', 'https://github.com'),
            createBookmark('403', '401', 'GitLab', 'https://gitlab.com'),
            createBookmark('404', '401', 'Bitbucket', 'https://bitbucket.org'),
            createBookmark('405', '401', 'VS Code', 'https://code.visualstudio.com'),
            createBookmark('406', '401', 'JetBrains', 'https://www.jetbrains.com'),
          ]),
          createFolder('407', '400', 'API Testing', [
            createBookmark('408', '407', 'Postman', 'https://www.postman.com'),
            createBookmark('409', '407', 'Insomnia', 'https://insomnia.rest'),
            createBookmark('410', '407', 'HTTPie', 'https://httpie.io'),
            createBookmark('411', '407', 'Swagger', 'https://swagger.io'),
          ]),
          createFolder('412', '400', 'Database Tools', [
            createBookmark('413', '412', 'MongoDB Compass', 'https://www.mongodb.com/products/compass'),
            createBookmark('414', '412', 'TablePlus', 'https://tableplus.com'),
            createBookmark('415', '412', 'DBeaver', 'https://dbeaver.io'),
            createBookmark('416', '412', 'Adminer', 'https://www.adminer.org'),
          ]),
        ]),

        // News & Media
        createFolder('500', '2', '📰 News & Media', [
          createFolder('501', '500', 'Tech News', [
            createBookmark('502', '501', 'TechCrunch', 'https://techcrunch.com'),
            createBookmark('503', '501', 'The Verge', 'https://www.theverge.com'),
            createBookmark('504', '501', 'Ars Technica', 'https://arstechnica.com'),
            createBookmark('505', '501', 'Hacker News', 'https://news.ycombinator.com'),
            createBookmark('506', '501', 'Lobsters', 'https://lobste.rs'),
          ]),
          createFolder('507', '500', 'Blogs', [
            createBookmark('508', '507', 'CSS-Tricks', 'https://css-tricks.com'),
            createBookmark('509', '507', 'Smashing Magazine', 'https://www.smashingmagazine.com'),
            createBookmark('510', '507', 'A List Apart', 'https://alistapart.com'),
            createBookmark('511', '507', 'Web.dev', 'https://web.dev'),
          ]),
        ]),

        // Entertainment
        createFolder('600', '2', '🎬 Entertainment', [
          createFolder('601', '600', 'Video Streaming', [
            createBookmark('602', '601', 'YouTube', 'https://www.youtube.com'),
            createBookmark('603', '601', 'Netflix', 'https://www.netflix.com'),
            createBookmark('604', '601', 'Twitch', 'https://www.twitch.tv'),
            createBookmark('605', '601', 'Vimeo', 'https://vimeo.com'),
          ]),
          createFolder('606', '600', 'Music', [
            createBookmark('607', '606', 'Spotify', 'https://open.spotify.com'),
            createBookmark('608', '606', 'SoundCloud', 'https://soundcloud.com'),
            createBookmark('609', '606', 'Bandcamp', 'https://bandcamp.com'),
          ]),
        ]),

        // Personal & Social
        createFolder('700', '2', '👤 Personal & Social', [
          createFolder('701', '700', 'Social Media', [
            createBookmark('702', '701', 'Twitter/X', 'https://twitter.com'),
            createBookmark('703', '701', 'LinkedIn', 'https://www.linkedin.com'),
            createBookmark('704', '701', 'Reddit', 'https://www.reddit.com'),
            createBookmark('705', '701', 'Discord', 'https://discord.com'),
          ]),
          createFolder('706', '700', 'Email & Communication', [
            createBookmark('707', '706', 'Gmail', 'https://mail.google.com'),
            createBookmark('708', '706', 'Outlook', 'https://outlook.com'),
            createBookmark('709', '706', 'ProtonMail', 'https://proton.me/mail'),
          ]),
        ]),

        // Very Large Folder - Testing performance with many items
        createFolder('800', '2', '📚 Very Large Folder (50+ items)', [
          ...Array.from({ length: 50 }, (_, i) =>
            createBookmark(`800-${i}`, '800', `Bookmark ${i + 1}`, `https://example.com/item-${i + 1}`)
          ),
        ]),

        // Deeply nested structure
        createFolder('900', '2', '🔗 Deep Nesting Test', [
          createFolder('901', '900', 'Level 2', [
            createFolder('902', '901', 'Level 3', [
              createFolder('903', '902', 'Level 4', [
                createFolder('904', '903', 'Level 5', [
                  createFolder('905', '904', 'Level 6', [
                    createFolder('906', '905', 'Level 7', [
                      createBookmark('907', '906', 'Deep Bookmark', 'https://deep.example.com'),
                    ]),
                  ]),
                ]),
              ]),
            ]),
          ]),
        ]),

        // Edge cases folder
        createFolder('1000', '2', '⚠️ Edge Cases', [
          createBookmark(
            '1001',
            '1000',
            'Very Long Title That Should Wrap and Test Text Truncation in Both Grid and List Views',
            'https://example.com/long-title'
          ),
          createBookmark('1002', '1000', '', 'https://example.com/no-title'),
          createBookmark(
            '1003',
            '1000',
            'Special Characters: !@#$%^&*()_+-=[]{}|;:",./<>?',
            'https://example.com/special'
          ),
          createBookmark('1004', '1000', 'Emoji Test 🎉 🚀 💻 🌟', 'https://example.com/emoji'),
          createBookmark('1005', '1000', '中文标题', 'https://example.com/chinese'),
          createBookmark('1006', '1000', 'العربية', 'https://example.com/arabic'),
          createBookmark('1007', '1000', '日本語', 'https://example.com/japanese'),
          createBookmark('1008', '1000', '🚀🚀🚀🚀🚀 Multiple Emojis', 'https://example.com/multi-emoji'),
        ]),

        // Empty folders at different levels
        createFolder('1100', '2', '📁 Empty Folders Group', [
          createFolder('1101', '1100', 'Empty 1', []),
          createFolder('1102', '1100', 'Empty 2', []),
          createFolder('1103', '1100', 'Empty 3', [createFolder('1104', '1103', 'Empty Child', [])]),
        ]),

        createBookmark('21', '2', 'Duplicate ID Bookmark', 'https://duplicate.example.com/'),
        createFolder('40', '2', '⚙️ Tools & Utilities', [
          createBookmark('41', '40', 'JSON Formatter', 'https://jsonformatter.org'),
          createBookmark('42', '40', 'RegExr', 'https://regexr.com'),
          createBookmark('43', '40', 'Lorem Ipsum Generator', 'https://lipsum.com'),
          createBookmark('44', '40', 'UUID Generator', 'https://www.uuidgenerator.net'),
          createBookmark('45', '40', 'Base64 Encoder', 'https://www.base64encode.org'),
        ]),
        createFolder('46', '2', '🎨 Design Inspiration', [
          createBookmark('47', '46', 'Dribbble', 'https://dribbble.com'),
          createBookmark('48', '46', 'Behance', 'https://www.behance.net/'),
        ]),
        createFolder('49', '2', '📦 Package Managers', [
          createBookmark('50', '49', 'npm', 'https://www.npmjs.com'),
          createBookmark('51', '49', 'Yarn', 'https://yarnpkg.com'),
          createBookmark('52', '49', 'pnpm', 'https://pnpm.io'),
        ]),
        createFolder('1200', '2', '🌍 International Sites', [
          createFolder('1201', '1200', 'European Sites', [
            createBookmark('1202', '1201', 'BBC', 'https://www.bbc.com'),
            createBookmark('1203', '1201', 'The Guardian', 'https://www.theguardian.com'),
          ]),
          createFolder('1204', '1200', 'Asian Sites', [
            createBookmark('1205', '1204', 'NHK', 'https://www.nhk.or.jp'),
            createBookmark('1206', '1204', 'South China Morning Post', 'https://www.scmp.com'),
          ]),
        ]),
      ]),

      // Loose bookmarks that should go into "Uncategorized"
      createBookmark('70', '0', 'Loose Bookmark 1', 'https://example1.com'),
      createBookmark('71', '0', 'Loose Bookmark 2', 'https://example2.com'),
      createBookmark('72', '0', 'Loose Bookmark 3', 'https://example3.com'),
      createBookmark('73', '0', 'Loose Bookmark 4', 'https://example4.com'),
      createBookmark('74', '0', 'Loose Bookmark 5', 'https://example5.com'),
    ],
    syncing: false,
  },
];
