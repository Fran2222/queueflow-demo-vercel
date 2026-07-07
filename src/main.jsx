import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  ArrowRight,
  BarChart3,
  BellRing,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Command,
  Cpu,
  DatabaseZap,
  Gauge,
  LayoutDashboard,
  Monitor,
  Play,
  Printer,
  QrCode,
  RotateCcw,
  ScanLine,
  Settings2,
  ShieldCheck,
  Sparkles,
  Ticket,
  TimerReset,
  Users,
  Wand2,
  Zap
} from 'lucide-react';
import {
  addTicket,
  callNext,
  completeCurrent,
  formatTime,
  forwardCurrent,
  getDashboardMetrics,
  getState,
  passCurrent,
  recallCurrent,
  resetDemo,
  services,
  subscribeToState
} from './lib/queueStore';
import './styles.css';

function useQueueState() {
  const [state, setState] = useState(() => getState());
  useEffect(() => subscribeToState(setState), []);
  const refresh = () => setState(getState());
  return [state, refresh];
}

function navigate(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('popstate'));
}

function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);
  return path;
}

function Shell({ children, full = false }) {
  return (
    <div className={full ? 'app-shell fullscreen' : 'app-shell'}>
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="grid-bg" />
      <div className="noise" />
      {children}
    </div>
  );
}

function TopNav() {
  const links = [
    ['/', 'Overview'],
    ['/demo', 'Demo Portal'],
    ['/demo/kiosk', 'Kiosk'],
    ['/demo/staff', 'Staff'],
    ['/demo/monitor', 'Monitor'],
    ['/demo/admin', 'Admin']
  ];
  return (
    <header className="top-nav glass-panel">
      <button className="brand-lockup" onClick={() => navigate('/')}>
        <span className="brand-mark"><Command size={18} /></span>
        <span>
          <strong>QueueFlow</strong>
          <small>Interactive demo</small>
        </span>
      </button>
      <nav>
        {links.map(([to, label]) => (
          <button key={to} onClick={() => navigate(to)}>{label}</button>
        ))}
      </nav>
      <button className="pill ghost" onClick={() => navigate('/demo')}>Launch Demo</button>
    </header>
  );
}

function LandingPage() {
  const cards = [
    { icon: <QrCode />, title: 'Kiosk Flow', text: 'Generate demo queue tickets with service-based numbers.' },
    { icon: <LayoutDashboard />, title: 'Staff Console', text: 'Call, recall, pass, forward, and complete queue tickets.' },
    { icon: <Monitor />, title: 'Live Display', text: 'A modern TV-style now-serving screen synced across tabs.' },
    { icon: <ShieldCheck />, title: 'Safe Demo', text: 'No database, no client branding, no secrets, and no backend exposure.' }
  ];
  return (
    <Shell>
      <TopNav />
      <main className="hero container">
        <section className="hero-copy">
          <div className="eyebrow"><Sparkles size={16} /> Front-End Product Preview</div>
          <h1>Premium queue management demo, ready for GitHub and Vercel.</h1>
          <p>
            A neutral, modern, animated UI prototype that lets clients experience kiosk ticketing,
            staff queue handling, live monitor displays, and admin controls without exposing real
            data or production code.
          </p>
          <div className="cta-row">
            <button className="btn primary big" onClick={() => navigate('/demo')}>
              Start Interactive Demo <ArrowRight size={18} />
            </button>
            <button className="btn secondary big" onClick={() => navigate('/demo/admin')}>
              Reset / Inspect Data <Settings2 size={18} />
            </button>
          </div>
          <div className="trust-row">
            <span><ShieldCheck size={16} /> Frontend only</span>
            <span><DatabaseZap size={16} /> No database</span>
            <span><Zap size={16} /> Vercel ready</span>
          </div>
        </section>

        <section className="hero-visual glass-panel">
          <div className="visual-toolbar">
            <span></span><span></span><span></span>
            <strong>Live Queue Preview</strong>
          </div>
          <div className="holo-ticket">
            <div className="ticket-glow" />
            <small>NOW SERVING</small>
            <strong>PX-001</strong>
            <p>Priority Lane · Counter 3</p>
          </div>
          <div className="mini-board">
            <div><small>Waiting</small><strong>4</strong></div>
            <div><small>Serving</small><strong>1</strong></div>
            <div><small>Done</small><strong>0</strong></div>
          </div>
        </section>
      </main>

      <section className="container feature-grid">
        {cards.map((card) => (
          <article className="feature-card glass-panel" key={card.title}>
            <span>{card.icon}</span>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </article>
        ))}
      </section>
    </Shell>
  );
}

