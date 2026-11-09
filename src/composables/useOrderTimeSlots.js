import { computed, ref } from 'vue'
import { api } from '../utils/api.js'

const orderTimeSlots = ref([])
const isOrderTimeSlotsLoading = ref(false)
const orderTimeSlotsError = ref(false)
let orderTimeSlotsRequest = null

const upcomingOrderTimeSlots = computed(() => orderTimeSlots.value
  .filter(slot => slot.timestamp > Date.now())
  .sort((a, b) => a.timestamp - b.timestamp))

function formatOrderTimeSlot(slot) {
  const date = new Date(`${slot.date}T${slot.time}`)
  if (!Number.isFinite(date.getTime())) return ''

  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function toLocalDateTimeParts(value) {
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return null

  return {
    date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
    time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }
}

async function loadOrderTimeSlots() {
  if (orderTimeSlotsRequest) return orderTimeSlotsRequest

  isOrderTimeSlotsLoading.value = true
  orderTimeSlotsError.value = false
  orderTimeSlotsRequest = (async () => {
    try {
      const response = await fetch(api('/api/CanOrder/slots'), { headers: { accept: '*/*' } })
      if (!response.ok) throw new Error(`Fetching order time slots failed (HTTP ${response.status})`)

      const slots = await response.json()
      if (!Array.isArray(slots)) throw new Error('Invalid order time slots response')

      orderTimeSlots.value = slots.map(slot => {
        const scheduledAt = slot?.scheduledAt ?? slot?.ScheduledAt
        const scheduledParts = scheduledAt ? toLocalDateTimeParts(scheduledAt) : null
        const date = slot?.date ?? slot?.Date ?? scheduledParts?.date ?? ''
        const time = slot?.time ?? slot?.Time ?? scheduledParts?.time ?? ''
        const slotDate = new Date(`${date}T${time}`)
        const slotId = slot?.slotId ?? slot?.orderTimeSlotId ?? slot?.OrderTimeSlotId
        return {
          key: slotId ?? `${date}T${time}`,
          date,
          time,
          timestamp: slotDate.getTime()
        }
      }).filter(slot => slot.date && slot.time && Number.isFinite(slot.timestamp))
    } catch (error) {
      orderTimeSlots.value = []
      orderTimeSlotsError.value = true
      console.error('Error loading order time slots:', error)
    } finally {
      isOrderTimeSlotsLoading.value = false
      orderTimeSlotsRequest = null
    }
  })()

  return orderTimeSlotsRequest
}

export function useOrderTimeSlots() {
  return {
    upcomingOrderTimeSlots,
    isOrderTimeSlotsLoading,
    orderTimeSlotsError,
    formatOrderTimeSlot,
    loadOrderTimeSlots
  }
}
