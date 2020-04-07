
const PagesDAO = require('./pages.dao.js');

class PagesService {
  constructor() {
    this.pagesDAO = new PagesDAO();
  }
  async all() {
    return await this.pagesDAO.getAll(); 
  }

  async save(item) {
    return await this.pagesDAO.save(item);
  }

  async getByField(field, value) {
    return await this.pagesDAO.getByField(field, value);
  }

  async removeByField(field, value) {
    return await this.pagesDAO.removeByField(field, value);
  }

  async listByPage(params) {
    const { rows, ...others } = await this.pagesDAO.listByPage(params);

    return { ...others, data: rows };
  }
}

module.exports = PagesService;