function DemoPortal() {
  const portals = [
    { path: '/demo/kiosk', icon: <Ticket />, title: 'Kiosk Ticketing', desc: 'Client-facing service and ticket generation flow.', tag: 'Start here' },
    { path: '/demo/staff', icon: <LayoutDashboard />, title: 'Staff Console', desc: 'Call and manage the live waiting queue.', tag: 'Operator view' },
    { path: '/demo/monitor', icon: <Monitor />, title: 'Live Display Monitor', desc: 'Large-screen now-serving experience.', tag: 'TV display' },
    { path: '/demo/admin', icon: <BarChart3 />, title: 'Admin Preview', desc: 'Inspect stats, logs, services, and reset demo state.', tag: 'Control panel' }
  ];
  return (
    <Shell>
      <TopNav />
      <main className="container page-head">
        <div className="eyebrow"><Play size={16} /> Demo Portal</div>
        <h1>Choose an interactive view.</h1>
        <p>Open multiple pages in different browser tabs to test the simulated real-time queue sync.</p>
      </main>
      <section className="container portal-grid">
        {portals.map((portal) => (
          <button className="portal-card glass-panel" onClick={() => navigate(portal.path)} key={portal.path}>
            <span className="portal-icon">{portal.icon}</span>
            <span className="portal-tag">{portal.tag}</span>
            <h2>{portal.title}</h2>
            <p>{portal.desc}</p>
            <strong>Open demo <ArrowRight size={16} /></strong>
          </button>
        ))}
      </section>
    </Shell>
  );
}

