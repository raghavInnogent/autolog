import { rest } from 'msw'

// simple in-memory stores for mock
const users = [ { id: 1, name: 'Test User', email: 'test@example.com', password: 'pass', contactNo: '' } ]
let userId = 2

const vehicles = []
let vehicleId = 1

const documents = []
let documentId = 1

const services = []
let serviceId = 1

const sessions = {} // sessionId -> userId

function makeSessionId(){ return Math.random().toString(36).slice(2,12) }

export const handlers = [
  // Signup
  rest.post('/api/users/create', (req, res, ctx) => {
    const { name, email, password, contactNo } = req.body || {}
    if(users.find(u=>u.email === email)){
      return res(ctx.status(409), ctx.json({ message: 'Email already exists' }))
    }
    const u = { id: userId++, name, email, password, contactNo }
    users.push(u)
    return res(ctx.status(201), ctx.json(u))
  }),

  // Login
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email, password } = req.body || {}
    const u = users.find(x => x.email === email && x.password === password)
    if(!u) return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }))
    const sid = makeSessionId()
    sessions[sid] = u.id
    return res(
      ctx.cookie('mock-session', sid, { httpOnly: false }),
      ctx.status(200),
      ctx.json({ id: u.id, name: u.name, email: u.email, contactNo: u.contactNo })
    )
  }),

  // Me
  rest.get('/api/auth/me', (req, res, ctx) => {
    const sid = req.cookies['mock-session']
    if(!sid || !sessions[sid]) return res(ctx.status(401), ctx.json({ message: 'Unauthorized' }))
    const u = users.find(x => x.id === sessions[sid])
    return res(ctx.status(200), ctx.json({ id: u.id, name: u.name, email: u.email, contactNo: u.contactNo }))
  }),

  // Logout
  rest.post('/api/auth/logout', (req, res, ctx) => {
    const sid = req.cookies['mock-session']
    if(sid && sessions[sid]) delete sessions[sid]
    return res(ctx.cookie('mock-session', ''), ctx.status(204))
  }),

  // Vehicles
  rest.get('/api/vehicles', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(vehicles))
  }),
  rest.post('/api/vehicles', async (req, res, ctx) => {
    const sid = req.cookies['mock-session']
    if(!sid || !sessions[sid]) return res(ctx.status(401), ctx.json({ message: 'Unauthorized' }))
    const body = await req.json()
    const v = { id: vehicleId++, ...body }
    vehicles.push(v)
    return res(ctx.status(201), ctx.json(v))
  }),

  // Documents
  rest.get('/api/documents', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(documents))
  }),
  rest.post('/api/documents', async (req, res, ctx) => {
    const body = await req.json().catch(()=> null)
    const d = { id: documentId++, ...(body || {}), url: body?.file ? 'https://example.com/mock.pdf' : undefined }
    documents.push(d)
    return res(ctx.status(201), ctx.json(d))
  }),

  // Services
  rest.get('/api/services', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(services))
  }),
  rest.post('/api/services', async (req, res, ctx) => {
    const body = await req.json()
    const s = { id: serviceId++, ...body }
    services.push(s)
    return res(ctx.status(201), ctx.json(s))
  }),

  // Notifications
  rest.get('/api/notifications', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([
      { title: 'Mock: Insurance expiring', body: 'Your car insurance expires in 15 days' },
      { title: 'Mock: Service due', body: 'Vehicle XYZ due for service next week' }
    ]))
  }),

  // Fallback for analytics/schedules -> return empty
  rest.get('/api/:path*', (req, res, ctx) => {
    const p = req.params['path']
    if(p && (p.startsWith('analytics') || p.startsWith('schedules'))) return res(ctx.status(200), ctx.json([]))
    return res(ctx.status(404), ctx.json({ message: 'Not found in mock' }))
  })
]

export default handlers
