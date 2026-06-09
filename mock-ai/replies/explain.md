Good question. Here's the short version.

**Debounce** and **throttle** both limit how often a function runs, but in different ways:

- **Debounce** — waits until the activity *stops*, then fires once. Great for search-as-you-type.
- **Throttle** — fires at most once per interval, no matter how often it's triggered. Great for scroll or resize handlers.

A minimal debounce looks like this:

```js
function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
```

Rule of thumb:

1. Reacting to the *final* state → **debounce**
2. Reacting *during* a continuous event → **throttle**