function KioskPage() {
  const [selectedService, setSelectedService] = useState(null);
  const [priority, setPriority] = useState(false);
  const [generated, setGenerated] = useState(null);
  const service = services.find((item) => item.id === selectedService);

  function handleGenerate(transaction) {
    const ticket = addTicket(service.id, transaction, priority);
    setGenerated(ticket);
    setTimeout(() => navigate(`/demo/ticket?id=${encodeURIComponent(ticket.id)}`), 350);
  }

  return (
    <Shell full>
      <div className="kiosk-wrap">
        <button className="corner-back" onClick={() => navigate('/demo')}><ChevronLeft size={18} /> Demo Portal</button>
        <div className="kiosk-card glass-panel cinematic">
          <div className="scanner-bar" />
          <div className="kiosk-header">
            <span className="brand-mark"><QrCode size={24} /></span>
            <div>
              <small>SELF-SERVICE KIOSK</small>
              <h1>{service ? service.name : 'Select a Service Area'}</h1>
            </div>
          </div>

          {!service && (
            <div className="service-grid">
              {services.map((item) => (
                <button key={item.id} className={`service-tile ${item.accent}`} onClick={() => setSelectedService(item.id)}>
                  <span>{item.code}</span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <strong>Select <ChevronRight size={18} /></strong>
                </button>
              ))}
            </div>
          )}

          {service && !generated && (
            <>
              <div className="toggle-row">
                <button className={!priority ? 'active' : ''} onClick={() => setPriority(false)}>Regular Ticket</button>
                <button className={priority ? 'active' : ''} onClick={() => setPriority(true)}>Priority Ticket</button>
              </div>
              <div className="transaction-list">
                {service.transactions.map((transaction) => (
                  <button key={transaction} onClick={() => handleGenerate(transaction)}>
                    <span><ScanLine size={18} /> {transaction}</span>
                    <strong>Get Number <ArrowRight size={16} /></strong>
                  </button>
                ))}
              </div>
              <button className="btn secondary center" onClick={() => setSelectedService(null)}>
                <ChevronLeft size={17} /> Back to Service Areas
              </button>
            </>
          )}

          {generated && (
            <div className="generated-state">
              <Sparkles size={32} />
              <h2>{generated.number}</h2>
              <p>Generating your ticket preview...</p>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}

function TicketPage() {
  const [state] = useQueueState();
  const params = new URLSearchParams(window.location.search);
  const ticket = state.tickets.find((item) => item.id === params.get('id')) || state.tickets[state.tickets.length - 1];

  return (
    <Shell full>
      <div className="ticket-page">
        <div className="ticket-panel glass-panel">
          <div className="ticket-paper">
            <div className="tear top" />
            <small>QUEUE TICKET</small>
            <p>{ticket ? formatTime(ticket.createdAt) : '--:--'}</p>
            <h2>{ticket?.number || '---'}</h2>
            <h3>{ticket?.serviceName || 'Service Queue'}</h3>
            <p>{ticket?.transaction || 'Transaction Preview'}</p>
            <div className="ticket-meta">
              <span>{ticket?.priority ? 'Priority' : 'Regular'}</span>
              <span>{ticket?.status || 'waiting'}</span>
            </div>
            <div className="tear bottom" />
          </div>
          <div className="ticket-actions no-print">
            <button className="btn primary" onClick={() => window.print()}><Printer size={18} /> Print Ticket</button>
            <button className="btn secondary" onClick={() => navigate('/demo/kiosk')}><ChevronLeft size={18} /> Back to Kiosk</button>
            <button className="btn ghost" onClick={() => navigate('/demo/monitor')}><Monitor size={18} /> Open Monitor</button>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function StaffPage() {
  const [state, refresh] = useQueueState();
  const [counterId, setCounterId] = useState(state.counters[0]?.id || 'counter-1');
  const [toast, setToast] = useState('Ready to manage queue.');
  const metrics = getDashboardMetrics(state);
  const current = state.tickets.find((ticket) => ticket.id === state.currentByCounter[counterId]);
  const waiting = state.tickets
    .filter((ticket) => ticket.status === 'waiting')
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority ? -1 : 1;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  function action(label, fn) {
    const result = fn();
    setToast(result ? `${label}: ${result.number}` : 'No active/waiting ticket available.');
    refresh();
  }

  return (
    <Shell>
      <TopNav />
      <main className="container dashboard-layout">
        <section className="dash-main">
          <div className="page-title-row">
            <div>
              <div className="eyebrow"><Users size={16} /> Staff Queue Console</div>
              <h1>Counter management cockpit.</h1>
              <p>Simulated real-time staff operations for queue handling.</p>
            </div>
            <select value={counterId} onChange={(event) => setCounterId(event.target.value)}>
              {state.counters.map((counter) => <option key={counter.id} value={counter.id}>{counter.name}</option>)}
            </select>
          </div>

          <div className="metrics-row">
            <Metric label="Waiting" value={metrics.waiting} icon={<TimerReset />} />
            <Metric label="Serving" value={metrics.serving} icon={<BellRing />} />
            <Metric label="Priority" value={metrics.priority} icon={<Zap />} />
            <Metric label="Completed" value={metrics.done} icon={<CheckCircle2 />} />
          </div>

          <div className="serving-card glass-panel">
            <div className="pulse-orbit" />
            <small>Currently Serving</small>
            <h2>{current?.number || 'Standby'}</h2>
            <p>{current ? `${current.serviceName} · ${current.counterName}` : 'Call next ticket to start serving.'}</p>
            <div className="control-row">
              <button className="btn primary" onClick={() => action('Called', () => callNext(counterId))}><BellRing size={17} /> Call Next</button>
              <button className="btn warning" onClick={() => action('Recalled', () => recallCurrent(counterId))}><RotateCcw size={17} /> Recall</button>
              <button className="btn secondary" onClick={() => action('Passed', () => passCurrent(counterId))}>Pass</button>
              <button className="btn success" onClick={() => action('Done', () => completeCurrent(counterId))}><CheckCircle2 size={17} /> Done</button>
            </div>
            <div className="forward-row">
              {state.counters.filter((counter) => counter.id !== counterId).map((counter) => (
                <button key={counter.id} onClick={() => action('Forwarded', () => forwardCurrent(counterId, counter.id))}>
                  Forward to {counter.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="dash-side">
          <div className="toast glass-panel"><Activity size={18} /> {toast}</div>
          <div className="glass-panel list-card">
            <h3>Waiting Queue</h3>
            <div className="queue-list">
              {waiting.map((ticket) => (
                <div key={ticket.id} className="queue-item">
                  <strong>{ticket.number}</strong>
                  <span>{ticket.serviceName}</span>
                  <small>{formatTime(ticket.createdAt)} · {ticket.priority ? 'Priority' : 'Regular'}</small>
                </div>
              ))}
              {!waiting.length && <p className="empty">No waiting tickets. Generate one from the kiosk.</p>}
            </div>
          </div>
        </aside>
      </main>
    </Shell>
  );
}

function Metric({ label, value, icon }) {
  return (
    <div className="metric glass-panel">
      <span>{icon}</span>
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  );
}

function MonitorPage() {
  const [state] = useQueueState();
  const serving = state.tickets
    .filter((ticket) => ticket.status === 'serving')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const headline = serving[0];
  const waiting = state.tickets.filter((ticket) => ticket.status === 'waiting').slice(0, 5);
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Shell full>
      <div className="monitor-screen">
        <div className="monitor-top glass-panel">
          <div>
            <div className="eyebrow"><Monitor size={16} /> Live Queue Display</div>
            <h1>Now Serving</h1>
          </div>
          <strong>{clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
        </div>

        <section className="now-serving-stage glass-panel">
          <div className="scanline" />
          {headline ? (
            <>
              <small>{headline.serviceName}</small>
              <h2>{headline.number}</h2>
              <p>Please proceed to <strong>{headline.counterName}</strong></p>
            </>
          ) : (
            <>
              <small>STANDBY</small>
              <h2>---</h2>
              <p>No active ticket at the moment.</p>
            </>
          )}
        </section>

        <section className="monitor-grid">
          <div className="glass-panel display-card">
            <h3>Active Counters</h3>
            {state.counters.map((counter) => {
              const ticket = state.tickets.find((item) => item.id === state.currentByCounter[counter.id]);
              return (
                <div className="counter-line" key={counter.id}>
                  <span>{counter.name}</span>
                  <strong>{ticket?.number || '---'}</strong>
                </div>
              );
            })}
          </div>
          <div className="glass-panel display-card">
            <h3>Next in Queue</h3>
            {waiting.map((ticket) => (
              <div className="counter-line" key={ticket.id}>
                <span>{ticket.serviceName}</span>
                <strong>{ticket.number}</strong>
              </div>
            ))}
            {!waiting.length && <p className="empty">Waiting queue is clear.</p>}
          </div>
        </section>
      </div>
    </Shell>
  );
}

function AdminPage() {
  const [state, refresh] = useQueueState();
  const metrics = getDashboardMetrics(state);
  const [copied, setCopied] = useState(false);

  function handleReset() {
    resetDemo();
    refresh();
  }

  function copyExport() {
    navigator.clipboard?.writeText(JSON.stringify(state, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Shell>
      <TopNav />
      <main className="container admin-grid">
        <section className="admin-hero glass-panel">
          <div className="eyebrow"><Gauge size={16} /> Admin Demo Panel</div>
          <h1>Safe mock data controls.</h1>
          <p>This frontend preview stores demo data only in the browser. No backend, no database, no client records.</p>
          <div className="cta-row">
            <button className="btn warning" onClick={handleReset}><RotateCcw size={18} /> Reset Demo Data</button>
            <button className="btn secondary" onClick={copyExport}><DatabaseZap size={18} /> {copied ? 'Copied JSON' : 'Copy Demo JSON'}</button>
          </div>
        </section>

        <section className="metrics-row admin-metrics">
          <Metric label="Total Tickets" value={metrics.total} icon={<Ticket />} />
          <Metric label="Waiting" value={metrics.waiting} icon={<TimerReset />} />
          <Metric label="Serving" value={metrics.serving} icon={<BellRing />} />
          <Metric label="Completed" value={metrics.done} icon={<CheckCircle2 />} />
        </section>

        <section className="glass-panel list-card wide">
          <h3>Service Areas</h3>
          <div className="service-admin-list">
            {state.services.map((service) => (
              <div key={service.id}>
                <strong>{service.name}</strong>
                <p>{service.description}</p>
                <small>{service.transactions.join(' · ')}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel list-card wide">
          <h3>Activity Log</h3>
          <div className="activity-list">
            {state.activity.map((item) => (
              <div key={item.id}>
                <span>{formatTime(item.time)}</span>
                <p>{item.message}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Shell>
  );
}

function NotFound() {
  return (
    <Shell>
      <TopNav />
      <main className="container page-head">
        <div className="eyebrow"><Wand2 size={16} /> Page not found</div>
        <h1>This demo route does not exist.</h1>
        <button className="btn primary" onClick={() => navigate('/demo')}>Return to Demo Portal</button>
      </main>
    </Shell>
  );
}

function App() {
  const path = usePath();
  return useMemo(() => {
    if (path === '/') return <LandingPage />;
    if (path === '/demo') return <DemoPortal />;
    if (path === '/demo/kiosk') return <KioskPage />;
    if (path === '/demo/ticket') return <TicketPage />;
    if (path === '/demo/staff') return <StaffPage />;
    if (path === '/demo/monitor') return <MonitorPage />;
    if (path === '/demo/admin') return <AdminPage />;
    return <NotFound />;
  }, [path]);
}

createRoot(document.getElementById('root')).render(<App />);
