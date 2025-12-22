## Dev over LAN

If you want to open the app on your phone (same Wi‑Fi):

1. Start Vite with LAN host: `npm run dev -- --host`
2. Ensure the backend is reachable from the phone (bind to 0.0.0.0 and allow firewall).
3. Optional: create `.env.development` with:

```
VITE_API_BASE_URL=https://localhost:7175
```

The dev server is configured to proxy `/api` and `/images` to the backend and will work over LAN.

# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
