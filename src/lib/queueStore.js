const STORAGE_KEY = 'queueflow_demo_state_v1';
const CHANNEL_NAME = 'queueflow_demo_channel';

export const services = [
  {
    id: 'general',
    code: 'G',
    name: 'General Service',
    description: 'General inquiries, assistance, and standard transactions.',
    accent: 'blue',
    transactions: ['General Inquiry', 'Customer Assistance', 'Document Request', 'Basic Processing']
  },
  {
    id: 'payments',
    code: 'P',
    name: 'Payment Counter',
    description: 'Payment processing, billing, cashier, and receipt assistance.',
    accent: 'cyan',
    transactions: ['Payment Processing', 'Billing Concern', 'Receipt Request', 'Account Verification']
  },
  {
    id: 'priority',
    code: 'PR',
    name: 'Priority Lane',
    description: 'Priority assistance for senior citizens, PWD, and urgent support.',
    accent: 'violet',
    transactions: ['Priority Assistance', 'Express Processing', 'Senior Citizen Lane', 'PWD Support']
  },
  {
    id: 'consultation',
    code: 'C',
    name: 'Consultation Desk',
    description: 'Guided support, consultation, and specialized service requests.',
    accent: 'emerald',
    transactions: ['Service Consultation', 'Case Review', 'Custom Request', 'Follow-up Visit']
  }
];

const counters = [
  { id: 'counter-1', name: 'Counter 1', serviceId: 'general' },
  { id: 'counter-2', name: 'Counter 2', serviceId: 'payments' },
  { id: 'counter-3', name: 'Counter 3', serviceId: 'priority' },
  { id: 'counter-4', name: 'Counter 4', serviceId: 'consultation' }
];

const now = () => new Date().toISOString();

function createTicket(serviceId, transaction, priority = false, sequence = 1) {
  const service = services.find((item) => item.id === serviceId) || services[0];
  const prefix = priority ? 'PX' : service.code;
  return {
    id: `${prefix}-${String(sequence).padStart(3, '0')}-${Date.now()}`,
    number: `${prefix}-${String(sequence).padStart(3, '0')}`,
    serviceId,
    serviceName: service.name,
    transaction,
    priority,
    status: 'waiting',
    counterId: null,
    counterName: null,
    createdAt: now(),
    updatedAt: now()
  };
}

const seedTickets = [
  createTicket('general', 'General Inquiry', false, 1),
  createTicket('payments', 'Payment Processing', false, 1),
  createTicket('priority', 'Priority Assistance', true, 1),
  createTicket('consultation', 'Service Consultation', false, 1)
];
seedTickets[0].createdAt = new Date(Date.now() - 1000 * 60 * 16).toISOString();
seedTickets[1].createdAt = new Date(Date.now() - 1000 * 60 * 11).toISOString();
seedTickets[2].createdAt = new Date(Date.now() - 1000 * 60 * 8).toISOString();
seedTickets[3].createdAt = new Date(Date.now() - 1000 * 60 * 5).toISOString();

export function createInitialState() {
  return {
    version: 1,
    services,
    counters,
    sequences: {
      general: 1,
      payments: 1,
      priority: 1,
      consultation: 1,
      priorityGlobal: 1
    },
    tickets: seedTickets,
    currentByCounter: {},
    activity: [
      { id: 'act-1', message: 'Demo environment initialized with sample queue data.', time: now(), type: 'system' }
    ],
    updatedAt: now()
  };
}

export function getState() {
  if (typeof window === 'undefined') return createInitialState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialState();
      setState(initial, false);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return parsed?.version === 1 ? parsed : createInitialState();
  } catch {
    return createInitialState();
  }
}

export function setState(nextState, broadcast = true) {
  if (typeof window === 'undefined') return nextState;
  const cleanState = { ...nextState, updatedAt: now() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanState));
  if (broadcast) {
    try {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage({ type: 'QUEUEFLOW_STATE_UPDATED', state: cleanState });
      channel.close();
    } catch {
      window.dispatchEvent(new Event('queueflow-local-update'));
    }
  }
  return cleanState;
}

export function subscribeToState(callback) {
  if (typeof window === 'undefined') return () => {};

  const onStorage = (event) => {
    if (event.key === STORAGE_KEY) callback(getState());
  };
  const onLocal = () => callback(getState());
  window.addEventListener('storage', onStorage);
  window.addEventListener('queueflow-local-update', onLocal);

  let channel;
  try {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event) => {
      if (event.data?.type === 'QUEUEFLOW_STATE_UPDATED') callback(event.data.state || getState());
    };
  } catch {
    channel = null;
  }

  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('queueflow-local-update', onLocal);
    if (channel) channel.close();
  };
}

export function resetDemo() {
  return setState(createInitialState());
}

