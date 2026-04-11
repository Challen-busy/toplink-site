# 部署指南：TopLink 独立站 → Vercel + Neon Postgres

从本地代码到线上可访问的完整步骤。预计耗时 **20–30 分钟**。

---

## 0. 前置准备

需要的账号（都有免费层，无需信用卡）：

- **GitHub**（或 GitLab/Bitbucket）
- **Vercel** → https://vercel.com/signup（可用 GitHub 一键注册）
- **Neon** → https://console.neon.tech/signup（可用 GitHub 一键注册）

本地环境：已经装了 Node 22、项目代码在 `~/_WorkSpace/toplink-site` 跑通 `npm run typecheck` 和 `npm run lint`。

---

## 1. 创建 Neon 数据库

1. 登录 https://console.neon.tech
2. **Create a project**
   - Project name：`toplink-site`
   - Postgres version：默认（17）
   - Region：选离用户最近的（海外客户 → `US East (Ohio)` 或 `EU (Frankfurt)`；亚洲客户 → `Asia Pacific (Singapore)`）
3. 创建后进入 **Dashboard → Connection Details**
4. 把连接方式切到 **"Pooled connection"**（URL 里会带 `-pooler`），**复制整串**
   - 类似：`postgresql://neondb_owner:xxxxx@ep-frosty-xxx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require`
5. 先把这串 URL 记到剪贴板或备忘录，后面多处要用

> **为什么要 pooled URL**：Vercel serverless 函数每次冷启动都开一个连接，必须用连接池防止把 Neon 打爆。

---

## 2. 本地用 Neon 初始化 schema + 种子数据

在本地用这个 Neon URL 先把表建好、种子数据灌进去——这样部署后网站立即有内容可看。

```bash
cd ~/_WorkSpace/toplink-site

# 1) 用 Neon URL 覆盖本地 .env
cat > .env <<'EOF'
DATABASE_URL="粘贴你的 Neon pooled URL"
AUTH_SECRET="在下一步生成"
ADMIN_EMAIL="admin@toplinkelec.com"
ADMIN_PASSWORD="换成你自己的强密码"
RESEND_API_KEY=""
INQUIRY_NOTIFY_FROM="TopLink Site <no-reply@toplinkelec.com>"
INQUIRY_NOTIFY_TO="ken@toplinkelec.com,sales@toplinkelec.com"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
EOF

# 2) 生成 AUTH_SECRET（32 字节 hex）
openssl rand -hex 32
# 把输出粘贴到 .env 的 AUTH_SECRET=""

# 3) 推 schema 到 Neon（创建所有表）
npm run db:push

# 4) 种子数据（10 L1 × 41 L2 分类 + 41 stub 产品 + admin 账号 + 3 成功案例）
npm run db:seed

# 5) 本地验证一下
npm run dev
# → http://localhost:3000 浏览一遍
# → http://localhost:3000/admin/login 用 .env 里的 ADMIN_EMAIL / ADMIN_PASSWORD 登录
# Ctrl+C 停掉
```

---

## 3. 推代码到 GitHub

```bash
cd ~/_WorkSpace/toplink-site

# 确认 .env 在 .gitignore 里（默认已加），不要把密钥提交到仓库
grep -E '^\.env$|^\.env\*' .gitignore

# 首次提交
git add -A
git commit -m "Initial commit: TopLink inquiry-led site v1"

# 到 https://github.com/new 创建一个新仓库（private 或 public 都行），名字随意
# 假设你创建了 git@github.com:YOUR_USER/toplink-site.git

git branch -M main
git remote add origin git@github.com:YOUR_USER/toplink-site.git
git push -u origin main
```

---

## 4. 在 Vercel 导入项目

1. 登录 https://vercel.com/new
2. 点 **"Import Git Repository"** → 选刚才推送的 `toplink-site`
3. Framework Preset：**Next.js**（自动识别）
4. Root Directory：`./`
5. 构建设置全部默认（我们的 `build` 脚本里已经加了 `prisma generate`）
6. **Environment Variables**——这是关键，必须全部加上：

   | 变量名 | 值 |
   |---|---|
   | `DATABASE_URL` | 第 1 步的 Neon pooled URL |
   | `AUTH_SECRET` | 第 2 步生成的 hex |
   | `ADMIN_EMAIL` | 你的管理员邮箱 |
   | `ADMIN_PASSWORD` | 你的管理员密码（仅用于参考/下次 re-seed；生产不再读） |
   | `RESEND_API_KEY` | 留空，或去 https://resend.com 注册拿一个 |
   | `INQUIRY_NOTIFY_FROM` | `TopLink Site <no-reply@toplinkelec.com>` |
   | `INQUIRY_NOTIFY_TO` | `ken@toplinkelec.com,sales@toplinkelec.com` |
   | `NEXT_PUBLIC_SITE_URL` | 先填占位 `https://toplink-site.vercel.app`，部署完拿到真实域名后回来改 |

