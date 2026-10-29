# ReactorLab.tsx — required edits

## 1. Clamp temperature/pressure when the reactor type changes

**Bug:** the sliders' `max` attribute updates when you switch reactor type,
but the *stored* `temperature`/`pressure` values don't. Set pressure to
5 atm in Batch, switch to Vacuum (max 0.001 atm), and `run()` immediately
fails with "Reactor maximum pressure exceeded" — confusing, since the
slider now visually shows a value past its own max.

Add this effect (needs `useEffect` in the import from `'react'`):

```tsx
useEffect(() => {
  setTemperature(t => Math.min(t, config.maxTemperature));
  setPressure(p => Math.min(p, config.maxPressure));
}, [reactorType, config.maxTemperature, config.maxPressure]);
```

Place it right after the `config` line:

```tsx
const config = REACTOR_CONFIGS.find(r => r.type === reactorType)!;

useEffect(() => {
  setTemperature(t => Math.min(t, config.maxTemperature));
  setPressure(p => Math.min(p, config.maxPressure));
}, [reactorType, config.maxTemperature, config.maxPressure]);
```

## 2. Import fix

The top of the file needs `useEffect` added to the react import:

```tsx
import React, { useState, useCallback, useEffect } from 'react';
```

## 3. (Optional but recommended) surface reactor-limit errors in the UI

Right now if `run()` fails on the reactor-limit check, the failure only
shows up in `result.message` — same as any other failed reaction. That's
fine functionally now that #1 prevents it from happening via slider drift,
but if you add a "load recipe" feature later, a loaded recipe with
out-of-range conditions for the *current* reactor would still silently
fail. Worth a dedicated toast/banner if you build that feature.
