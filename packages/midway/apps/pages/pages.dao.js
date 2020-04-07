const  Pages = require('./pages.model');
const { Op } = require('../../core/db/models');
class PagesDAO {
  async getAll() {
    const allItems = Pages.findAll();
    return allItems;
  }

  async getListByField(field, values = []) {
    const ret = await Pages.findAll({
      where: {
        [field]: {
          [Op.in]: values
        }
      },
      raw: true
    });
    return ret;
  }

  async listByPage({ query, page = 1, pageSize = 20 }) {
    const where = { 
    };
    const offset = (page - 1) * pageSize;
    if (query) {
      where[Op.or] = [
        {
          title: {
            [Op.like]: `%${query}%`
          }
        },
        {
          name: {
            [Op.like]: `%${query}%`
          }
        },
        {
          description: {
            [Op.like]: `%${query}%`
          }
        },
      ]
    };
    const { rows = [], count } =  await Pages.findAndCountAll({
      where,
      order: [
        ['update_time', 'DESC']
      ],
      offset,
      limit: pageSize,
      raw: true
    }); 

    return { page, pageSize, count, rows };
  }

  async getByField(field, value) {
    return await Pages.findOne({
      where: {
        [field]: value
      },
      raw: true
    });
  }

  async removeByField(field, value) {
    const item = await Pages.findOne({
      where: {
        [field]: value
      }
    });

    if (item) {
      item.destroy();
    } else {
      throw new Error('不存在');
    }
  }

  async save({ id, ...others }) {
    // TODO: unique key重复时直接抛sequelize异常还是查询没有手动抛异常
    if (id) {
      const itemFound = await Pages.findOne({ where: {
        id
      }});
      if (itemFound) {
        return await itemFound.update(others);
      }
    } else {
      return await Pages.create(others);
    }
  }
}

module.exports = PagesDAO;
