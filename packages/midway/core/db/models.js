const DBConnection = require('./connection');
const models = require('sequelize');

const conn = DBConnection.connect();

class  Model {
  constructor() {
    const extraConfig = {
      indexes: this._index(),
      comment: typeof this.comment === 'function' ? this.comment() : undefined,
    };


    const auditModel = this._auditModel(); 
    
    const model = { 
      ...this._snapshotModel(),

      ...this.model(), 
      ...this._timestampsModel(),
      ...auditModel
    };

    const baseModel = conn.define(this.tableName() || this._getModelName(), model, {
      // tableName: this.tableName(),
      freezeTableName: true, // freezeTableName, underscored, timestamps也可放到connection的define配置里
      underscored: true,
      timestamps: false,
      hooks: this._hooks(),
      ...extraConfig,
    });

    const rawDestroyMethod = baseModel.prototype.destroy;

    baseModel.prototype.destroy = function (params = {}) {
      const { force = false } = params;
      if (force) {
        return rawDestroyMethod.call(this, { force: true }); 
      } else {
        return this.update({
          is_delete: true,
          delete_time: new Date()
        });
      }
    }

    baseModel.prototype._meta = this._meta();

    return baseModel; 
  }

  _getModelName() {
    return this.constructor.name.replace(/(?<=[a-z]+)(?=[A-Z]+)/g, '_').toLowerCase();
  }

  _snapshotModel() {
    const { snapshot } = this._meta();
    const idName = snapshot ? 'ss_id' : 'id';
    const model = {
      [idName]: {
        type: models.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        comment: '主键'
      },
    };

    if (snapshot) {
      model.id = {
        type: models.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: '创建快照的原数据ID'
      };
      model.version =  {
        type: models.BIGINT,
        allowNull: false,
        defaultValue: 0,
        comment: '快照版本'
      };
      model.ss_create_time = {
        type: models.DATE,
        comment: '快照创建时间',
        allowNull: false,
        defaultValue: '1971-01-01 00:00:00'
      }
    }
    return model;
  }

  _index() {
    const indexes = typeof this.index === 'function' ?  this.index() : []; 
    const { timestamps = true, is_delete = 'is_delete' } = this._meta();
    if (Array.isArray(indexes)) {
      indexes.forEach(indexObj => {
        if (!indexObj.hasOwnProperty('name')) {
          if (timestamps && indexObj.unique) {
            indexObj.fields.push(is_delete);
          }
          const fields = indexObj.fields.map(
            field => typeof field === 'string' ? field : field.name || field.attributes
          );
          const prefix = indexObj.unique ? 'uniq' : 'idx';

          indexObj.name = `${prefix}_${fields.join('_')}`;
        }
      });
    }
    return  indexes;
  }

  _hooks() {
    return {
      beforeCreate(instance, options) {
        const { snapshot } = instance._meta;
        if (!snapshot) {
          instance.create_time = new Date();  
          instance.update_time = instance.create_time;  
        } else {
          instance.ss_create_time = new Date();
        }
      },
      beforeBulkCreate(instances, options) {
        instances.forEach(instance => {
          const { snapshot } = instance._meta;
          if (!snapshot) {
            instance.create_time = new Date();  
            instance.update_time = instance.create_time;  
          } else {
            instance.ss_create_time = new Date();
          }
        });
      },
      beforeUpdate(instance, options) {
        instance.update_time = new Date();  
      },
      beforeFind({ where = {} }) {
        where.is_delete = false;
      },
      beforeCount({ where = {} }) {
        where.is_delete = false;
      },
      beforeBulkUpdate(options) {
      },
      beforeDestroy(instance, options) {
      },
      beforeBulkDestroy(options) {
      }
    }
  }

  _timestampsModel() {
    const { timestamps = true, update_time = 'update_time', updator = 'updator', create_time = 'create_time', creator = 'creator', delete_time = 'delete_time', is_delete = 'is_delete' } = this._meta();
    return timestamps ? {
      [update_time]: {
        type: models.DATE,
        comment: '更新时间',
        allowNull: false,
        defaultValue: '1971-01-01 00:00:00'
      },
      [updator]: {
        type: models.STRING,
        comment: '修改人',
        allowNull: false,
        defaultValue: ''
      },
      [create_time]: {
        type: models.DATE,
        comment: '创建时间',
        allowNull: false,
        defaultValue: '1971-01-01 00:00:00'
      },
      [creator]: {
        type: models.STRING,
        comment: '创建人',
        allowNull: false,
        defaultValue: ''
      }, 
      [delete_time]: {
        type: models.DATE,
        comment: '逻辑删除时间',
        allowNull: false,
        defaultValue: '1971-01-01 00:00:00'
      },
      [is_delete]: {
        type: models.BOOLEAN,
        comment: '是否逻辑删除',
        allowNull: false,
        defaultValue: false
      }
    } : null;
  }

  _auditModel() {
    const { audit: hasAudit = true, auditor = 'auditor', audit_time = 'audit_time', audit_reason = 'audit_reason', status = 'status' } = this._meta();
    return hasAudit ? {
      auditor: {
        type: models.STRING,
        comment: '审核人',
        allowNull: false,
        defaultValue: ''
      },
      audit_time: {
        type: models.DATE,
        comment: '审核时间',
        allowNull: false,
        defaultValue: '1971-01-01 00:00:00'
      },
      audit_reason: {
        type: models.STRING(1024),
        allowNull: false,
        defaultValue: '',
        comment: '审核备注'
      },
      status: {
        type: models.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '状态'
      }
    } : null;

  }

  _meta() {
    return typeof this.meta === 'function' ? this.meta() || {} : {};
  }
}

// models.Op sequelize 5.0

models.Model = Model;

module.exports = models;

