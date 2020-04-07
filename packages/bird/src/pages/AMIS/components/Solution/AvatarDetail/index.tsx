import React from 'react';
import _ from 'lodash';

import TableOperation from '../Table/TableOperation';

import { renderFieldValue } from '../utils';
import './index.less'

function AvatarDetail({
  data = {},
  actions = {},
  config = {},
  provider = {},
  operationRender = true // true默认禁用operationRender
}) {

  const { avatar, header = {}, bodyFields = [] } = config;
  const { display: hdDisplay, title: hdTitleKey, fields: hd_fields = [] } = header;

  const hdTitle = _.get(data, hdTitleKey);

  return (
    <section className="info-wrap">
      {
        avatar
          ?
          <div className="info-avatar" style={{backgroundImage: `url(${_.get(data, avatar)})`}}></div>
          :
          null
      }
      <div className="info-content">
        {/* 头部的信息 */}
        {
          hdDisplay !== false
            ?
            <div className="info-hdlist-wrap">
              {
                hdTitle
                  ?
                  <h1>{hdTitle}</h1>
                  :
                  null
              }
              <ul>
                {
                  hd_fields.map((item, index) => {
                    const { key, title, operations = [] } = item;
                    const itemValue = _.get(data, key);
                    const operationProps = {
                      actions,
                      operations,
                      record: data,
                      provider,
                      operationRender
                    };
                    return (
                      <li key={index} className="info-hdlist-subTitle">
                        {title && `${title}：`}
                        {renderFieldValue(itemValue, data, index, item, provider)}
                        <TableOperation { ...operationProps } /> 
                      </li>
                    )
                  })
                }
              </ul>
            </div>
            :
            null
        }
        {/* 底部的其他信息 */}
        <ul className="info-bd-wrap">
          {
            bodyFields.map((item, index) => {
              const {title, key, operations } = item;
              const itemValue = _.get(data, key);
              const operationProps = {
                actions,
                operations,
                record: data,
                provider,
                operationRender
              };

              return (
                <li key={index}>
                  <h1>{title}</h1>
                  <p>
                    {renderFieldValue(itemValue, data, index, item, provider)}
                    <TableOperation { ...operationProps } /> 
                  </p>
                </li>
              )
            })
          }
        </ul>
      </div>
    </section>
  )
}

export default AvatarDetail;


