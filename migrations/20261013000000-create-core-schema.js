// Creates the M2 baseline entities (User, Category, ServiceRequest) plus Comment (FR-04).
// DB CHECK constraints are the "final safeguard" from Assignment 2: even if the
// service layer had a bug, the database refuses an inconsistent resolution.
module.exports = {
  async up(qi, S) {
    await qi.createTable("Users", {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: S.STRING(120), allowNull: false },
      email: { type: S.STRING(255), allowNull: false, unique: true },
      role: { type: S.STRING(20), allowNull: false, defaultValue: "requester" },
      createdAt: { type: S.DATE, allowNull: false },
      updatedAt: { type: S.DATE, allowNull: false },
    });

    await qi.createTable("Categories", {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: S.STRING(120), allowNull: false, unique: true },
      createdAt: { type: S.DATE, allowNull: false },
      updatedAt: { type: S.DATE, allowNull: false },
    });

    await qi.createTable("ServiceRequests", {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true },
      trackingId: { type: S.STRING(20), allowNull: false, unique: true },
      title: { type: S.STRING(200), allowNull: false },
      description: { type: S.TEXT, allowNull: false },
      location: { type: S.STRING(255), allowNull: true },
      status: { type: S.STRING(20), allowNull: false, defaultValue: "Open" },
      categoryId: {
        type: S.INTEGER,
        allowNull: true,
        references: { model: "Categories", key: "id" },
      },
      resolvedAt: { type: S.DATE, allowNull: true },
      resolvedBy: {
        type: S.INTEGER,
        allowNull: true,
        references: { model: "Users", key: "id" },
      },
      createdAt: { type: S.DATE, allowNull: false },
      updatedAt: { type: S.DATE, allowNull: false },
    });

    await qi.createTable("Comments", {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true },
      requestId: {
        type: S.INTEGER,
        allowNull: false,
        references: { model: "ServiceRequests", key: "id" },
        onDelete: "CASCADE",
      },
      authorId: {
        type: S.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
      },
      body: { type: S.TEXT, allowNull: false },
      type: { type: S.STRING(20), allowNull: false, defaultValue: "GENERAL" },
      createdAt: { type: S.DATE, allowNull: false },
      updatedAt: { type: S.DATE, allowNull: false },
    });
    await qi.addIndex("Comments", ["requestId"]);

    const q = (sql) => qi.sequelize.query(sql);
    await q(
      `ALTER TABLE "Users" ADD CONSTRAINT chk_user_role CHECK (role IN ('requester','staff'))`,
    );
    await q(
      `ALTER TABLE "ServiceRequests" ADD CONSTRAINT chk_request_status CHECK (status IN ('Open','In Progress','Resolved'))`,
    );
    await q(
      `ALTER TABLE "ServiceRequests" ADD CONSTRAINT chk_resolved_has_audit CHECK (status <> 'Resolved' OR ("resolvedAt" IS NOT NULL AND "resolvedBy" IS NOT NULL))`,
    );
    await q(
      `ALTER TABLE "Comments" ADD CONSTRAINT chk_comment_not_blank CHECK (length(btrim(body)) > 0)`,
    );
    await q(
      `ALTER TABLE "Comments" ADD CONSTRAINT chk_comment_type CHECK (type IN ('GENERAL','RESOLUTION'))`,
    );
  },

  async down(qi) {
    await qi.dropTable("Comments");
    await qi.dropTable("ServiceRequests");
    await qi.dropTable("Categories");
    await qi.dropTable("Users");
  },
};
