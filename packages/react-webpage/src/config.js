import logo from './logo.svg';

const cardProps = {
  image: 'https://www.fluidui.com/images3/material-design-prototype.png',
  title: 'title',
  description: 'description',
};

const config = {
  logo: logo,
  title: 'React',
  navs: [
    {
      title: '案例',
      to: '/'
    },
    {
      title: '关于我',
      to: '/'
    },
  ],

  banner: {
    bg: 'https://www.fluidui.com/images3/material-design-prototype.png',
    logo: '',
    title: 'Welcome to React',
    subTitle: 'The world based Component and State',
  },
  panels: [
    {
      cols: 3,
      title: '探究React渲染机制',
      cards: [
        {
          ...cardProps,
        },
        {
          ...cardProps,
        },
        {
          ...cardProps,
        },
      ]
    },
    {
      cols: 2,
      title: '',
      cards: [
        {
          ...cardProps,
        },
        {
          ...cardProps,
        },
      ]
    },
    {
      type: 'h1',
      cols: 1,
      title: 'Promise、Generator、Await/async 在 React、Redux中的应用场景, 包括异步请求、Redux saga等等',
      cards: [
        {
          ...cardProps,
        },
      ]
    },
  ],

  footer: {
    links: [
        {
          title: '赞助',
          links: [
            {
              title: 'xxx',
              url: 'xxxx'
            },
            {
              title: 'xxx',
              url: 'xxxx'
            },
          ]
        }
      ],
      copyright: {
        text: 'do well',
        note: 'Nothing is impossible'
      }
  }
}

export default config;
