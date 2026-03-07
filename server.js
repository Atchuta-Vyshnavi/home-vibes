// server.js  –  npm install express oracledb bcryptjs uuid cors dotenv
require('dotenv').config();
const express    = require('express');
const oracledb   = require('oracledb');
const cors       = require('cors');
const cookieParser = require('cookie-parser');
try {
  oracledb.initOracleClient();
} catch(err) { console.log('Thick mode:', err.message); }
const app = express();
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser()); 
// ── DB pool ────────────────────────────────────────────────
async function getPool() {
  return oracledb.createPool({
    user:             process.env.DB_USER,
    password:         process.env.DB_PASS,
    connectString:    process.env.DB_CONNECT, // e.g. localhost/XEPDB1
    poolMin: 1, poolMax: 3, poolIncrement: 1
  });
}

// ── POST /api/register ─────────────────────────────────────
app.post('/api/register', async (req, res) => {
  const { fullName, dob, email, password } = req.body;
  if (!fullName || !dob || !email || !password)
    return res.status(400).json({ success: false, message: 'All fields required.' });

  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `BEGIN
         hv_auth_pkg.register_user(
           :fullName, TO_DATE(:dob,'YYYY-MM-DD'), :email, :password,
           :resultCode, :message, :userId
         );
       END;`,
      {
        fullName:   req.body.fullName,
        dob:        req.body.dob,
        email:      req.body.email,
        password:   req.body.password,
        resultCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        message:    { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 },
        userId:     { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      }
    );

    const code = result.outBinds.resultCode;
    if (code === 0) {
      return res.status(201).json({
        success: true,
        message: result.outBinds.message,
        userId:  result.outBinds.userId
      });
    }
    return res.status(409).json({ success: false, message: result.outBinds.message });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  } finally {
    if (conn) await conn.close();
  }
});

// ── POST /api/login ────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const ip        = req.ip;
  const userAgent = req.headers['user-agent'] || '';

  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `BEGIN
         hv_auth_pkg.login_user(
           :email, :password, :ip, :ua,
           :resultCode, :message, :sessionId, :userJson
         );
       END;`,
      {
        email:      email,
        password:   password,
        ip:         ip,
        ua:         userAgent,
        resultCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        message:    { dir: oracledb.BIND_OUT, type: oracledb.STRING,  maxSize: 200 },
        sessionId:  { dir: oracledb.BIND_OUT, type: oracledb.STRING,  maxSize: 64 },
        userJson:   { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 }
      }
    );

    const code = result.outBinds.resultCode;
    if (code === 0) {
      const user = JSON.parse(result.outBinds.userJson);
      res.cookie('hv_session', result.outBinds.sessionId, {
  httpOnly: true, secure: false, sameSite: 'Lax',
  maxAge: 24 * 60 * 60 * 1000
});
      return res.json({ success: true, message: result.outBinds.message, user });
    }

    const status = code === 1 ? 404 : code === 2 ? 401 : 403;
    return res.status(status).json({ success: false, message: result.outBinds.message });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  } finally {
    if (conn) await conn.close();
  }
});

// ── POST /api/logout ───────────────────────────────────────
app.post('/api/logout', async (req, res) => {
  const sid = req.cookies?.hv_session;
  if (!sid) return res.json({ success: true });

  let conn;
  try {
    conn = await oracledb.getConnection();
    await conn.execute(
      `BEGIN hv_auth_pkg.logout(:sid); END;`,
      { sid }
    );
    res.clearCookie('hv_session');
    res.json({ success: true, message: 'Logged out.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  } finally {
    if (conn) await conn.close();
  }
});

// ── GET /api/me  (session check) ───────────────────────────
app.get('/api/me', async (req, res) => {
  const sid = req.cookies?.hv_session;
  if (!sid) return res.status(401).json({ success: false, message: 'Not authenticated.' });

  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `BEGIN hv_auth_pkg.validate_session(:sid, :code, :json); END;`,
      {
        sid:  sid,
        code: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
       json: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 }
      }
    );
    if (result.outBinds.code === 0) {
      const user = JSON.parse(result.outBinds.json);
      return res.json({ success: true, user });
    }
    res.clearCookie('hv_session');
    res.status(401).json({ success: false, message: 'Session expired.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  } finally {
    if (conn) await conn.close();
  }
});

// ── Start ──────────────────────────────────────────────────
getPool().then(() => {
  app.listen(process.env.PORT || 3000, () =>
    console.log(`HomeVibes API running on :${process.env.PORT || 3000}`)
  );
});