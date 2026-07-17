import axios from 'axios'

// Base axios instance. Point VITE_API_BASE_URL at your backend when it exists.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 20000,
})

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const LEGAL_RESPONSES = [
  "Under Indian consumer protection law, you're entitled to file a complaint within two years of the transaction. Would you like the exact filing steps for your state's consumer forum?",
  'Tenancy notice periods vary by state, but most Rent Control Acts require at least 15-30 days written notice before eviction proceedings can begin. Do you have a written lease?',
  "Under the IT Act 2000, cyberstalking and online harassment are cognizable offences. You can file a complaint at your nearest cyber cell or via cybercrime.gov.in.",
  'The Payment of Wages Act requires wages to be paid within 7-10 days of the wage period ending. If your employer has withheld pay beyond this, you may file a claim with the labour commissioner.',
  'Under the POSH Act, every workplace with 10+ employees must have an Internal Committee to address complaints of sexual harassment. Would you like a checklist for filing a formal complaint?',
]

// Simulated AI chatbot completion — replace with a real endpoint call.
export async function sendChatMessage(message, { signal } = {}) {
  await wait(900 + Math.random() * 700)
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
  const reply = LEGAL_RESPONSES[Math.floor(Math.random() * LEGAL_RESPONSES.length)]
  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: reply,
    timestamp: new Date().toISOString(),
  }
}

// Simulated document analysis — replace with a real endpoint call.
export async function analyzeDocument(file, onProgress) {
  for (let progress = 10; progress <= 100; progress += 15) {
    await wait(220)
    onProgress?.(Math.min(progress, 100))
  }
  return {
    fileName: file.name,
    summary:
      'This agreement is a standard 11-month residential lease between the listed landlord and tenant, covering rent, security deposit, and maintenance obligations.',
    plainLanguageSummary:
      "In simple terms: you're renting this property for 11 months. You pay a refundable deposit up front, and monthly rent by the 5th. Either party can end the agreement early with a month's written notice.",
    keyClauses: [
      { title: 'Security Deposit', detail: '10x monthly rent, refundable within 30 days of vacating, subject to damage deductions.' },
      { title: 'Lock-in Period', detail: 'Minimum stay of 6 months; early exit forfeits one month of deposit.' },
      { title: 'Maintenance', detail: 'Tenant responsible for minor repairs under ₹2,000; landlord covers structural issues.' },
      { title: 'Termination Notice', detail: '30 days written notice required from either party.' },
    ],
    riskScore: 62,
    highlightedRisks: [
      { level: 'high', text: 'Clause 9 allows the landlord to enter the premises without prior notice.' },
      { level: 'medium', text: 'No cap specified on annual rent escalation.' },
      { level: 'low', text: 'Dispute resolution clause names an out-of-state arbitration venue.' },
    ],
  }
}
