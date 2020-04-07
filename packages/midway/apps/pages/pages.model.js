const models = require('../../core/db/models');

class Pages extends models.Model {

  constructor() {
    super();
  }

  /* 表的描述
   */
  comment() {
    return "落地页";
  }

  /* TODO: model定义为属性 
   * 表名
   */
  tableName() {
    return;
  }

  /* 字段定义
   */
  model()  {
    return { 
      name: {
        type: models.STRING,
        allowNull: false,
        defaultValue: '',
        comment: '落地页key'
      },
      title: {
        type: models.STRING,
        allowNull: false,
        defaultValue: '',
        comment: '落地页中文名'
      },
      description: {
        type: models.STRING,
        allowNull: false,
        defaultValue: '',
        comment: '落地页详情',
      },
      template: {
        type: models.JSON,
        allowNull: false,
        defaultValue: '',
        comment: '落地页详情',
      },
      url: {
        type: models.STRING,
        allowNull: false,
        defaultValue: '',
        comment: '落地页URL',
      }
    };
  }

  index() {
    return [
      {
        // name: 'idx_name', //自定义索引名, 如何自定义索引前缀
        unique: true, // 定义唯一索引类型
        fields: ['name']
      },
    ];
  }
}

// TODO：如果多个地方new 时会调用两次sequenlize.define, 会产生什么后果
// 是否需要实现单例模式,建议先定义Model后，直接new User导出

module.exports = new Pages();