7. 点 **"Deploy"** → 等 2–3 分钟构建完成

构建日志里应该能看到：
```
Running "prisma generate && next build"
✓ Generated Prisma Client
✓ Compiled successfully
```

---

## 5. 验收

部署完成后 Vercel 给你一个域名，比如 `toplink-site-xxx.vercel.app`。逐个点一遍：

- [ ] 首页渲染正常，Hero / Hotline / Hot Products / 分类 / 成功案例 / CTA 全在
- [ ] `/products` → 点任意 L1 → L2 → L3 产品详情
- [ ] L3 产品页提交一个测试询盘 → 看是否 200
- [ ] `/admin/login` 用 `ADMIN_EMAIL` / `ADMIN_PASSWORD` 登录
- [ ] `/admin/inquiries` 能看到刚才提交的那条测试询盘
- [ ] 把一个产品标 hot → 首页"Hot products"立即刷新
- [ ] `/admin/settings` 改一下 hero 文案保存 → 首页验证

然后回 Vercel → Settings → Environment Variables，把 `NEXT_PUBLIC_SITE_URL` 改成真实域名，重新部署（Deployments → `…` → Redeploy）。

---

## 6. （可选）绑定自定义域名

在 Vercel → Settings → Domains 添加你的域名（比如 `toplinkelec.com` 或子域 `new.toplinkelec.com`），按提示在域名 DNS 里加 A / CNAME 记录。DNS 生效后自动签 HTTPS。

---

## 7. （可选）启用 Resend 真实邮件

当前 `RESEND_API_KEY` 留空 → 询盘只落库，不发邮件。要启用：

1. https://resend.com 注册
2. 验证 `toplinkelec.com` 域名（按它的 DNS 指引加 SPF/DKIM）
3. 创建一个 API key
4. Vercel → Settings → Environment Variables → 更新 `RESEND_API_KEY`
5. Redeploy

---

## 常见问题

**Q：构建失败，报 `DATABASE_URL is not set`**
A：Vercel 没配 `DATABASE_URL` 环境变量。回第 4 步检查。注意：如果改了环境变量，必须手动触发 **Redeploy**——Vercel 不会自动重建。

**Q：构建失败，报 `Can't reach database server`**
A：Neon URL 拼错了，或者忘了加 `?sslmode=require`。Neon 的 pooled URL 默认带 sslmode，直接复制。

**Q：网站能打开但 admin 登录报 500**
A：99% 是 `AUTH_SECRET` 没设或太短（要≥16 字符）。用 `openssl rand -hex 32` 生成一串真的随机值。

**Q：新增/编辑产品后首页没更新**
A：已经用了 `revalidatePath("/")`，应该立即刷新。如果用了 ISR/cache，等几秒或 Redeploy。

**Q：想重置所有数据重新种子**
A：本地把 `.env` 的 `DATABASE_URL` 指向 Neon，然后：
```bash
npm run db:push   # 如果改了 schema
npm run db:seed   # 会自动 deleteMany 清空再插入
```

**Q：Neon 免费层够用吗**
A：0.5 GB 存储 + 每月 191h 计算时间，这个站的规模绰绰有余。超了可以升级或迁 Vercel Postgres / Supabase，代码不用改（都是 Postgres）。

---

## 维护提示

- **代码改动**：`git push` → Vercel 自动构建 + 部署，无需任何额外操作
- **Schema 改动**：改完 `prisma/schema.prisma` → `npm run db:push`（本地、指向 Neon）→ commit & push → Vercel 用新 Prisma client 构建
- **生产数据备份**：Neon 免费层有 7 天 point-in-time restore，Dashboard → Branches 可以一键回滚
- **查看 Vercel 日志**：Vercel → Project → Logs（实时请求 + 函数错误）
