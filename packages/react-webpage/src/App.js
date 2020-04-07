import React, { Component } from 'react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Banner from '@/components/Banner';
import Animation from '@/components/Animation';
import Panel from '@/components/Panel';
import Card from '@/components/Card';
import './App.less';

import config from './config';

class App extends Component {
  render() {
    const { logo, title, navs, banner: { bg, ...bannerInnerInfo }, panels, footer } = config;
    const headerProps = {
      logo,
      title,
      navs
    };

    const bannerProps = {
      banner: bg,
    }

    const bannerInnerProps = {
      ...bannerInnerInfo
    } 

    const footerProps = {
      ...footer 
    }

    return (
      <div className="App">
        <Header { ...headerProps } />
        <Banner { ...bannerProps }>
          <Animation action="fadeInDown">
            <div className={`banner-header`}>
              <img src={ bannerInnerProps.logo || logo } className="banner-logo" alt="logo" />
              <h1 className="banner-title">{ bannerInnerProps.title }</h1>
            </div>
            <p className="banner-intro">
              { bannerInnerProps.subTitle }
            </p>
          </Animation>
        </Banner>
        {
          panels.map( (panel, pIndex) => {
            const { cards, ...others } = panel;
            return (
              <Panel key={pIndex} { ...others }>
                {
                  cards.map( (card, cIndex) => {
                    return <Card key={cIndex} { ...card } />
                  })
                }
              </Panel>
            );
          })
        }
        <Footer { ...footerProps } />
      </div>
    );
  }
}

export default App;
