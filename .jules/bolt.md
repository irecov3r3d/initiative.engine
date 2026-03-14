## 2025-03-14 - Prevent array reallocation in React renders
**Learning:** In highly interactive React components (like timers updating every second), defining static arrays inside the component body causes them to be reallocated in memory on every render cycle. While sometimes unnoticeable, doing this in high-frequency update loops adds unnecessary pressure to the JavaScript garbage collector.
**Action:** Always extract static configurations (like `breathSequence`) outside of the component body as constants when they do not depend on component state or props.
