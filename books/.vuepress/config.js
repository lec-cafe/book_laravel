module.exports = {
    title: '実践 Laravel 入門',
    description: 'Laravel を利用して基本的なAPIシステムを開発します。',
    head: [
        ['script', { src: "https://static.codepen.io/assets/embed/ei.js"}]
    ],
    locales: {
        '/': {
            lang: 'ja',
        },
    },
    markdown: {
        anchor: {
            level: [1,2,3],
            slugify: (s) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-')),
            permalink: true,
            permalinkBefore: true,
            permalinkSymbol: '#'
        },
        config: md => {
            md.use(require('markdown-it-playground'))
        },
        linkify: true
    },
    themeConfig: {
        nav: [
            { text: 'Lec Café', link: 'https://leccafe.connpass.com/' },
        ],
        sidebar: [
            '/1.環境構築/',
            '/2.画面の作成/',
            '/3.データベースの利用/',
            '/4.Eloquentの利用/',
            '/5.Bladeの利用/',
            '/6.バリデーション/',
            // '/7.Controllerの利用/',
        ],
        repo: 'lec-cafe/book_laravel',
        repoLabel: 'Github',
        docsDir: 'books',
        editLinks: true,
        editLinkText: 'ページに不明点や誤字等があれば、Github にて修正を提案してください！'
    }
}