export function addTicket(serviceId, transaction, priority = false) {
  const state = getState();
  const sequenceKey = priority ? 'priorityGlobal' : serviceId;
  const nextSequence = (state.sequences[sequenceKey] || 0) + 1;
  const ticket = createTicket(serviceId, transaction, priority, nextSequence);
  const nextState = {
    ...state,
    sequences: { ...state.sequences, [sequenceKey]: nextSequence },
    tickets: [...state.tickets, ticket],
    activity: [
      { id: `act-${Date.now()}`, message: `${ticket.number} created for ${transaction}.`, time: now(), type: 'created' },
      ...state.activity
    ].slice(0, 30)
  };
  setState(nextState);
  return ticket;
}

export function callNext(counterId) {
  const state = getState();
  const counter = state.counters.find((item) => item.id === counterId) || state.counters[0];
  const waiting = state.tickets
    .filter((ticket) => ticket.status === 'waiting')
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority ? -1 : 1;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  if (!waiting.length) return null;

  const currentId = state.currentByCounter[counterId];
  let tickets = state.tickets.map((ticket) => {
    if (ticket.id === currentId) {
      return { ...ticket, status: 'done', updatedAt: now() };
    }
    return ticket;
  });

  const selected = waiting[0];
  tickets = tickets.map((ticket) => {
    if (ticket.id === selected.id) {
      return {
        ...ticket,
        status: 'serving',
        counterId: counter.id,
        counterName: counter.name,
        updatedAt: now()
      };
    }
    return ticket;
  });

  const updatedTicket = tickets.find((ticket) => ticket.id === selected.id);
  const nextState = {
    ...state,
    tickets,
    currentByCounter: { ...state.currentByCounter, [counterId]: selected.id },
    activity: [
      { id: `act-${Date.now()}`, message: `${selected.number} called to ${counter.name}.`, time: now(), type: 'called' },
      ...state.activity
    ].slice(0, 30)
  };
  setState(nextState);
  return updatedTicket;
}

export function recallCurrent(counterId) {
  const state = getState();
  const ticket = state.tickets.find((item) => item.id === state.currentByCounter[counterId]);
  if (!ticket) return null;
  setState({
    ...state,
    activity: [
      { id: `act-${Date.now()}`, message: `${ticket.number} recalled at ${ticket.counterName}.`, time: now(), type: 'recalled' },
      ...state.activity
    ].slice(0, 30)
  });
  return ticket;
}

export function completeCurrent(counterId) {
  const state = getState();
  const currentId = state.currentByCounter[counterId];
  const ticket = state.tickets.find((item) => item.id === currentId);
  if (!ticket) return null;

  const tickets = state.tickets.map((item) => item.id === currentId ? { ...item, status: 'done', updatedAt: now() } : item);
  const currentByCounter = { ...state.currentByCounter };
  delete currentByCounter[counterId];
  setState({
    ...state,
    tickets,
    currentByCounter,
    activity: [
      { id: `act-${Date.now()}`, message: `${ticket.number} marked as completed.`, time: now(), type: 'done' },
      ...state.activity
    ].slice(0, 30)
  });
  return ticket;
}

export function passCurrent(counterId) {
  const state = getState();
  const currentId = state.currentByCounter[counterId];
  const ticket = state.tickets.find((item) => item.id === currentId);
  if (!ticket) return null;

  const tickets = state.tickets.map((item) => item.id === currentId ? { ...item, status: 'waiting', counterId: null, counterName: null, updatedAt: now() } : item);
  const currentByCounter = { ...state.currentByCounter };
  delete currentByCounter[counterId];
  setState({
    ...state,
    tickets,
    currentByCounter,
    activity: [
      { id: `act-${Date.now()}`, message: `${ticket.number} passed back to waiting queue.`, time: now(), type: 'passed' },
      ...state.activity
    ].slice(0, 30)
  });
  return ticket;
}

export function forwardCurrent(counterId, targetCounterId) {
  const state = getState();
  const currentId = state.currentByCounter[counterId];
  const ticket = state.tickets.find((item) => item.id === currentId);
  const target = state.counters.find((item) => item.id === targetCounterId);
  if (!ticket || !target) return null;

  const tickets = state.tickets.map((item) => item.id === currentId ? {
    ...item,
    status: 'serving',
    counterId: target.id,
    counterName: target.name,
    updatedAt: now()
  } : item);
  const currentByCounter = { ...state.currentByCounter, [target.id]: currentId };
  delete currentByCounter[counterId];
  setState({
    ...state,
    tickets,
    currentByCounter,
    activity: [
      { id: `act-${Date.now()}`, message: `${ticket.number} forwarded to ${target.name}.`, time: now(), type: 'forwarded' },
      ...state.activity
    ].slice(0, 30)
  });
  return ticket;
}

export function getDashboardMetrics(state) {
  const tickets = state.tickets || [];
  return {
    waiting: tickets.filter((ticket) => ticket.status === 'waiting').length,
    serving: tickets.filter((ticket) => ticket.status === 'serving').length,
    done: tickets.filter((ticket) => ticket.status === 'done').length,
    priority: tickets.filter((ticket) => ticket.priority && ticket.status !== 'done').length,
    total: tickets.length
  };
}

export function formatTime(dateString) {
  try {
    return new Intl.DateTimeFormat('en', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  } catch {
    return '--:--';
  }
}
