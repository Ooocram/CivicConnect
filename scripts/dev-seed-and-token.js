// scripts/dev-seed-and-token.js
// DEV ONLY. Creates a staff user + one category (idempotent) and prints a JWT so you
// can try PUT /resolve manually. There is no login endpoint yet (out of M3 scope).
// Usage:  npm run seed:dev
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { sequelize, User, Category } = require('../src/persistence/models');

(async () => {
  const [staff] = await User.findOrCreate({
    where: { email: 'staff@civicconnect.local' },
    defaults: { name: 'Dev Staff', role: 'staff' },
  });
  const [category] = await Category.findOrCreate({ where: { name: 'Roads & Potholes' } });
  const token = jwt.sign({ uid: staff.id, role: staff.role }, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '8h',
  });
  console.log(`staff user id : ${staff.id}`);
  console.log(`category id   : ${category.id}`);
  console.log(`Bearer token  : ${token}`);
  await sequelize.close();
})().catch((e) => { console.error(e); process.exit(1); });
